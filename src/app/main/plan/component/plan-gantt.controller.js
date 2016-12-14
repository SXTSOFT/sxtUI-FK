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
    vm.isStarted = true;
    /*loading界面*/
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
    //$scope.$on('$destroy',function(){
    //  $scope.hide();
    //})
    //$scope.$watch('vm.gantt',function(){
    //  $mdDialog.hide();
    //})
    // Data
    vm.live = {};
    /*gantt配置*/
    vm.options = {
      mode                    : 'custom',
      scale                   : 'year',
      sortMode                : undefined,
      sideMode                : 'TreeTable',
      daily                   : false,
      maxHeight               : 300,
      width                   : true,
      zoom                    : 1,
      rowSortable             : false,
      columns                 : ['model.name', 'from', 'to','realFrom','realTo','duration'],
      treeTableColumns        : ['from', 'to','realFrom','realTo','duration'],
      columnsHeaders          : {
        'model.name': 'Name',
        'from'      : '计划开始',
        'to'        : '计划结束',
        'realFrom':'实时开始',
        'realTo':'实时结束',
        'duration'  :'工期'
      },
      columnsClasses          : {
        'model.name': 'gantt-column-name',
        'from'      : 'gantt-column-from',
        'to'        : 'gantt-column-to',
        'realFrom'      : 'gantt-column-from',
        'realTo'        : 'gantt-column-to',
        'duration'  : 'gantt-column-duration'
      },
      columnsFormatters       : {
        'from': function (from)
        {
          return angular.isDefined(from) ? from.format('YY-MM-DD') : undefined;
        },
        'to'  : function (to)
        {
          return angular.isDefined(to) ? to.format('YY-MM-DD') : undefined;
        },
        'realFrom': function (realFrom)
        {
          return angular.isDefined(realFrom) ? realFrom.format('YY-MM-DD') : undefined;
        },
        'realTo'  : function (realTo)
        {
          return angular.isDefined(realTo) ? realTo.format('YY-MM-DD') : undefined;
        },
        'duration':function(duration){
          return duration;
        }
      },
      treeHeaderContent       : '{{getHeader()}}',
      treeHeader:'计划',
      columnsHeaderContents   : {
        'model.name': '{{getHeader()}}',
        'from'      : '{{getHeader()}}',
        'to'        : '{{getHeader()}}',
        'realFrom':'{{getHeader()}}',
        'realTo':'{{getHeader()}}',
        'duration'        : '{{getHeader()}}'
      },
      autoExpand              : 'none',
      taskOutOfRange          : 'truncate',
      fromDate                : '',
      toDate                  : '',
      rowContentEnabled       : true,
      rowContent              : '{{row.model.name}}',
      taskContentEnabled      : true,
      taskContent             : '<span class="gantt-task-name" style="display: block;" flex ng-click="scope.vm.editDialog($event,task,task.model)">\n    {{task.model.name}}\n    <md-tooltip md-direction="top" class="gantt-chart-task-tooltip">\n        <div layout="column" layout-align="center center">\n            <div class="tooltip-name">\n                {{task.model.name}}\n            </div>\n            <div class="tooltip-date">\n                <span>\n                    {{task.model.from.format(\'MM月DD日A\')}}\n                </span>\n                <span>-</span>\n                <span>\n                    {{task.model.to.format(\'MM月DD日A\')}}\n                </span>\n            </div>\n        </div>\n    </md-tooltip>\n</span>',
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

        vm.api.core.on.ready($scope, function ()
        {
          vm.load().then(function(){
            $timeout(function(){
              $mdDialog.hide();
              vm.api.tree.collapseAll()
            })
          });
          objectModel = new GanttObjectModel(vm.api);
          vm.api.side.setWidth(640);//450

          vm.api.directives.on.new($scope, function (directiveName, directiveScope, element)
          {
            /**
             * Gantt Task
             */
            if ( directiveName === 'ganttTask' )
            {
            }

            /**
             * Gantt Row
             */
            else if ( directiveName === 'ganttRow' )
            {

            }

            /**
             * Gantt Row Label
             */
            else if ( directiveName === 'ganttRowLabel' )
            {
              // Fix for double trigger due to gantt-sortable plugin
              element.off('click');

              element.on('click', function (event)
              {
                event.preventDefault();
                if(directiveScope.row.model.tasks){
                  editDialog(event, 'row', directiveScope.row.model.tasks[0]);
                }
              });

              element.on('mousedown touchstart', function ()
              {
                vm.live.row = directiveScope.row.model;
                $scope.$digest();
              });

            }
          });
        });
      }
    };

    vm.canAutoWidth = canAutoWidth;
    vm.getColumnWidth = getColumnWidth;
    vm.load = load;
    vm.reload = reload;
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
      //vm.options.maxHeight = $document.find('#chart-container')[0].offsetHeight;
      var h = $(window).height()-115;
      vm.options.maxHeight = h;

    }
    function reload()
    {
       api.plan.BuildPlan.getGantt({
        Type:'BuildingPlan',
        Source:$stateParams.id
      }).then(function (rs) {
        vm.originData = rs.data;
        var mergedata = mergeFloor(rs.data.Items);
        vm.data = rs.data.Items.filter(function (item) {
          return !item.ExtendedParameters;
        }).map(function (item) {
          if (item.Description)
            angular.extend(item, angular.fromJson(item.Description));
          var result = {
            id: item.Id + '-group',
            name: item.Name,
            classes: [
              item.IsInterlude ? "md-light-blue-100-bg" : ""
            ],
            //parent:'__',
            tasks: [
              {
                id: item.Id,
                name: item.Name,
                isStarted: !!item.ActualStartTime,
                isEnded: !!item.ActualEndTime,
                from: item.ScheduledStartTime,
                to: item.ScheduledEndTime,
                realFrom: item.ActualStartTime || item.RealScheduledStartTime && item.RealScheduledStartTime,
                realTo: item.ActualEndTime || item.RealScheduledEndTime && item.RealScheduledEndTime,
                movable: true,
                classes: [
                  item.IsInterlude ? "md-light-blue-100-bg" : ""
                ],
                isType: item.Type,
                dependencies: item.Dependencies.map(function (d) {
                  return {
                    from: d.DependencyTaskID
                  }
                })
              }
            ]
          }
          /*          if(item.ExtendedParameters)
           {
           return angular.extend(result,{parent:item.ExtendedParameters+'-group'})
           }*/

          //result = mergedata.concat(result)
          return result;
        });
        mergedata.forEach(function (r) {
          var f = vm.data.find(function (_r) {
            return _r.id == r.id + '-group'
          })
          if (f) {
            var idx = vm.data.indexOf(f);
            if (idx > -1) {
              vm.data.splice(idx, 0, r);
            }
          }
        })
         vm.options.maxHeight -=3;
      })
      //$animate.enabled(true);
      //$animate.enabled($document.find('#gantt'), false);
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
    //合并
    function mergeFloor(data){
      var array =[];
      data.forEach(function(r){
        if(!r.FloorType) return;
        var f = array.find(function(_r){
          return _r.FloorType == r.FloorType;
        })
        if(!f){
          var name = setName(r);
          array.push({
            name: name,
            Dependencies:r.Dependencies,
            id:r.Id,
            FloorType: r.FloorType,
            children:[r.Name]
          })
        }else{
          //var name = setName(r);
          f.children.push(r.Name)
        }
      })
      return array;
    }
    function setName(r){
      var str = '';
      switch (r.FloorType){
        case "1":
          str='预售前标准楼层';
          break;
        case "2":
          str='地下室';
              break;
        case "4":
          str='裙楼';
          break;
        case "8":
          str='转换层';
          break;
        case "9":
          str='预售后楼层';
          break;
      }
      return str;
    }
    // Reload data action
    function load()
    {
       return api.plan.BuildPlan.getGantt({
        Type:'BuildingPlan',
        Source:$stateParams.id
      }).then(function (rs) {
        vm.originData = rs.data;
        var mergedata = mergeFloor(rs.data.Items);
        vm.data = rs.data.Items.filter(function (item) {
          return !item.ExtendedParameters;
        }).map(function (item) {
          if(item.Description)
            angular.extend(item,angular.fromJson(item.Description));
          var result = {
            id:item.Id+'-group',
            name:item.Name,
            classes: [
              item.IsInterlude?"md-light-blue-100-bg":""
            ],
            //parent:'__',
            tasks:[
              {
                id:item.Id,
                name:item.Name,
                isStarted:!!item.ActualStartTime,
                isEnded:!!item.ActualEndTime,
                from:item.ScheduledStartTime,
                to:item.ScheduledEndTime,
                realFrom:item.ActualStartTime||item.RealScheduledStartTime&&item.RealScheduledStartTime,
                realTo:item.ActualEndTime||item.RealScheduledEndTime&&item.RealScheduledEndTime,
                movable:true,
                classes: [
                  item.IsInterlude?"md-light-blue-100-bg":""
                ],
                isType:item.Type,
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

          //result = mergedata.concat(result)
          return result;
        });
         mergedata.forEach(function(r){
           var f = vm.data.find(function(_r){
             return _r.id == r.id+'-group'
           })
           if(f){
             var idx = vm.data.indexOf(f);
             if(idx>-1){
               vm.data.splice(idx,0,r);
             }
           }
         })
         console.log(vm.data)
       // vm.isStarted = vm.data[0].tasks[0].isStarted;
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
      //if(formData.isType !=0) return;
      $mdDialog.show({
        controller         : GanttChartAddEditDialogController,
        controllerAs       : 'vm',
        templateUrl        : 'app/main/plan/component/plan-gantt-flow.html',
        parent             : angular.element($document.body),
        //targetEvent        : ev,
        clickOutsideToClose: true,
        locals             : {
          dialogData: {
            formData  : formData
          },
          originData:vm.originData
        }
      }).then(function(load){
        console.log('close',vm.needLoad,load)
        if(1){
         // vm.data = null;
          //vm.api.side.setWidth(639);
          vm.options.maxHeight +=3 ;
          vm.reload();
          //vm.needLoad = false;
            //vm.load().then(function(){
            //
            //})
        }
      },function(){
       // vm.data = null;
        //vm.api.side.setWidth(639);
        vm.reload();
       // console.log('a',vm.needLoad)
      });
    }
    vm.needLoad = false;
    /** @ngInject */
    function GanttChartAddEditDialogController(dialogData,originData,template,$timeout,$mdPanel,$scope) {
      var vm = this;
      function setSatus(i){
        var str='';
        switch (i){
          case 1:
                str = '未启动';
                break;
          case 2:
                str='完成';
                break;
          case 4:
                str='开启';
                break;
          case 8:
                str='暂停';
                break;
        }
        return str;
      };
      function setColor(i){
        var clr='';
        switch (i){
          case 1:
            clr = '#ccc';
            break;
          case 2:
            clr='#000';
            break;
          case 4:
            clr='green';
            break;
          case 8:
            clr='暂停';
            break;
        }
        return clr;
      }
      loadSubTask();
      function loadSubTask(){
        api.plan.BuildPlan.getGantt({
          ParentTaskId:dialogData.formData.id,
          Type:'BuildingPlan',
          Source:$stateParams.id
        }).then(function(r){
          var task = {
            Master:r.data.Items.filter(function (t) {
              try{
                var desc = eval('('+t.Description+')');
                return desc.Type == 0;
              }catch (ex){
                return false;
              }
            }).map(function (item) {
              return {
                EndFlagTaskFlowId:eval('('+item.Description+')').EndFlagTaskId,
                ScheduledStartTime:item.ScheduledStartTime,
                ScheduledEndTime:item.ScheduledEndTime,
                ActualStartTime:item.ActualStartTime,
                ActualEndTime:item.ActualEndTime,
                RealScheduledStartTime:item.RealScheduledStartTime,
                RealScheduledEndTime:item.RealScheduledEndTime,
                IsAbleStart: item.IsAbleStart,
                IsInterlude: item.IsInterlude,
                ManuallyClose: item.ManuallyClose,
                IsRelatedObject:item.IsRelatedObject,
                State:item.State,
                Color:setColor(item.State),
                _State:setSatus(item.State),
                switch:item.State!=4?false:true,
                Flags:item.Flags,
                TaskFlowId:item.Id,
                ParentId:item.Dependencies[0]&&item.Dependencies[0].DependencyTaskID||null,
                Name:item.Name,
                Type:0
              }
            }),
            Branch:function(items) {
              var branchs = [];
              items.forEach(function (t) {
                try {
                  var desc = eval('('+t.Description+')');
                  if(desc.Type!=0) {
                    var array = branchs[desc.Type - 1];
                    if(!array){
                      array = [];
                      branchs[desc.Type - 1] = array;
                    }
                    array.push({
                      EndFlagTaskFlowId:eval('('+t.Description+')').EndFlagTaskId,
                      ScheduledStartTime:t.ScheduledStartTime,
                      ScheduledEndTime:t.ScheduledEndTime,
                      ActualStartTime:t.ActualStartTime,
                      ActualEndTime:t.ActualEndTime,
                      RealScheduledStartTime:t.RealScheduledStartTime,
                      RealScheduledEndTime:t.RealScheduledEndTime,
                      IsAbleStart: t.IsAbleStart,
                      IsInterlude: t.IsInterlude,
                      ManuallyClose: t.ManuallyClose,
                      IsRelatedObject: t.IsRelatedObject,
                      State: t.State,
                      Color:setColor(t.State),
                      _State:setSatus(t.State),
                      switch:t.State!=4?false:true,
                      Flags:t.Flags,
                      TaskFlowId:t.Id,
                      ParentId:t.Dependencies[0]&&t.Dependencies[0].DependencyTaskID||null,
                      Name:t.Name,
                      Type:desc.Type
                    });
                  }
                } catch (ex) {
                  return false;
                }
              });
              return branchs;
            }(r.data.Items),
            Name:'流程'
          };
          vm.data = task;
          vm.onLoadTemplate();
        })
      }
      //var taskId = dialogData.formView.id;
      //vm.hasFlow = !!originData.Items.find(function (it) {
      //  return it.ExtendedParameters == taskId;
      //});
      /*开启穿插*/
      vm.startTask = function(task){
        var time = new Date();
        api.plan.BuildPlan.startInsert($stateParams.id,task.TaskFlowId,time).then(function(r){
          vm.needLoad = true;
          loadSubTask();
        },function(err){
          utils.alert(err.data||'错误');
        })
      }
      vm.openTask = function(task){
        var time = new Date();
        api.plan.Task.start(task.TaskFlowId,true,time).then(function (r) {
          //r.data.forEach(function(_r){
          //  var f=vm.flows.find(function(t){
          //    return t.TaskFlowId == _r.Id;
          //  })
          //  if(f){
          //    f.ActualStartTime = _r.ActualStartTime;
          //    f._State=setSatus(_r.State);
          //    f.State = _r.State;
          //  }
          //})
          loadSubTask();
        });
      }
      /*关闭任务*/
      vm.closeTask = function(task){
        console.log($scope)
        var parent = vm;
        var position = $mdPanel.newPanelPosition()
          .relativeTo('.sub-toolbar')
          .addPanelPosition($mdPanel.xPosition.CENTER, $mdPanel.yPosition.BELOW)

        $mdPanel.open({
          controller: function (mdPanelRef,$scope,utils) {
            var vm = this;
            vm.endTask = function(){
              var time = new Date(),
                params ={
                "TaskId": task.TaskFlowId,
                "ActualEndTime": new Date(),
                "EndDescription": vm.EndDescription,
                "Force": true
              };
              vm.closePanel1();
              api.plan.BuildPlan.endTask($stateParams.id,params).then(function (r) {
                //task.IsAbleStart = r.IsAbleStart;
                //task.IsInterlude = r.IsInterlude;
                //task.ManuallyClose = r.ManuallyClose;
                //parent.needLoad = true;
                //console.log(parent.$parent)
                if(r.data.length){
                  r.data.forEach(function(_r){
                    var f=parent.flows.find(function(t){
                      return t.TaskFlowId == _r.Id;
                    })
                    if(f){
                      f.ActualStartTime = _r.ActualStartTime;
                      f.ActualEndTime = _r.ActualEndTime;
                      f._State=setSatus(_r.State);
                      f.Color=setColor(_r.State);
                      f.State = _r.State;
                      f.IsAbleStart = _r.IsAbleStart;
                      f.IsInterlude = _r.IsInterlude;
                      f.ManuallyClose = _r.ManuallyClose;
                      f.IsRelatedObject = _r.IsRelatedObject;
                      f.RealScheduledStartTime = _r.RealScheduledStartTime;
                      f.RealScheduledEndTime = _r.RealScheduledEndTime;
                    }
                  })
                }else{
                  loadSubTask();
                }
              },function(err){
                utils.alert(err.data||'错误');
              });
            }
            vm.closePanel1 = function() {
              return mdPanelRef.close().then(function () {
                mdPanelRef.destroy();
                parent.closePanel1 = null;
              });
            }
          },
          controllerAs: 'vm',
          template: '<div class="mt-20" style="background:rgb(245,245,245);border-radius: 4px;padding:16px;box-shadow: 0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 13px 19px 2px rgba(0, 0, 0, 0.14), 0px 5px 24px 4px rgba(0, 0, 0, 0.12);"><md-input-container class="md-block">\
          <label>关闭原因</label>\
          <input type="text" ng-model="vm.EndDescription">\
          </md-input-container>\
          <div layout="row" layout-align="end center">\
          <md-button class="md-raised" ng-click="vm.endTask()">确定</md-button></div></div>',
          hasBackdrop: true,
          position: position,
          trapFocus: true,
          zIndex: 5000,
          clickOutsideToClose: true,
          escapeToClose: true,
          focusOnOpen: true,
          attachTo:angular.element('body')
        });
      }
      //vm.endTask = function(){
      //  var time = new Date();
      //  api.plan.Task.end(vm.currentTask.TaskFlowId,true,time,vm.EndDescription).then(function (r) {
      //    loadSubTask();
      //  });
      //}
      function stopTask(task,changeds) {
        changeds.push({task:task,stop:true});
        //找到依赖他执行的任务
        var deps = originData.Items.filter(function (it) {
          return it.Dependencies.find(function (d) {
            return d.DependencyTaskID==task.Id;
          });
        });
        if(deps.length==0){
          //如果非主线
          if(task.Description){
            try{
              var t = eval('('+task.Description+')');
              if(t && t.Type===0) { //如果是主线
                if(task.ExtendedParameters) {
                  var parent = originData.Items.find(function (it) {
                    return it.Id == task.ExtendedParameters;
                  });
                  if (parent) {
                    return stopTask(parent, changeds);
                  }
                  else{
                    return -2;//有异常
                  }
                }
                else{
                  return 1;//返回主线结束
                }
              }
              else{
                return -1;//有异常
              }
            }
            catch(ex) {
              return -3;//有异常
            }
          }
          else {
            return 1;//全结束
          }
        }
        else{
          deps.forEach(function (d) {
            //要开始的任务
            changeds.push({task:d,stop:false});
          });
          return 0;//正常下走
        }
      }

      function toStopTask(task) {
        var changes =[],querys=[];
        var r = stopTask(task,changes);
        changes.forEach(function (c) {
          if(c.stop)
            querys.push(api.plan.Task.end(c.task.Id,true));
          else
            querys.push(api.plan.Task.start(c.task.Id,true));
        });
        $q.all(querys).then(function (rs) {
          changes.forEach(function (c) {
            if(c.stop) {
              c.task.ActualEndTime = new Date();
              vm.data.forEach(function (t) {
                var f = t.tasks.find(function (t1) {
                  return t1.id==c.task.Id;
                });
                if(f){
                  f.to = new Date();
                }
              })
            }
            else{
              c.task.ActualStartTime = new Date();
              vm.data.forEach(function (t) {
                var f = t.tasks.find(function (t1) {
                  return t1.id==c.task.Id;
                });
                if(f){
                  f.from = new Date();
                }
              })
            }
          })
          if(r===0){
            utils.alert('操作成功');
          }
          else if(r>0){
            utils.alert('计划全部完成');
          }
          else{
            utils.alert('部分计划不能正常继续');
          }
        });
      }
      vm.toStopTask = function () {
        var tid = vm.current?vm.current.Eid:taskId;
        var task = originData.Items.find(function (it) {
          return it.Id == tid;
        });
        utils.confirm('确定关闭'+task.Name+'"吗?').then(function () {
          toStopTask(task);
        });
      };
      //toStopTask();
      vm.dialogData = dialogData;
      vm.close =function(){
        $mdDialog.hide(vm.needLoad);
      }
      vm.toggleRight = function () {
        return $mdSidenav('right')
          .open();
      }
      vm.closeRight = function () {
        return $mdSidenav('right')
          .close();
      }

      vm.onLoadTemplate = function () {
        var temp;
        //if(temp)return;
        temp = new template({
          onNodeDotColor:function (t) {
            return t.Color;
          },
          onNodeColor:function (t) {
            return 'silver'
          },
          onClick:function (e) {
            vm.current = e.data;
            console.log(e);
            vm.openDialog(e.data,e.data.TaskFlowId);
           // vm.toggleRight();
          }
        });
        vm.flows = temp.load(vm.data);
      }

      vm.openDialog = function(data,Id){
        api.plan.BuildPlan.getGantt({
          ParentTaskId:Id,
          Type:'BuildingPlan',
          Source:$stateParams.id
        }).then(function(r){
          if(!r.data.Items.length) return;
          var newdata = angular.extend({
            id:Id
          },data)
          editDialog('','',newdata);
        })

      }

    }


  }
})(angular,undefined);
