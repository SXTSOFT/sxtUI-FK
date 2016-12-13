/**
 * Created by emma on 2016/9/28.
 */

(function(){
  'use strict';
  angular.module('gantt').factory('GanttRow', ['GanttTask', 'moment', '$filter', function(Task, moment, $filter) {
    var Row = function(rowsManager, model) {
      this.rowsManager = rowsManager;
      this.model = model;

      this.from = undefined;
      this.to = undefined;
      this.realFrom = undefined;
      this.realTo = undefined;
      this.duration = undefined;
      //this.duration = model.tasks&&model.tasks[0].duration;

      this.tasksMap = {};
      this.tasks = [];
      this.filteredTasks = [];
      this.visibleTasks = [];
    };

    Row.prototype.addTaskImpl = function(task, viewOnly) {
      this.tasksMap[task.model.id] = task;
      this.tasks.push(task);

      if (!viewOnly) {
        if (this.model.tasks === undefined) {
          this.model.tasks = [];
        }
        if (this.model.tasks.indexOf(task.model) === -1) {
          this.model.tasks.push(task.model);
        }
      }

    };

    // Adds a task to a specific row. Merges the task if there is already one with the same id
    Row.prototype.addTask = function(taskModel, viewOnly) {
      // Copy to new task (add) or merge with existing (update)
      var task, isUpdate = false;

      this.rowsManager.gantt.objectModel.cleanTask(taskModel);
      if (taskModel.id in this.tasksMap) {
        task = this.tasksMap[taskModel.id];
        if (task.model === taskModel) {
          return task;
        }
        task.model = taskModel;
        isUpdate = true;
      } else {
        task = new Task(this, taskModel);
        this.addTaskImpl(task, viewOnly);
      }

      this.sortTasks();
      this.setFromToByTask(task);

      if (!viewOnly) {
        if (isUpdate) {
          this.rowsManager.gantt.api.tasks.raise.change(task);
        } else {
          this.rowsManager.gantt.api.tasks.raise.add(task);
        }
      }

      return task;
    };

    // Removes the task from the existing row and adds it to he current one
    Row.prototype.moveTaskToRow = function(task, viewOnly) {
      var oldRow = task.row;
      oldRow.removeTask(task.model.id, viewOnly, true);

      task.row = this;
      this.addTaskImpl(task, viewOnly);

      this.sortTasks();
      this.setFromToByTask(task);

      task.updatePosAndSize();
      this.updateVisibleTasks();

      oldRow.$scope.$digest();
      task.row.$scope.$digest();

      this.rowsManager.gantt.api.tasks.raise.viewRowChange(task, oldRow);
      if (!viewOnly) {
        this.rowsManager.gantt.api.tasks.raise.rowChange(task, oldRow);
      }
    };

    Row.prototype.updateVisibleTasks = function() {
      var filterTask = this.rowsManager.gantt.options.value('filterTask');
      if (filterTask) {
        if (typeof(filterTask) === 'object') {
          filterTask = {model: filterTask};
        }

        var filterTaskComparator = this.rowsManager.gantt.options.value('filterTaskComparator');
        if (typeof(filterTaskComparator) === 'function') {
          filterTaskComparator = function(actual, expected) {
            return filterTaskComparator(actual.model, expected.model);
          };
        }

        this.filteredTasks = $filter('filter')(this.tasks, filterTask, filterTaskComparator);
      } else {
        this.filteredTasks = this.tasks.slice(0);
      }
      this.visibleTasks = $filter('ganttTaskLimit')(this.filteredTasks, this.rowsManager.gantt);
    };

    Row.prototype.updateTasksPosAndSize = function() {
      for (var j = 0, k = this.tasks.length; j < k; j++) {
        this.tasks[j].updatePosAndSize();
      }
    };

    // Remove the specified task from the row
    Row.prototype.removeTask = function(taskId, viewOnly, silent) {
      if (taskId in this.tasksMap) {
        var removedTask = this.tasksMap[taskId];
        var task;
        var i;

        for (i = this.tasks.length - 1; i >= 0; i--) {
          task = this.tasks[i];
          if (task.model.id === taskId) {
            this.tasks.splice(i, 1); // Remove from array

            // Update earliest or latest date info as this may change
            if (this.from - task.model.from === 0 || this.to - task.model.to === 0) {
              this.setFromTo();
            }

            break;
          }
        }

        for (i = this.filteredTasks.length - 1; i >= 0; i--) {
          task = this.filteredTasks[i];
          if (task.model.id === taskId) {
            this.filteredTasks.splice(i, 1); // Remove from filtered array
            break;
          }
        }

        for (i = this.visibleTasks.length - 1; i >= 0; i--) {
          task = this.visibleTasks[i];
          if (task.model.id === taskId) {
            this.visibleTasks.splice(i, 1); // Remove from visible array
            break;
          }
        }

        if (!viewOnly) {
          delete this.tasksMap[taskId]; // Remove from map

          if (this.model.tasks !== undefined) {
            var taskIndex = this.model.tasks.indexOf(removedTask.model);
            if (taskIndex > -1) {
              this.model.tasks.splice(taskIndex, 1);
            }
          }

          if (!silent) {
            this.rowsManager.gantt.api.tasks.raise.remove(removedTask);
          }
        }

        return removedTask;
      }
    };

    Row.prototype.removeAllTasks = function() {
      this.from = undefined;
      this.to = undefined;
      this.realFrom = undefined;
      this.realTo = undefined;

      this.duration = undefined;

      this.tasksMap = {};
      this.tasks = [];
      this.filteredTasks = [];
      this.visibleTasks = [];
    };

    // Calculate the earliest from and latest to date of all tasks in a row
    Row.prototype.setFromTo = function() {
      this.from = undefined;
      this.to = undefined;
      this.realFrom = undefined;
      this.realTo = undefined;
      this.duration = undefined;

      for (var j = 0, k = this.tasks.length; j < k; j++) {
        this.setFromToByTask(this.tasks[j]);
      }
    };

    Row.prototype.setFromToByTask = function(task) {
      this.setFromToByValues(task.model.from, task.model.to,task.model.realFrom,task.model.realTo);
    };

    Row.prototype.setFromToByValues = function(from, to,realFrom,realTo) {
      if (from !== undefined) {
        if (this.from === undefined) {
          this.from = moment(from);
        } else if (from < this.from) {
          this.from = moment(from);
        }
      }

      if (to !== undefined) {
        if (this.to === undefined) {
          this.to = moment(to);
        } else if (to > this.to) {
          this.to = moment(to);
        }
      }
      if(from !==undefined && to !== undefined){
        this.duration = this.to.diff(this.from, 'day');
      }
      if(realFrom !==undefined){
        if (this.realFrom === undefined) {
          this.realFrom = moment(realFrom);
        } else if (realFrom > this.realFrom) {
          this.realFrom = moment(realFrom);
        }
      }
      if(realTo !==undefined){
        if (this.realTo === undefined) {
          this.realTo = moment(realTo);
        } else if (realTo > this.realTo) {
          this.realTo = moment(realTo);
        }
      }

    };

    Row.prototype.sortTasks = function() {
      this.tasks.sort(function(t1, t2) {
        return t1.left - t2.left;
      });
    };

    Row.prototype.clone = function() {
      var clone = new Row(this.rowsManager, angular.copy(this));
      for (var i = 0, l = this.tasks.length; i < l; i++) {
        clone.addTask(this.tasks[i].model);
      }
      return clone;
    };

    return Row;
  }]);
}());

