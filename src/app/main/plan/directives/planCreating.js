/**
 * Created by emma on 2016/11/2.
 */
/**
 * Created by jiuyuong on 2016/10/25.
 */
(function (angular) {
  angular
    .module('app.plan')
    .directive('planCreating',planCreating);
  /** @ngInject */
  function planCreating(template,api,$state,$window,$mdDialog,$q,utils,sxt) {
    return {
      scope:{
        buildId:'=',
        begin:'=',
        libraryId:'=',
        flow:'=',
        branch:'=',
        ct:'&'
      },
      templateUrl:'app/main/plan/directives/plan-creating.html',
      link:link
    }

    function link(scope,element,attr,ctrl) {
      var  moment = $window.moment;
      var buildId = scope.buildId || '000420000000006',
        rootTaskLibraryId = scope.libraryId || 303,
        begin = scope.begin ? moment(scope.begin) : moment('2016-10-1'),
        lastFloorTask;
      var gs = (function () {
        var vars = [], r = /[a-z]/gi,
          compare = function (s1, s2) {
            return s1.key.localeCompare(s2.key);
          };
        return {
          setValue: function (k, value) {
            var v = vars.find(function (v) {
              return v.key == k;
            });
            if (v)
              v.value = value;
          },
          getVars: function (g) {
            if (!g) return [];
            var vs = g.toUpperCase().match(r),
              rs = [];
            if (!vs || vs.length === 0) return rs;
            vs.forEach(function (v) {
              var r = vars.find(function (n) {
                return n.key == v;
              });
              if (!r) {
                r = {
                  key: v
                };
                vars.push(r);

              }
              rs.push(r);
            });
            vars.sort(compare);
            rs.sort(compare);
            return rs;
          },
          setVars: function (g) {
            var vs = g.toUpperCase().match(r), f = true;
            if (!vs || vs.length === 0) {
              try {
                return eval(g);
              } catch (e) {
                return g;
              }
            }
            vs.forEach(function (v) {
              var r = vars.find(function (n) {
                return n.key == v;
              });
              if (r && (r.value || r.value === 0)) {
                g = g.replace(new RegExp(v, 'gi'), r.value);
              }
              else {
                f = false;
              }
            });

            if (f) {
              try {
                return eval(g);
              } catch (e) {
                return g;
              }
            }
            else
              return g;
          }
        }
      })();

      $q.all([
        api.plan.TaskLibrary.getTaskFlow(rootTaskLibraryId),
        api.plan.Project.query(buildId),
        api.plan.MileStone.queryByTaskId(rootTaskLibraryId)
      ]).then(function (rs) {
        var rootTask = rs[0].data,
          floors = rs[1].data,
          mileStone = rs[2].data;
        var flows = [], banchs = [];
        rootTask.Master.forEach(function (t) {
          if (t.IsFloor) {
            floors.forEach(function (f) {
              var t1 = angular.copy(t), tid = t1.TaskFlowId;
              t1.IsFloor = true;
              t1.IsRequired = t.IsRequired;
              t1.TaskFlowId = f.FloorId + '-' + tid;
              t1.FloorId = f.FloorId;
              t1._TaskFlowId = tid;
              t1.Name = f.FloorName;
              flows.push(t1);
              if (f.IsPresalesMilestone) {
                flows.push({
                  selected: true,
                  FloorId: f.FloorId,
                  TaskFlowId: f.FloorId + '-' + tid + '-0',
                  Id: 0,
                  RelatedFlowId: tid,
                  type: 'm',
                  Name: '开盘'
                });
              }
            })
          }
          else {
            flows.push(t);
          }
          var m = mileStone.Items.find(function (m1) {
            return m1.RelatedFlowId == t.TaskFlowId;
          });
          if (m) {
            flows.push({
              selected: true,
              TaskFlowId: m.Id + '-' + m.RelatedFlowId,
              Id: m.Id,
              RelatedFlowId: m.RelatedFlowId,
              type: 'm',
              Name: m.Name
            });
          }
        });
        flows.forEach(function (f) {
          if (f.OptionalTasks) {
            if (f.IsFloor) {
              if (f.Name.indexOf('负') != -1) {
                f.currentTask = f.OptionalTasks.find(function (t) {
                  return t.Name.indexOf('负') != -1 || t.Name.indexOf('地') != -1
                });
              }
              else if (f.Name.indexOf('裙') != -1) {
                f.currentTask = f.OptionalTasks.find(function (t) {
                  return t.Name.indexOf('裙') != -1;
                });
              }
              else if (f.Name.indexOf('转') != -1) {
                f.currentTask = f.OptionalTasks.find(function (t) {
                  return t.Name.indexOf('转') != -1;
                });
              }
              else {
                f.currentTask = f.OptionalTasks.filter(function (t) {
                  return t.Name.indexOf('负') == -1 &&
                    t.Name.indexOf('裙') == -1 &&
                    t.Name.indexOf('转') == -1;
                })[0];
              }
            }
            if (!f.currentTask) {
              f.currentTask = f.OptionalTasks[0];
            }
            f.selected = true;
          }
        });
        rootTask.Branch.forEach(function (bs) {
          bs.forEach(function (b) {
            banchs.push(b);
          });
        });
        gs.getVars('N');
        gs.setValue('N', floors.filter(function (f) {
          // 1	标准层
          // 2	地下室
          // 4	裙楼
          // 8	转换层
          return f.FloorTypeStatus != '2'
            ;
        }).length);
        scope.flow = scope.flows = flows;
        scope.branch = scope.banchs = banchs;
        scope.buildDate();
      });
      function setTask(item){
        var index =  scope.flows.indexOf(item);
        var floorArr = scope.flows.filter(function(r){
          return r.IsFloor;
        })
        var r=floorArr.indexOf(item);
        if(r>0){
          for(var i=index;i<floorArr.length+index-r+1;i++){
            var f = scope.flows[i].OptionalTasks&&scope.flows[i].OptionalTasks.find(function (task) {
              return task.TaskLibraryId===item.currentTask.TaskLibraryId;
            });
            if(f){
              scope.flows[i].currentTask = f;
            }
          }
        }

      }
      scope.setCurrent = function (flow, task) {
        flow.currentTask = task;
        setTask(flow);
        scope.buildDate();
      }
      scope.buildBranch = function (task) {
        var t = lastFloorTask.Master.find(function (t) {
          return t.Name.indexOf('砼收面') != -1;
        });
        if (!t) {
          utils.alert(lastFloorTask.Name + '中未找到砼收面流程');
        }
        else {
          var days = 0, idx = lastFloorTask.Master.indexOf(t), nt;
          for (var i = 0; i < idx; i++) {
            nt = parseFloat(lastFloorTask.Master[i].OptionalTasks[0].Duration);
            if (!isNaN(nt))
              days = utils.math.sum(days, nt);
          }
          scope.banchs.forEach(function (b) {
            /*          var flow = vm.flows.find(function (f) {
             return b.EndFlagTaskFlowId == f.TaskFlowId;
             });**/
            var days2 = gs.setVars(b.Expression);
            if (days2 === b.Expression) {
              days2 = undefined;
            }
            if (days2) {
              b.start = moment(task.start).add(utils.math.sum(days, days2), 'days');
            }
            var tk = b.currentTask = b.currentTask || b.OptionalTasks[0];
            if (tk) {
              var days3 = gs.setVars(tk.Duration);
              if (days3 !== tk.Duration) {
                b.days = days3;
                b.end = moment(b.start).add(days3, 'days');
              }
            }
            else {
              b.days = undefined;
            }
          })
        }
      }
      scope.buildDate = function () {
        if (!scope.flows) return;
        scope.flows.reduce(function (prev, current, index, array) {
          if (!current.selected) return prev;
          if (current.type) {
            current.end = prev.end;
            return prev;
          }
          if (prev && prev.IsFloor && prev.end && !current.IsFloor) {
            //request = true;
            if (!lastFloorTask || lastFloorTask.TaskLibraryId != prev.currentTask.TaskLibraryId) {
              api.plan.TaskLibrary.getTaskFlow(prev.currentTask.TaskLibraryId).then(function (r) {
                lastFloorTask = r.data;
                scope.buildBranch(prev);
              });
            }
            else {
              scope.buildBranch(prev);
            }
          }
          if (prev && !prev.end) {
            current.days = current.start = current.end = undefined;
            return current;
          }
          var start = prev ? moment(prev.end) : moment(begin),
            end;
          if (!start) {
            current.days = current.start = current.end = undefined;
          }
          else {
            try {
              var days = gs.setVars(current.currentTask.Duration);
              if (days === current.currentTask.Duration)
                days = undefined;
              current.days = days;
            } catch (ex) {
            }
            if (current.days) {
              end = moment(start).add(current.days, 'days');
            }
            else {
              end = undefined;
            }
            current.start = start;
            current.end = end;
          }
          return current;
        }, null);
        return '';
      }

      scope.down = function (flow) {
        var index = scope.flows.indexOf(flow);
        if (index > 0) {
          var next = scope.flows[index + 1];
          if (next) {
            scope.flows[index] = next;
            scope.flows[index + 1] = flow;
          }
        }
        scope.buildDate();
      }
      scope.up = function (flow) {
        var index = scope.flows.indexOf(flow);
        var next = scope.flows[index - 1];
        if (next) {
          scope.flows[index] = next;
          scope.flows[index - 1] = flow;
        }
        scope.buildDate();
      }
      scope.setVars = function (flow) {
        var dur = flow.Expression ? flow.Expression : flow.currentTask.Duration;
        var vars = gs.getVars(dur);
        if (vars.length == 0) return;
        return $mdDialog.show({
          controller: ['$mdDialog', '$scope', function ($mdDialog) {
            var vm = this;
            vm.vars = vars;
            vm.dur = dur;
            vm.select = function () {
              $mdDialog.hide(vm.dur);
            }
          }],
          controllerAs: 'vm',
          templateUrl: 'app/main/plan/component/plan-create-vars.html',
          parent: angular.element(document.body),
          clickOutsideToClose: true
        }).then(function (dur) {
          if (flow.currentTask)
            flow.currentTask.Duration = dur;
          else
            flow.Expression = dur;
          scope.buildDate();
        });
      }

      //scope.submit = function () {
      //  var tasks = [], milestones = [];
      //  scope.flows.reduce(function (prev, current) {
      //    if (!current.selected) return prev;
      //    if (current.type) {
      //      milestones.push({
      //        Name: current.Name,
      //        RelatedFlowId: current.RelatedFlowId,
      //        MilestoneTime: current.end.format('YYYY-MM-DD')
      //      });
      //      return prev;
      //    }
      //    if (!current._id)
      //      current._id = sxt.uuid();
      //
      //    tasks.push({
      //      "Id": current._id,
      //      "DependentTaskFlowId": prev && prev._id,
      //      "TaskFlowId": current._TaskFlowId || current.TaskFlowId,
      //      "FloorId": current.FloorId,
      //      "FloorName": current.Name,
      //      "Type": current.Type,
      //      "OptionalTask": {
      //        "TaskLibraryId": current.currentTask.TaskLibraryId,
      //        "PlanBeginTime": current.start.format('YYYY-MM-DD'),
      //        "PlanEndTime": current.end.format('YYYY-MM-DD'),
      //        "Days": current.days
      //      }
      //    })
      //    return current;
      //  }, null);
      //  scope.banchs.forEach(function (current) {
      //    tasks.push({
      //      "Id": sxt.uuid(),
      //      "DependentTaskFlowId": null,
      //      "TaskFlowId": current.TaskFlowId,
      //      "FloorId": current.FloorId,
      //      "FloorName": current.Name,
      //      "Type": current.Type,
      //      "OptionalTask": {
      //        "TaskLibraryId": current.currentTask.TaskLibraryId,
      //        "PlanBeginTime": current.start.format('YYYY-MM-DD'),
      //        "PlanEndTime": current.end.format('YYYY-MM-DD'),
      //        "Days": current.days
      //      }
      //    })
      //  });
      //  var b = {
      //    "BuildingPlanInput": {
      //      "BuildingId": "000420000000006",
      //      "Name": "测试计划",
      //      "TaskTemplateId": 40,
      //      "StartTime": "2016-10-01T00:00:00.412Z",
      //      "PreSalesTime": "2016-11-01T14:37:07.412Z",
      //      "ExpectEndTime": "2016-11-01T14:37:07.412Z"
      //    },
      //    "TaskFlows": tasks,
      //    "Milestones": milestones
      //  };
      //  var fg = true;
      //  tasks.forEach(function (t) {
      //    if(!t.OptionalTask.PlanEndTime){
      //      fg = false;
      //    }
      //  });
      //  if(!fg) return fg;
      //  return api.plan.BuildPlan.post(b);
      //}
      //if (scope.ct)
      //  scope.ct.submit = function () {
      //    return scope.submit();
      //  }
    }
  }
})(angular);
