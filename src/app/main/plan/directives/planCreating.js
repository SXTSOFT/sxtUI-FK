/**
 * Created by jiuyuong on 2016/10/25.
 */
(function (angular,undefined) {
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
        branch:'='
      },
      templateUrl:'app/main/plan/directives/plan-creating.html',
      link:link
    }

    function link(scope,element,attr,ctrl) {
      var  moment = $window.moment;
      //var buildId = scope.buildId || '000420000000006',
      //  rootTaskLibraryId = scope.libraryId || 303,
      //  begin = scope.begin ? moment(scope.begin) : moment('2016-10-1');
      scope.$watch('libraryId',function(){
        if(!!scope.libraryId&&!!scope.buildId) {
          begin = scope.begin;
          load();
        }
      })
      scope.$watch('buildId',function(){
        if(!!scope.libraryId&&!!scope.buildId) {
          begin = scope.begin;
          load();
        }
      })
      scope.$watch('begin',function () {
        begin = scope.begin ? moment(scope.begin):null;
        //scope.buildDate();
        if(!!scope.libraryId&&!!scope.buildId){
          begin = scope.begin;
          //load();
          scope.buildDate();
        }
      });
      var gs = (function () {
        var vars = [], r = /[a-z]{1,3}/gi,
          compare = function (s1, s2) {
            return s1.key.localeCompare(s2.key);
          },
          getDate = function (key, g) {
            var r = vars.find(function (n) {
              return n.key == key;
            });
            if (r && r.value) {
              var date = new moment(r.value);
              g = g.replace(key, '');
              try {
                var days = $window.eval(g);
                return date.add(days, 'days');
              } catch (ex) {
                return false;
              }
            }
            return false;
          };
        return {
          setValue: function (k, value) {
            var v = vars.find(function (v) {
              return v.key == k;
            });
            if (v)
              v.value = value;
            else {
              vars.push({
                key: k,
                value: value
              });
            }
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
              if (v.length === 1 && !rs.find(function (n) {
                  return n.key == v;
                })) {
                rs.push(r);
              }
            });
            vars.sort(compare);
            rs.sort(compare);
            return rs;
          },
          setVars: function (g) {
            var vs = g.toUpperCase().match(r), f = true, isDate = false, g1 = g;
            //只有数字的计算
            if (!vs || vs.length === 0) {
              try {
                return eval(g1);
              } catch (e) {
                return g1;
              }
            }
            vs.forEach(function (v) {
              var r = vars.find(function (n) {
                return n.key == v;
              });
              if (!isDate && v.length > 1) {
                isDate = true;
              }
              if (v.length === 1 && r && (r.value || r.value === 0)) {
                g1 = g1.replace(new RegExp(v, 'gi'), r.value);
              }
              else {
                f = false;
              }
            });
            if (isDate) { //计算日期
              var b = g1.split('~');
              if (b.length === 2) {
                var s = b[0].match(r),
                  e = b[1].match(r);
                var sd = getDate(s[0], b[0]),
                  ed = getDate(e[0], b[1]);
                if (sd && ed) {
                  return {
                    s: sd,
                    days: moment.duration(ed.diff(sd)).asDays(),
                    e: ed
                  };
                }
              }
              return g;
            }
            else {
              //仅计算天数,没有日期
              if (f) {
                try {
                  return eval(g1);
                } catch (e) {
                  return g1;
                }
              }
              else
                return g;
            }
          }
        }
      })();
      function load() {
        $q.all([
          api.plan.TaskLibrary.getTaskFlow(scope.libraryId),
          api.plan.Project.query(scope.buildId),
          api.plan.MileStone.queryByTaskId(scope.libraryId)
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
                t1.FloorName = f.FloorName;
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
                    Name: '达到预售楼层'
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
                if(f.Name.indexOf('负') != -1){
                  //scope.underhidden=false;
                }else{
                  scope.underhidden=true;
                }
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
                //f.currentTask.eDuration = f.currentTask.Duration;
              }else{
                //f.currentTask.eDuration = f.currentTask.Duration;
              }
              f.selected = true;
            }
          });
          rootTask.Branch.forEach(function (bs) {
            //if(scope.underhidden){
            //  if(bs[0].Name.indexOf('地下室')!=-1||bs[0].Name.indexOf('人货梯')!=-1){
            //    return;
            //  }
            //}
            bs.forEach(function (b) {
              if (!b.currentTask) {
                b.currentTask = b.OptionalTasks[0];
              }
              banchs.push(b);
            });
          });
          gs.getVars('N');
          gs.setValue('N', floors.filter(function (f) {
            // 1	标准层
            // 2	地下室
            // 4	裙楼
            // 8	转换层
            return f.FloorTypeStatus != '2';
          }).length);
          scope.flow = scope.flows = flows;
          scope.branch = scope.banchs = banchs;
          scope.buildDate();
        });
      }

      function setTask(item) {
        var index = scope.flows.indexOf(item);
        var floorArr = scope.flows.filter(function (r) {
          return r.IsFloor;
        })
        var r = floorArr.indexOf(item);
        if (r != -1) {
          for (var i = index; i < floorArr.length + index - r + 1; i++) {
            var f = scope.flows[i].OptionalTasks && scope.flows[i].OptionalTasks.find(function (task) {
                return task.TaskLibraryId === item.currentTask.TaskLibraryId;
              });
            if (f) {
              scope.flows[i].currentTask = f;
              gs.setValue(scope.flows[i].Expression + 'B', undefined);
              gs.setValue(scope.flows[i].Expression + 'D', undefined);
             // scope.flows[i].currentTask.eDuration = f.Duration;
            }
          }
        }
      }
      scope.setCurrent = function (flow, task) {
        flow.currentTask = task;
        //flow.currentTask.eDuration = flow.currentTask.Duration;
        setTask(flow);
        scope.buildDate(flow);
      }
      scope.buildBranch = function () {
        scope.banchs.forEach(function (flow) {
          var d = gs.setVars(flow.Expression);
          if (d) {
            flow.start = d.s;
            flow.days = d.days;
            flow.end = d.e;
          }
        });
      }
      scope.buildDate = function (item) {
        if (!scope.flows) return;
        //if(item&&item.currentTask&&item.currentTask.eDuration < item.currentTask.Duration*0.8){
        //  item&&(item.show = true);
        //  return;
        //}else{
        //  item&&(item.show = false);
        //};
        scope.flows.reduce(function (prev, current) {
          if(current.show) return current;
          if (!current.selected) return prev;
          if (current.type) {
            current.end = prev.end;
            return prev;
          }
          if (prev && !prev.end) { //前置条件不足
            current.days = current.start = current.end = undefined;
          }
          else {
            var start = prev ? moment(prev.end) : moment(begin),
              end;
            if (!start) {
              current.days = current.start = current.end = undefined;
            }
            else {
              try {
                //var days = gs.setVars(current.currentTask.eDuration);
                //if (days === current.currentTask.eDuration)
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
          }
          if (prev && prev.IsFloor) {
            var pTask = prev.currentTask,
              cTask = current.currentTask;
            if (current.IsFloor) {
              if (pTask.Name.indexOf('地') != -1 && cTask.Name.indexOf('地') == -1) {
                gs.setValue(prev.Expression + 'D', prev.end);
              }
              if (
                (pTask.Name.indexOf('地') != -1 ||
                pTask.Name.indexOf('裙') != -1 ||
                pTask.Name.indexOf('转') != -1) &&
                (cTask.Name.indexOf('地') == -1 &&
                cTask.Name.indexOf('裙') == -1 &&
                cTask.Name.indexOf('转') == -1)
              ) {
                gs.setValue(prev.Expression + 'B', current.start);
              }
            }
            else {
              gs.setValue(prev.Expression + 'S', prev.start);
              gs.setValue(prev.Expression + 'F', prev.end);
            }
          }
          if (current.Expression) {
            if (!current.IsFloor) {
              gs.setValue(current.Expression + 'S', current.start);
              gs.setValue(current.Expression + 'F', current.end);
            }
            //console.log('current.currentTask', current.currentTask);
          }
          return current;
        }, null);
        scope.buildBranch();
      };
      scope.down = function (flow) {
        var index = scope.flows.indexOf(flow);
        if (index >= 0) {
          var next = scope.flows[index + 1];
          if (next&&!next.IsFloor) {
            scope.flows[index] = next;
            scope.flows[index + 1] = flow;
          }else if(next&&next.IsFloor){
            utils.alert('不可与楼层交换')
          }
        }
        scope.buildDate();
      }
      scope.up = function (flow) {
        var index = scope.flows.indexOf(flow);
        var next = scope.flows[index - 1];
        if (next&&!next.IsFloor) {
          scope.flows[index] = next;
          scope.flows[index - 1] = flow;
        }else if(next&&next.IsFloor){
          utils.alert('不可与楼层交换')
        }
        scope.buildDate();
      }
      scope.setVars = function (flow) {
        var dur = flow.Type !=0 ? flow.Expression : flow.currentTask.Duration;
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

    }
  }
})(angular,undefined);
