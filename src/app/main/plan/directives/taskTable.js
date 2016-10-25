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
      api.plan.BuildPlan.getBuildPlanFlowTree(484).then(function (r) {
        r.data.RootTask.Master.forEach(function (task) {
          task.selectedTask = task.OptionalTasks[0];
          scope.getVars(task.selectedTask);
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
                IsRequired:true,
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
