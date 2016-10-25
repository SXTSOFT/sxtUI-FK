/**
 * Created by UUI on 2016/9/27.
 */
(function(angular,undefined){
  'use strict';

  angular
    .module('app.plan')
    .component('planGantt',{
      templateUrl:'app/main/plan/component/plan-gantt.html',
      controller:plangantt,
      controllerAs:'vm'
    });

  /** @ngInject */
  function plangantt($mdDialog, $document,$rootScope, $animate, $scope, $timeout,utils, ganttUtils,$mdPanel, GanttObjectModel, ganttDebounce, moment, $window, $mdSidenav,api,$stateParams,$q){
    var vm = this;
    var objectModel;
    vm.timespans = [
      {
        from: new Date(2013, 9, 21, 8, 0, 0),
        to: new Date(2013, 9, 25, 15, 0, 0),
        name: 'Sprint 1 Timespan'
      }
    ];

    $mdDialog.show({
      controller:['$scope',function($scope){
        $scope.hide = function(){
          $mdDialog.cancel();
        }
      }],
      template: '<md-dialog style="background-color: transparent;box-shadow: none;"><md-dialog-content ><div layout="row" layout-align="center center"><md-progress-circular md-mode="indeterminate"></md-progress-circular></div><div layout="row" layout-align="center center">正在生成，请稍后...</div></md-dialog-content></md-dialog>',
      parent: angular.element('#content'),
      clickOutsideToClose:false,
      hasBackdrop:true,
      escapeToClose: true,
      focusOnOpen: true
    })

    $scope.$watch('vm.gantt',function(){
      $mdDialog.hide();
    })
    // Data
    vm.live = {};
    vm.options = {
      mode                    : 'custom',
      scale                   : 'day',
      sortMode                : undefined,
      sideMode                : 'TreeTable',
      daily                   : false,
      maxHeight               : 300,
      width                   : true,
      zoom                    : 1,
      rowSortable             : false,
      columns                 : ['model.name', 'from', 'to'],
      treeTableColumns        : ['from', 'to'],
      columnsHeaders          : {
        'model.name': 'Name',
        'from'      : '开始时间',
        'to'        : '结束时间'
      },
      columnsClasses          : {
        'model.name': 'gantt-column-name',
        'from'      : 'gantt-column-from',
        'to'        : 'gantt-column-to'
      },
      columnsFormatters       : {
        'from': function (from)
        {
          return angular.isDefined(from) ? from.format('YY-MM-DD') : undefined;
        },
        'to'  : function (to)
        {
          return angular.isDefined(to) ? to.format('YY-MM-DD') : undefined;
        }
      },
      treeHeaderContent       : '{{getHeader()}}',
      treeHeader:'计划',
      columnsHeaderContents   : {
        'model.name': '{{getHeader()}}',
        'from'      : '{{getHeader()}}',
        'to'        : '{{getHeader()}}'
      },
      autoExpand              : 'none',
      taskOutOfRange          : 'truncate',
      fromDate                : '',
      toDate                  : '',
      rowContentEnabled       : true,
      rowContent              : '{{row.model.name}}',
      taskContentEnabled      : true,
      taskContent             : '<span class="gantt-task-name" style="display: block;" flex ng-click="scope.vm.editDialog($event,task.model)">\n    {{task.model.name}}\n    <md-tooltip md-direction="top" class="gantt-chart-task-tooltip">\n        <div layout="column" layout-align="center center">\n            <div class="tooltip-name">\n                {{task.model.name}}\n            </div>\n            <div class="tooltip-date">\n                <span>\n                    {{task.model.from.format(\'MM月DD日A\')}}\n                </span>\n                <span>-</span>\n                <span>\n                    {{task.model.to.format(\'MM月DD日A\')}}\n                </span>\n            </div>\n        </div>\n    </md-tooltip>\n</span>',
      allowSideResizing       : true,
      labelsEnabled           : true,
      currentDate             : 'line',
      currentDateValue        : new Date(),
      draw                    : true,
      readOnly                : false,
      groupDisplayMode        : 'group',
      filterTask              : '',
      filterRow               : '',
      timeFrames              : {
        'day'    : {
          start  : moment('8:00', 'HH:mm'),
          end    : moment('20:00', 'HH:mm'),
          working: true,
          default: true
        },
        'noon'   : {
          start  : moment('12:00', 'HH:mm'),
          end    : moment('13:30', 'HH:mm'),
          working: true,
          default: true
        },
        'weekend': {
          working: true
        },
        'holiday': {
          working: false,
          color  : 'red',
          classes: ['gantt-timeframe-holiday']
        }
      },
      dateFrames              : {
        'weekend'    : {
          evaluator: function (date)
          {
            return date.isoWeekday() === 6 || date.isoWeekday() === 7;
          },
          targets  : ['weekend']
        },
        '11-november': {
          evaluator: function (date)
          {
            return date.month() === 10 && date.date() === 11;
          },
          targets  : ['holiday']
        }
      },
      timeFramesWorkingMode   : 'hidden',
      timeFramesNonWorkingMode: 'visible',
      columnMagnet            : '15 minutes',
      timeFramesMagnet        : false,
      dependencies            : true,
      canDraw                 : function (event)
      {
        var isLeftMouseButton = event.button === 0 || event.button === 1;
        return vm.options.draw && !vm.options.readOnly && isLeftMouseButton;
      },
      drawTaskFactory         : function ()
      {
        return {
          id   : ganttUtils.randomUuid(),  // Unique id of the task.
          name : 'Drawn task', // Name shown on top of each task.
          color: '#AA8833' // Color of the task in HEX format (Optional).
        };
      },
      api                     : function (ganttApi)
      {
        vm.api = ganttApi;
        //console.log(ganttApi)

        vm.api.core.on.ready($scope, function ()
        {
          vm.load().then(function(){
            vm.gantt = true;
          });
          objectModel = new GanttObjectModel(vm.api);
        });
        ganttApi.tasks.on.change($scope,function(task){
          var diff1,diff2,from,to;
          from = task.model.from;
          to = task.model.to;
          var changeData = [
            {
              "TaskId": task.model.id,
              "ScheduledStartTime": task.model.from,
              "ScheduledEndTime": task.model.to
            }
          ]
          api.plan.BuildPlan.adjustPlan($stateParams.id,changeData).then(function(r){
            vm.data.forEach(function(group){
              var next = group.tasks.find(function(t){
                return t.dependencies.find(function(d){
                  return d.from == task.model.id;
                })!=null;
              });
              next  && (next.from = task.model.to);
              var prev = group.tasks.find(function(t){
                return task.model.dependencies.find(function(d){
                  return t.id == d.from;
                })!=null;

              });
              prev && (prev.to = task.model.from);
            })
          })
        })
      }
    };

    vm.canAutoWidth = canAutoWidth;
    vm.getColumnWidth = getColumnWidth;
    vm.load = load;
    vm.editDialog = editDialog;
    //////////

    init();

    /**
     * Initialize
     */
    function init()
    {
      $timeout(function () {
        // Set Gantt Chart height at the init
        calculateHeight();
      },600)


      angular.element($window).on('resize', function ()
      {
        $scope.$apply(function ()
        {
          calculateHeight();
        });
      });
    }

    /**
     * Max Height Fix
     */
    function calculateHeight()
    {
      vm.options.maxHeight = $document.find('#chart-container')[0].offsetHeight;


    }

    /**
     * Side Mode
     */
    $scope.$watch('vm.options.sideMode', function (newValue, oldValue)
    {
      if ( newValue !== oldValue )
      {
        vm.api.side.setWidth(undefined);

        $timeout(function ()
        {
          vm.api.columns.refresh();
        });
      }
    });

    function canAutoWidth(scale)
    {
      if ( scale.match(/.*?hour.*?/) || scale.match(/.*?minute.*?/) )
      {
        return false;
      }

      return true;
    }

    function getColumnWidth(widthEnabled, scale, zoom)
    {
      if ( !widthEnabled && vm.canAutoWidth(scale) )
      {
        return undefined;
      }

      if ( scale.match(/.*?week.*?/) )
      {
        return 150 * zoom;
      }

      if ( scale.match(/.*?month.*?/) )
      {
        return 300 * zoom;
      }

      if ( scale.match(/.*?quarter.*?/) )
      {
        return 500 * zoom;
      }

      if ( scale.match(/.*?year.*?/) )
      {
        return 800 * zoom;
      }

      return 40 * zoom;
    }

    // Reload data action
    function load()
    {
      return $q.all([api.plan.Task.query({
        Type:'BuildingPlan',
        Source:$stateParams.id
      }),api.plan.BuildPlan.getMileStone($stateParams.id)]).then(function (rs) {
        var r = rs[0];
        var tasks = r.data.Items.filter(function (item) {
          return !item.ExtendedParameters;
        }).map(function (item) {
          var result = {
            id:item.Id+'-group',
            name:item.Name,
            tasks:[
              {
                id:item.Id,
                name:item.Name,
                from:item.ScheduledStartTime,
                to:item.ScheduledEndTime,
                dependencies:item.Dependencies.map(function (d) {
                  return {
                    from:d.DependencyTaskID
                  }
                })
              }
            ]
          }
/*          if(item.ExtendedParameters)
          {
           return angular.extend(result,{parent:item.ExtendedParameters+'-group'})
          }*/
          return result;
        });
        var from = tasks[0].tasks[0].from;
        //console.log(JSON.stringify(tasks))
        vm.data=[{
          id:'__',
          name:'里程碑',
          classes:[
            "md-light-blue-100-bg"
          ],
          tasks:rs[1].data.map(function(m){
            var r =  {
              id: m.Id,
              name: m.Name,
              from:from,
              to: m.MilestoneTime,
              dependencies:[],
              classes:[
                "md-light-blue-200-bg"
              ]
            };
            from = m.MilestoneTime;
            return r;
          })
        }].concat(tasks);
        vm.backData = angular.copy(vm.data);
      })

      // Fix for Angular-gantt-chart issue
      $animate.enabled(true);
      $animate.enabled($document.find('#gantt'), false);


    }

    /**
     * Edit Dialog
     */
    function editDialog(ev, formView, formData)
    {
      $mdDialog.show({
        controller         : GanttChartAddEditDialogController,
        controllerAs       : 'vm',
        templateUrl        : 'app/main/plan/component/plan-gantt-flow.html',
        parent             : angular.element($document.body),
        targetEvent        : ev,
        clickOutsideToClose: true,
        locals             : {
          dialogData: {
            chartData : vm.data,
            formView  : formView,
            formData  : formData
          }
        }
      });
    }

    /** @ngInject */
    function GanttChartAddEditDialogController(dialogData,template,$timeout,$mdPanel) {
      console.log('dialogData',dialogData)
      var vm = this;

      vm.dialogData = dialogData;
      vm.data = {"Master":[{"TaskLibraryId":78,"TaskFlowId":303,"Name":"放线","IsFloor":false,"IsRequired":false,"Type":0,"ParentId":0,"EndFlagTaskFlowId":null},{"TaskLibraryId":78,"TaskFlowId":304,"Name":"验线","IsFloor":false,"IsRequired":false,"Type":0,"ParentId":303,"EndFlagTaskFlowId":null},{"TaskLibraryId":78,"TaskFlowId":305,"Name":"层间凿毛与清理","IsFloor":false,"IsRequired":false,"Type":0,"ParentId":304,"EndFlagTaskFlowId":null},{"TaskLibraryId":78,"TaskFlowId":306,"Name":"墙柱钢筋绑扎","IsFloor":false,"IsRequired":false,"Type":0,"ParentId":305,"EndFlagTaskFlowId":null},{"TaskLibraryId":78,"TaskFlowId":307,"Name":"墙柱验筋","IsFloor":false,"IsRequired":false,"Type":0,"ParentId":306,"EndFlagTaskFlowId":null},{"TaskLibraryId":78,"TaskFlowId":308,"Name":"墙柱封模","IsFloor":false,"IsRequired":false,"Type":0,"ParentId":307,"EndFlagTaskFlowId":null},{"TaskLibraryId":78,"TaskFlowId":309,"Name":"整体板模加固","IsFloor":false,"IsRequired":false,"Type":0,"ParentId":308,"EndFlagTaskFlowId":null},{"TaskLibraryId":78,"TaskFlowId":310,"Name":"梁板钢筋绑扎","IsFloor":false,"IsRequired":false,"Type":0,"ParentId":309,"EndFlagTaskFlowId":null},{"TaskLibraryId":78,"TaskFlowId":311,"Name":"整体报验","IsFloor":false,"IsRequired":false,"Type":0,"ParentId":310,"EndFlagTaskFlowId":null},{"TaskLibraryId":78,"TaskFlowId":312,"Name":"浇筑前整改","IsFloor":false,"IsRequired":false,"Type":0,"ParentId":311,"EndFlagTaskFlowId":null},{"TaskLibraryId":78,"TaskFlowId":313,"Name":"浇筑许可","IsFloor":false,"IsRequired":false,"Type":0,"ParentId":312,"EndFlagTaskFlowId":null},{"TaskLibraryId":78,"TaskFlowId":314,"Name":"浇筑","IsFloor":false,"IsRequired":false,"Type":0,"ParentId":313,"EndFlagTaskFlowId":null},{"TaskLibraryId":78,"TaskFlowId":315,"Name":"调整板面标高","IsFloor":false,"IsRequired":false,"Type":0,"ParentId":314,"EndFlagTaskFlowId":null},{"TaskLibraryId":78,"TaskFlowId":316,"Name":"收面","IsFloor":false,"IsRequired":false,"Type":0,"ParentId":315,"EndFlagTaskFlowId":null}],"Branch":[[{"TaskLibraryId":78,"TaskFlowId":317,"Name":"砼龄期","IsFloor":false,"IsRequired":false,"Type":1,"ParentId":316,"EndFlagTaskFlowId":null},{"TaskLibraryId":78,"TaskFlowId":318,"Name":"拆墙柱模","IsFloor":false,"IsRequired":false,"Type":1,"ParentId":317,"EndFlagTaskFlowId":null},{"TaskLibraryId":78,"TaskFlowId":319,"Name":"拆板模","IsFloor":false,"IsRequired":false,"Type":1,"ParentId":318,"EndFlagTaskFlowId":null},{"TaskLibraryId":78,"TaskFlowId":320,"Name":"工完场清","IsFloor":false,"IsRequired":false,"Type":1,"ParentId":319,"EndFlagTaskFlowId":null},{"TaskLibraryId":78,"TaskFlowId":321,"Name":"实测实量","IsFloor":false,"IsRequired":false,"Type":1,"ParentId":320,"EndFlagTaskFlowId":null},{"TaskLibraryId":78,"TaskFlowId":322,"Name":"观感检查","IsFloor":false,"IsRequired":false,"Type":1,"ParentId":321,"EndFlagTaskFlowId":null},{"TaskLibraryId":78,"TaskFlowId":323,"Name":"整改","IsFloor":false,"IsRequired":false,"Type":1,"ParentId":322,"EndFlagTaskFlowId":null}],[{"TaskLibraryId":78,"TaskFlowId":324,"Name":"放砌筑双控线","IsFloor":false,"IsRequired":false,"Type":2,"ParentId":320,"EndFlagTaskFlowId":null},{"TaskLibraryId":78,"TaskFlowId":325,"Name":"验线","IsFloor":false,"IsRequired":false,"Type":2,"ParentId":324,"EndFlagTaskFlowId":null},{"TaskLibraryId":78,"TaskFlowId":326,"Name":"打孔清孔","IsFloor":false,"IsRequired":false,"Type":2,"ParentId":325,"EndFlagTaskFlowId":null},{"TaskLibraryId":78,"TaskFlowId":327,"Name":"植筋","IsFloor":false,"IsRequired":false,"Type":2,"ParentId":326,"EndFlagTaskFlowId":null}]],"Variable":"Y","Duration":"5","ReservedStartDays":0,"ReservedEndDays":0,"Status":0,"CloseRelatedObjectType":null,"CloseRelatedObjectId":null,"ManuallyClose":true,"CreatorUserId":null,"CreationTime":"2016-10-12T14:43:07.103","TaskLibraryId":78,"Name":"2.8m~3.6m(预售前)","Type":"住宅>高层","Level":1};
      //vm.data = vm.dialogData.formView;
      vm.toggleRight = function () {
        return $mdSidenav('right')
          .open();
      }
      vm.closeRight = function () {
        return $mdSidenav('right')
          .close();
      }
      var task,temp;
      vm.onLoadTemplate = function () {

        if(!task) {
          task = vm.data;
        }
        if(task.Master.length===0) {
          vm.toggleRight();
        }
        if(temp)return;
        temp = new template({
          onClick:function (e) {
            vm.current = e.data;
            console.log(e);
            vm.toggleRight();
          }
        });
        temp.load(task);

      }
      $timeout(function () {
        vm.onLoadTemplate();
      },300)


    }


  }
})(angular,undefined);
