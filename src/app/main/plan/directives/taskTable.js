/**
 * Created by jiuyuong on 2016/10/25.
 */
(function (angular) {
  angular
    .module('app.plan')
    .directive('taskTable',taskTable);
  /** @ngInject */
  function taskTable(api) {
    return {
      scope:{
        tasks:'='
      },
      templateUrl:'app/main/plan/directives/taskTable.html',
      link:link
    }

    function link(scope,element,attr,ctrl) {
      scope.data = {

      }
      api.plan.BuildPlan.getBuildPlanFlowTree(484).then(function (r) {
        r.data.RootTask.Master.forEach(function (task) {
          task.selectedTask = task.OptionalTasks[0];
        })
        scope.data.originData = r.data;
        scope.data.template =  r.data.RootTask.Master.reduce(function (container,current,index,array) {
          if(!current.IsFloor){
            container.push(current);
          }
          else{
            var last = container[container.length-1];
            if(last.IsFloor){
              last.Floors.push(current);
            }
            else{
              container.push({
                getFullName:function () {
                  var f = this.Floors[0],
                    l = this.Floors[this.Floors.length-1];
                  return f===l?f.FullName.replace(f.TaskFlowName,''):f.FullName.replace(f.TaskFlowName,'')+'~'+l.FullName.replace(f.TaskFlowName,'');
                },
                IsFloor : true,
                Floors:[current],
                getOptionalTasks:function () {
                  return this.Floors[0].OptionalTasks;
                }
              })
            }
          }
          return container;
        },[]);

        console.log('scope.data.template',scope.data.template);
      });
    }
  }
})(angular);