(function(){
  'use strict';
  angular.module('gantt').factory('GanttColumnsManager', ['GanttColumnGenerator', 'GanttColumnBuilder', 'GanttHeadersGenerator', '$filter', '$timeout', 'ganttLayout', 'ganttBinarySearch', 'moment', function(ColumnGenerator, ColumnBuilder, HeadersGenerator, $filter, $timeout, layout, bs, moment) {
    var ColumnsManager = function(gantt) {
      var self = this;

      this.gantt = gantt;

      this.from = undefined;
      this.to = undefined;

      this.columns = [];
      this.visibleColumns = [];
      this.previousColumns = [];
      this.nextColumns = [];

      this.headers = [];
      this.visibleHeaders = [];

      this.scrollAnchor = undefined;

      this.columnBuilder = new ColumnBuilder(this);

      // Add a watcher if a view related setting changed from outside of the Gantt. Update the gantt accordingly if so.
      // All those changes need a recalculation of the header columns
      this.gantt.$scope.$watchGroup(['viewScale', 'columnWidth', 'timeFramesWorkingMode', 'timeFramesNonWorkingMode', 'fromDate', 'toDate', 'autoExpand', 'taskOutOfRange'], function(newValues, oldValues) {
        if (newValues !== oldValues && self.gantt.rendered) {
          self.generateColumns();
        }
      });

      this.gantt.$scope.$watchCollection('headers', function(newValues, oldValues) {
        if (newValues !== oldValues && self.gantt.rendered) {
          self.generateColumns();
        }
      });

      this.gantt.$scope.$watchCollection('headersFormats', function(newValues, oldValues) {
        if (newValues !== oldValues && self.gantt.rendered) {
          self.generateColumns();
        }
      });

      this.gantt.$scope.$watchGroup(['ganttElementWidth', 'showSide', 'sideWidth', 'maxHeight', 'daily'], function(newValues, oldValues) {
        if (newValues !== oldValues && self.gantt.rendered) {
          self.updateColumnsMeta();
        }
      });

      this.gantt.api.data.on.load(this.gantt.$scope, function() {
        if ((self.from === undefined || self.to === undefined ||
          self.from > self.gantt.rowsManager.getDefaultFrom() ||
          self.to < self.gantt.rowsManager.getDefaultTo()) && self.gantt.rendered) {
          self.generateColumns();
        }

        self.gantt.rowsManager.sortRows();
      });

      this.gantt.api.data.on.remove(this.gantt.$scope, function() {
        self.gantt.rowsManager.sortRows();
      });

      this.gantt.api.registerMethod('columns', 'clear', this.clearColumns, this);
      this.gantt.api.registerMethod('columns', 'generate', this.generateColumns, this);
      this.gantt.api.registerMethod('columns', 'refresh', this.updateColumnsMeta, this);
      this.gantt.api.registerMethod('columns', 'getColumnsWidth', this.getColumnsWidth, this);
      this.gantt.api.registerMethod('columns', 'getColumnsWidthToFit', this.getColumnsWidthToFit, this);
      this.gantt.api.registerMethod('columns', 'getDateRange', this.getDateRange, this);

      this.gantt.api.registerEvent('columns', 'clear');
      this.gantt.api.registerEvent('columns', 'generate');
      this.gantt.api.registerEvent('columns', 'refresh');
    };

    ColumnsManager.prototype.setScrollAnchor = function() {
      if (this.gantt.scroll.$element && this.columns.length > 0) {
        var el = this.gantt.scroll.$element[0];
        var center = el.scrollLeft + el.offsetWidth / 2;

        this.scrollAnchor = this.gantt.getDateByPosition(center);
      }
    };

    ColumnsManager.prototype.scrollToScrollAnchor = function() {
      var self = this;

      if (this.columns.length > 0 && this.scrollAnchor !== undefined) {
        // Ugly but prevents screen flickering (unlike $timeout)
        this.gantt.$scope.$$postDigest(function() {
          self.gantt.api.scroll.toDate(self.scrollAnchor);
        });
      }
    };

    ColumnsManager.prototype.clearColumns = function() {
      this.setScrollAnchor();

      this.from = undefined;
      this.to = undefined;

      this.columns = [];
      this.visibleColumns = [];
      this.previousColumns = [];
      this.nextColumns = [];

      this.headers = [];
      this.visibleHeaders = [];

      this.gantt.api.columns.raise.clear();
    };

    ColumnsManager.prototype.generateColumns = function(from, to) {
      if (!from) {
        from = this.gantt.options.value('fromDate');
      }

      if (!to) {
        to = this.gantt.options.value('toDate');
      }

      if (!from || (moment.isMoment(from) && !from.isValid())) {
        from = this.gantt.rowsManager.getDefaultFrom();
        if (!from) {
          return false;
        }
      }

      if (!to || (moment.isMoment(to) && !to.isValid())) {
        to = this.gantt.rowsManager.getDefaultTo();
        if (!to) {
          return false;
        }
      }

      if (from !== undefined && !moment.isMoment(from)) {
        from = moment(from);
      }

      if (to !== undefined && !moment.isMoment(to)) {
        to = moment(to);
      }

      if (this.gantt.options.value('taskOutOfRange') === 'expand') {
        from = this.gantt.rowsManager.getExpandedFrom(from);
        to = this.gantt.rowsManager.getExpandedTo(to);
      }

      this.setScrollAnchor();

      this.from = from;
      this.to = to;
      this.duration = this.to.diff(this.from, 'day');
      this.columns = ColumnGenerator.generate(this.columnBuilder, from, to, this.gantt.options.value('viewScale'), this.getColumnsWidth());
      this.headers = HeadersGenerator.generate(this);
      this.previousColumns = [];
      this.nextColumns = [];

      this.updateColumnsMeta();
      this.scrollToScrollAnchor();

      this.gantt.api.columns.raise.generate(this.columns, this.headers);
    };

    ColumnsManager.prototype.updateColumnsMeta = function() {
      this.gantt.isRefreshingColumns = true;

      var lastColumn = this.getLastColumn();
      this.gantt.originalWidth = lastColumn !== undefined ? lastColumn.originalSize.left + lastColumn.originalSize.width : 0;

      var columnsWidthChanged = this.updateColumnsWidths(this.columns,  this.headers, this.previousColumns, this.nextColumns);

      this.gantt.width = lastColumn !== undefined ? lastColumn.left + lastColumn.width : 0;

      var showSide = this.gantt.options.value('showSide');
      var sideShown = this.gantt.side.isShown();
      var sideVisibilityChanged = showSide !== sideShown;

      if (sideVisibilityChanged && !showSide) {
        // Prevent unnecessary v-scrollbar if side is hidden here
        this.gantt.side.show(false);
      }

      this.gantt.rowsManager.updateTasksPosAndSize();
      this.gantt.timespansManager.updateTimespansPosAndSize();

      this.updateVisibleColumns(columnsWidthChanged);

      this.gantt.rowsManager.updateVisibleObjects();

      var currentDateValue = this.gantt.options.value('currentDateValue');
      this.gantt.currentDateManager.setCurrentDate(currentDateValue);

      if (sideVisibilityChanged && showSide) {
        // Prevent unnecessary v-scrollbar if side is shown here
        this.gantt.side.show(true);
      }

      this.gantt.isRefreshingColumns = false;
      this.gantt.api.columns.raise.refresh(this.columns, this.headers);
    };

    // Returns the last Gantt column or undefined
    ColumnsManager.prototype.getLastColumn = function(extended) {
      var columns = this.columns;
      if (extended) {
        columns = this.nextColumns;
      }
      if (columns && columns.length > 0) {
        return columns[columns.length - 1];
      } else {
        return undefined;
      }
    };

    // Returns the first Gantt column or undefined
    ColumnsManager.prototype.getFirstColumn = function(extended) {
      var columns = this.columns;
      if (extended) {
        columns = this.previousColumns;
      }

      if (columns && columns.length > 0) {
        return columns[0];
      } else {
        return undefined;
      }
    };

    // Returns the column at the given or next possible date
    ColumnsManager.prototype.getColumnByDate = function(date, disableExpand) {
      if (!disableExpand) {
        this.expandExtendedColumnsForDate(date);
      }
      var extendedColumns = this.previousColumns.concat(this.columns, this.nextColumns);
      var columns = bs.get(extendedColumns, date, function(c) {
        return c.date;
      }, true);
      return columns[0] === undefined ? columns[1] : columns[0];
    };

    // Returns the column at the given position x (in em)
    ColumnsManager.prototype.getColumnByPosition = function(x, disableExpand) {
      if (!disableExpand) {
        this.expandExtendedColumnsForPosition(x);
      }
      var extendedColumns = this.previousColumns.concat(this.columns, this.nextColumns);
      var columns = bs.get(extendedColumns, x, function(c) {
        return c.left;
      }, true);
      return columns[0] === undefined ? columns[1]: columns[0];
    };

    ColumnsManager.prototype.updateColumnsWidths = function(columns,  headers, previousColumns, nextColumns) {
      var columnWidth = this.gantt.options.value('columnWidth');
      var expandToFit = this.gantt.options.value('expandToFit');
      var shrinkToFit = this.gantt.options.value('shrinkToFit');

      if (columnWidth === undefined || expandToFit || shrinkToFit) {
        var newWidth = this.gantt.getBodyAvailableWidth();

        var lastColumn = this.gantt.columnsManager.getLastColumn(false);
        if (lastColumn !== undefined) {
          var currentWidth = lastColumn.originalSize.left + lastColumn.originalSize.width;

          if (expandToFit && currentWidth < newWidth ||
            shrinkToFit && currentWidth > newWidth ||
            columnWidth === undefined
          ) {
            var widthFactor = newWidth / currentWidth;

            layout.setColumnsWidthFactor(columns, widthFactor);
            for (var i=0; i< headers.length; i++) {
              layout.setColumnsWidthFactor(headers[i], widthFactor);
            }
            // previous and next columns will be generated again on need.
            previousColumns.splice(0, this.previousColumns.length);
            nextColumns.splice(0, this.nextColumns.length);
            return true;
          }
        }
      }
      return false;
    };

    ColumnsManager.prototype.getColumnsWidth = function() {
      var columnWidth = this.gantt.options.value('columnWidth');
      if (columnWidth === undefined) {
        if (!this.gantt.width || this.gantt.width <= 0) {
          columnWidth = 20;
        } else {
          columnWidth = this.gantt.width / this.columns.length;
        }
      }
      return columnWidth;
    };

    ColumnsManager.prototype.getColumnsWidthToFit = function() {
      return this.gantt.getBodyAvailableWidth() / this.columns.length;
    };

    ColumnsManager.prototype.expandExtendedColumnsForPosition = function(x) {
      var viewScale;
      if (x < 0) {
        var firstColumn = this.getFirstColumn();
        var from = firstColumn.date;
        var firstExtendedColumn = this.getFirstColumn(true);
        if (!firstExtendedColumn || firstExtendedColumn.left > x) {
          viewScale = this.gantt.options.value('viewScale');
          this.previousColumns = ColumnGenerator.generate(this.columnBuilder, from, undefined, viewScale, this.getColumnsWidth(), -x, 0, true);
        }
        return true;
      } else if (x > this.gantt.width) {
        var lastColumn = this.getLastColumn();
        var endDate = lastColumn.getDateByPosition(lastColumn.width);
        var lastExtendedColumn = this.getLastColumn(true);
        if (!lastExtendedColumn || lastExtendedColumn.left + lastExtendedColumn.width < x) {
          viewScale = this.gantt.options.value('viewScale');
          this.nextColumns = ColumnGenerator.generate(this.columnBuilder, endDate, undefined, viewScale, this.getColumnsWidth(), x - this.gantt.width, this.gantt.width, false);
        }
        return true;
      }
      return false;
    };

    ColumnsManager.prototype.expandExtendedColumnsForDate = function(date) {
      var firstColumn = this.getFirstColumn();
      var from;
      if (firstColumn) {
        from = firstColumn.date;
      }

      var lastColumn = this.getLastColumn();
      var endDate;
      if (lastColumn) {
        endDate = lastColumn.getDateByPosition(lastColumn.width);
      }

      var viewScale;
      if (from && date < from) {
        var firstExtendedColumn = this.getFirstColumn(true);
        if (!firstExtendedColumn || firstExtendedColumn.date > date) {
          viewScale = this.gantt.options.value('viewScale');
          this.previousColumns = ColumnGenerator.generate(this.columnBuilder, from, date, viewScale, this.getColumnsWidth(), undefined, 0, true);
        }
        return true;
      } else if (endDate && date >= endDate) {
        var lastExtendedColumn = this.getLastColumn(true);
        if (!lastExtendedColumn || lastExtendedColumn.date < endDate) {
          viewScale = this.gantt.options.value('viewScale');
          this.nextColumns = ColumnGenerator.generate(this.columnBuilder, endDate, date, viewScale, this.getColumnsWidth(), undefined, this.gantt.width, false);
        }
        return true;
      }
      return false;
    };

    // Returns the number of active headers
    ColumnsManager.prototype.getActiveHeadersCount = function() {
      return this.headers.length;
    };

    ColumnsManager.prototype.updateVisibleColumns = function(includeViews) {
      this.visibleColumns = $filter('ganttColumnLimit')(this.columns, this.gantt);

      this.visibleHeaders = [];
      for (var i=0; i< this.headers.length; i++) {
        this.visibleHeaders.push($filter('ganttColumnLimit')(this.headers[i], this.gantt));
      }

      if (includeViews) {
        for (i=0; i<this.visibleColumns.length; i++) {
          this.visibleColumns[i].updateView();
        }
        for (i=0; i<this.visibleHeaders.length; i++) {
          var headerRow = this.visibleHeaders[i];
          for (var j=0; j<headerRow.length; j++) {
            headerRow[j].updateView();
          }
        }
      }

      var currentDateValue = this.gantt.options.value('currentDateValue');
      this.gantt.currentDateManager.setCurrentDate(currentDateValue);
    };

    var defaultHeadersFormats = {'year': 'YYYY', 'quarter': '[Q]Q YYYY', month: 'YYYY-MM', week: 'w', day: 'D', hour: 'H', minute:'HH:mm'};
    var defaultDayHeadersFormats = {day: 'LL', hour: 'H', minute:'HH:mm'};
    var defaultYearHeadersFormats = {'year': 'YYYY', 'quarter': '[Q]Q', month: 'MM'};

    ColumnsManager.prototype.getHeaderFormat = function(unit) {
      var format;
      var headersFormats = this.gantt.options.value('headersFormats');
      if (headersFormats !== undefined) {
        format = headersFormats[unit];
      }
      if (format === undefined) {
        var viewScale = this.gantt.options.value('viewScale');
        viewScale = viewScale.trim();
        if (viewScale.charAt(viewScale.length - 1) === 's') {
          viewScale = viewScale.substring(0, viewScale.length - 1);
        }

        var viewScaleUnit;
        var splittedViewScale;

        if (viewScale) {
          splittedViewScale = viewScale.split(' ');
        }
        if (splittedViewScale && splittedViewScale.length > 1) {
          viewScaleUnit = splittedViewScale[splittedViewScale.length - 1];
        } else {
          viewScaleUnit = viewScale;
        }

        if (['millisecond', 'second', 'minute', 'hour'].indexOf(viewScaleUnit) > -1) {
          format = defaultDayHeadersFormats[unit];
        } else if (['month', 'quarter', 'year'].indexOf(viewScaleUnit) > -1) {
          format = defaultYearHeadersFormats[unit];
        }
        if (format === undefined) {
          format = defaultHeadersFormats[unit];
        }
      }
      return format;
    };

    ColumnsManager.prototype.getDateRange = function(visibleOnly) {
      var firstColumn, lastColumn;

      if (visibleOnly) {
        if (this.visibleColumns && this.visibleColumns.length > 0) {
          firstColumn = this.visibleColumns[0];
          lastColumn = this.visibleColumns[this.visibleColumns.length - 1];
        }
      } else {
        firstColumn = this.getFirstColumn();
        lastColumn = this.getLastColumn();
      }

      return firstColumn && lastColumn ? [firstColumn.date, lastColumn.endDate]: undefined;
    };

    return ColumnsManager;
  }]);
}());
angular.module('gantt.tree.templates', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('plugins/tree/sideContentTree.tmpl.html',
    '<div class="gantt-side-content-tree" ng-controller="GanttTreeController">\n' +
    '    <gantt-tree-header>\n' +
    '    </gantt-tree-header>\n' +
    '    <gantt-tree-body>\n' +
    '    </gantt-tree-body>\n' +
    '</div>\n' +
    '');
  $templateCache.put('plugins/tree/treeBody.tmpl.html',
    '<div class="gantt-tree-body" ng-style="getLabelsCss()">\n' +
    '    <div gantt-vertical-scroll-receiver>\n' +
    '        <div class="gantt-row-label-background">\n' +
    '            <div class="gantt-row-label gantt-row-height"\n' +
    '                 ng-class="row.model.classes"\n' +
    '                 ng-style="{\'height\': row.model.height}"\n' +
    '                 ng-repeat="row in gantt.rowsManager.visibleRows track by row.model.id">\n' +
    '                &nbsp;\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div ui-tree ng-controller="GanttUiTreeController" data-drag-enabled="false" data-empty-place-holder-enabled="false">\n' +
    '            <ol class="gantt-tree-root" ui-tree-nodes ng-model="rootRows">\n' +
    '                <li ng-repeat="row in rootRows" ui-tree-node\n' +
    '                    ng-include="\'plugins/tree/treeBodyChildren.tmpl.html\'">\n' +
    '                </li>\n' +
    '            </ol>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
  $templateCache.put('plugins/tree/treeBodyChildren.tmpl.html',
    '<div ng-controller="GanttTreeNodeController"\n' +
    '     class="gantt-row-label gantt-row-height"\n' +
    '     ng-class="row.model.classes"\n' +
    '     ng-style="{\'height\': row.model.height}">\n' +
    '    <div class="gantt-valign-container">\n' +
    '        <div class="gantt-valign-content">\n' +
    '            <a ng-disabled="isCollapseDisabled()" data-nodrag\n' +
    '               class="gantt-tree-handle-button btn btn-xs"\n' +
    '               ng-class="{\'gantt-tree-collapsed\': collapsed, \'gantt-tree-expanded\': !collapsed}"\n' +
    '               ng-click="!isCollapseDisabled() && toggle()"><span\n' +
    '                class="gantt-tree-handle glyphicon glyphicon-minus"\n' +
    '                ng-class="{\n' +
    '                \'glyphicon-plus\': collapsed, \'glyphicon-minus\': !collapsed,\n' +
    '                \'gantt-tree-collapsed\': collapsed, \'gantt-tree-expanded\': !collapsed}"></span>\n' +
    '            </a>\n' +
    '            <span gantt-row-label class="gantt-label-text" gantt-bind-compile-html="getRowContent()"/>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '<ol ui-tree-nodes ng-class="{hidden: collapsed}" ng-model="childrenRows">\n' +
    '    <li ng-repeat="row in childrenRows" ui-tree-node>\n' +
    '        <div ng-include="\'plugins/tree/treeBodyChildren.tmpl.html\'"></div>\n' +
    '    </li>\n' +
    '</ol>\n' +
    '');
  $templateCache.put('plugins/tree/treeHeader.tmpl.html',
    '<div class="gantt-tree-header" ng-style="{height: $parent.ganttHeaderHeight + \'px\'}">\n' +
    '    <div ng-if="$parent.ganttHeaderHeight" class="gantt-row-label gantt-row-label-header gantt-tree-row gantt-tree-header-row"><span class="gantt-label-text" gantt-bind-compile-html="getHeaderContent()"/></div>\n' +
    '</div>\n' +
    '');
}]);
