/**
 * Created by jiuyuong on 2016/10/25.
 */
(function (angular) {
  angular
    .module('app.plan')
    .directive('taskTable',taskTable);
  /** @ngInject */
  function taskTable(api,utils) {
    return {
      scope:{
        tasks:'=',
        flowId:'=',
        allTasks:'='
      },
      templateUrl:'app/main/plan/directives/taskTable.html',
      link:link
    }

    function link(scope,element,attr,ctrl) {
      scope.data = {

      }
      scope.info={
        tasks:scope.tasks,
        flowId:scope.flowId
      }
      var gs = (function () {
        var vars = [],r = /[a-z]/gi,
          compare = function (s1,s2) {
            return s1.key.localeCompare(s2.key);
          };
        return {
          getVars:function (g) {
            var vs = g.toUpperCase().match(r),
              rs = [];
            if(!vs || vs.length===0) return rs;
            vs.forEach(function (v) {
              var r = vars.find(function (n) {
                return n.key == v;
              });
              if(!r){
                r = {
                  key:v
                };
                vars.push(r);

              }
              rs.push(r);
            });
            vars.sort(compare);
            rs.sort(compare);
            return rs;
          },
          setVars:function (g) {
            var vs = g.toUpperCase().match(r),f = true;
            if(!vs ||vs.length===0){
              try {
                return eval(g);
              }catch (e){
                return g;
              }
            }
            vs.forEach(function (v) {
              var r = vars.find(function (n) {
                return n.key == v;
              });
              if(r && (r.value || r.value===0)){
                g = g.replace(new RegExp(v,'gi'),r.value);
              }
              else{
                f = false;
              }
            });

            if(f) {
              try {
                return eval(g);
              }catch (e){
                return g;
              }
            }
            else
              return g;
          }
        }
      })();
      var swapItems = function(arr, index1, index2) {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        return arr;
      };
      scope.upDot = function(item){
        scope.data.template.forEach(function(r){
          r.selected = false;
        })
        item.selected = true;
        var idx = scope.data.template.indexOf(item);
        if(idx!=0){
          swapItems( scope.data.template, idx, idx - 1);
        }
        var data={
          BeforeBuildingPlanFlowId: scope.data.template[idx-1].Id,
          AfterBuildingPlanFlowId: scope.data.template[idx].Id
        }
        api.plan.BuildPlan.swapOrder(scope.flowId,data).then(function(r){
          if(r.data || r.status==200){
            utils.alert('交换完成!')
          }
        })
      }
      scope.downDot = function(item){
        scope.data.template.forEach(function(r){
          r.selected = false;
        })
        item.selected = true;
        var idx = scope.data.template.indexOf(item);
        if(idx != scope.data.template.length-1){
          swapItems(scope.data.template, idx, idx + 1)
        }
        var data={
          BeforeBuildingPlanFlowId: scope.data.template[idx].Id,
          AfterBuildingPlanFlowId: scope.data.template[idx+1].Id
        }
        api.plan.BuildPlan.swapOrder(scope.flowId,data).then(function(r){
          if(r.data || r.status==200){
            utils.alert('交换完成!')
          }
        })
      }
      scope.changeFloor = function(item){
       // console.log(item,scope.data.template)
        var arr=[],index,arr1=[];
        var f=scope.data.template.find(function(r){
          return r.IsFloor == true;
        })
        if(f){
          arr.push(f);
          index = scope.data.template.indexOf(f);
          scope.data.template.splice(index,1);
        }
        arr.forEach(function(_r){
          var find = _r.Floors.find(function(t){
            return t.Id == item.Id
          })
          if(find){
            var idx = _r.Floors.indexOf(find);
            arr1.push(_r.Floors.slice(0,idx));
            arr1.push(_r.Floors.slice(idx,_r.Floors.length));
          }
        })
        arr1.forEach(function(r){
          var obj={
            Floors:r,
            getFullName:function () {
              var f = this.Floors[0],
                l = this.Floors[this.Floors.length-1];
              return f===l?f.FullName.replace(f.TaskFlowName,''):f.FullName.replace(f.TaskFlowName,'')+'~'+l.FullName.replace(f.TaskFlowName,'');
            },
            IsFloor : true,
            IsRequired:true,
            selectedTask :this.Floors[0].OptionalTasks[0],
            getOptionalTasks:function () {
              return this.Floors[0].OptionalTasks;
            }
          };
          scope.data.template.splice(index,0,obj);
          index +=1;
        })
      }
      scope.getVars = function (task) {
        if(!task) return;
        if(task.eDuration !='' && !task.eDuration)
          task.eDuration = task.Duration||'';

        task.vars = scope.vars = gs.getVars(task.eDuration);
        var r = gs.setVars(task.eDuration);
        if(!task.vars.length){
          task.minValue = task.Duration*0.8;
        }
        task.xDuration = r;
        return r;
      };
      function setTask(item) {
        var next = scope.data.template.find(function (it) {
          return it.ParentId===item.Id && it.OptionalTasks.find(function (task) {
              return task.TaskLibraryId===item.selectedTask.TaskLibraryId;
            })!=null;
        });
        if(next){
          next.selectedTask = next.OptionalTasks.find(function (task) {
            return task.TaskLibraryId===item.selectedTask.TaskLibraryId;
          });
          next.selectedTask.eDuration = item.selectedTask.eDuration;
          next.selectedTask.xDuration = item.selectedTask.xDuration;
          scope.resetName(next);
          setTask(next);
        }
      }
      function setDuration(item){
        var next = scope.data.template.find(function (it) {
          return it.ParentId===item.Id && it.OptionalTasks.find(function (task) {
              return task.TaskLibraryId===item.selectedTask.TaskLibraryId;
            })!=null;
        });
        if(next) {
          next.selectedTask = next.OptionalTasks.find(function (task) {
            return task.TaskLibraryId === item.selectedTask.TaskLibraryId;
          });
          if (next.selectedTask) {
            next.selectedTask.eDuration = item.selectedTask.eDuration;//Math.round(item.selectedTask.duration*10)*0.1;
            next.selectedTask.xDuration = item.selectedTask.xDuration;
          }
          setDuration(next)
        }
      }
      scope.reloadTask = function (item,op) {
        item.selectedTask = op;
         // scope.resetName(op);
          setTask(item);
        setDuration(item);
      }
      function setMin(item){
        var result;
        if(!item.selectedTask.vars.length&&item.selectedTask.Duration){
          item.min = item.selectedTask.Duration*0.8;
          if(item.selectedTask.eDuration < item.min){
            utils.alert('输入值应大于基本工期的80%').then(function(){
              item.show = true;
              //item.selectedTask.eDuration = item.selectedTask.Duration;
              result =  false;
            })
          }else{
            item.show = false;
            result = true;
          }
        }
        return result;
      }
      scope.batchDuration = function(task){
        var f = setMin(task);
        if(f){
          setDuration(task);
        }
      }
      scope.deleteDot = function(item){
          utils.confirm('确认删除',null,'确定','取消').then(function(){
            api.plan.BuildPlan.deleteTaskLibById(scope.flowId,item.Id).then(function(r){
              //console.log(r)
              if(r.status == 200){
                utils.alert('删除成功').then(function(){
                  getData(scope.flowId);
                })
              }
            },function(err){
              console.log(err)
              utils.alert(err.data+',创建计划失败！')
            })
          })
      }
      scope.resetName = function (item) {
        item.Name = (item.FullName || item.TaskFlowName)+' - ' +
          (item.selectedTask?item.selectedTask.Name:'')
          + ' - 可选('+item.OptionalTasks.length+')';

      }
      //scope.data.template = scope.tasks;
      scope.$watch('tasks',function(){
        //console.log(scope.tasks)
        if(scope.tasks&&scope.flowId){
          getData(scope.flowId).then(function(){
            scope.$parent.$parent.vm.closePanel();
          })
        }
      })
      scope.$watch('flowId',function(){
        if(scope.tasks&&scope.flowId){
          getData(scope.flowId).then(function(){
            scope.$parent.$parent.vm.closePanel();
          })
        }
      })
      //scope.$watch('info',function(){
      //  //console.log(scope.flowId)
      //  if(scope.info.flowId&&scope.info.tasks){
      //    getData(scope.info.flowId)
      //  }
      //},true)
      function getData(id) {
        return api.plan.BuildPlan.getBuildPlanFlowTree(id).then(function (r) {
          r.data.RootTask.Master.forEach(function (task) {
            task.selectedTask = task.OptionalTasks.length == 0 ? null : task.OptionalTasks[0];
            scope.getVars(task.selectedTask);
            scope.resetName(task);
            return task;
          })
          scope.data.originData = r.data;
          scope.allTasks = scope.data.template = r.data.RootTask.Master;
          //scope.data.template =  r.data.RootTask.Master.reduce(function (container,current,index,array) {
          //  if(!current.IsFloor){
          //    container.push(current);
          //  }
          //  else{
          //    var last = container[container.length-1];
          //    if(last.IsFloor){
          //      last.Floors.push(current);
          //    }
          //    else{
          //      container.push({
          //        getFullName:function () {
          //          var f = this.Floors[0],
          //            l = this.Floors[this.Floors.length-1];
          //          return f===l?f.FullName.replace(f.TaskFlowName,''):f.FullName.replace(f.TaskFlowName,'')+'~'+l.FullName.replace(f.TaskFlowName,'');
          //        },
          //        IsFloor : true,
          //        Floors:[current],
          //        IsRequired:true,
          //        getOptionalTasks:function () {
          //          return this.Floors[0].OptionalTasks;
          //        }
          //      })
          //    }
          //  }
          //  return container;
          //},[]);

          console.log('scope.data.template', scope.data.template);
        });
      }
    }
  }
})(angular);
