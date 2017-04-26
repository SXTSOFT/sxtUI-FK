/**
 * Created by zhangzhaoyong on 16/2/1.
 */
(function () {
  'use strict';

  angular
    .module('app.szgc')
    .controller('SzgcSettingsController', SzgcSettingsController);

  /** @ngInject */
  function SzgcSettingsController(auth, api, $scope, utils, $rootScope, appCookie, $mdDialog, versionUpdate, $q, $mdSidenav, sxt, $element, $filter) {

    var vm = this, selected;

    vm.selected = selected = {
      name: '已选择',
      children: [{
        name: '已选择',
        ps: []
      }],
      ps: []
    }
    vm.setProcedure = null;
    $q.all([api.szgc.vanke.profile(),
    api.szgc.vanke.projects()]).then(function (r) {
      vm.profile = r[0].data.data;
      vm.project = r[1].data.data;

      if (vm.profile.type == "employee") {
        vm.projectId = [];
        for (var i = 0; i < vm.project.length; i++) {
          vm.projectId.push(vm.project[i].project_id);
        }
        vm.projectId = vm.projectId.join(',');
        //console.log(vm.projectId);
        //vm.projectId = vm.project.map(function (p) { return p.project_id }).join(',');
      }
    });
    vm.logout = function () {
      api.uploadTask(function (cfg, item) {
        return true
      }).then(function (result) {
        if (result.rows.length) {
          utils.confirm('您有' + result.rows.length + '条数据未上传，确定清除所有缓存数据并退出吗？').then(function (result) {
            appCookie.remove('projects');
            vm.trueClear([], function () {
              auth.logout();
            });

          })
        }
        else {
          utils.confirm('退出将清除当前人所有缓存数据，确定退出吗?').then(function (result) {
            appCookie.remove('projects');
            vm.trueClear([], function () {
              auth.logout();
            });

          });
        }
      });
    }
    vm.appVersion = versionUpdate.version;
    versionUpdate.check().then(function () {
      vm.appVersion = versionUpdate.version;
    });
    //服务器上保存版本信息
    /*  api.szgc.version().then(function (r) {
        //vm.serverAppVersion = r.data.verInfo;
      });*/
    $rootScope.$on('sxt:online', function (event, state) {
      vm.networkState = api.getNetwork();
    });
    $rootScope.$on('sxt:offline', function (event, state) {
      vm.networkState = api.getNetwork();
    });
    vm.networkState = api.getNetwork();
    $scope.$watch(function () {
      return vm.networkState
    }, function () {
      api.setNetwork(vm.networkState);
    });
    vm.trueClear = function (exclude, callback) {
      $mdDialog.show({
        controller: ['$scope', 'utils', '$mdDialog', function ($scope, utils, $mdDialog) {
          api.clearDb(function (persent) {
            $scope.cacheInfo = parseInt(persent * 100) + '%';
          }, function () {
            api.uploadTask(function () {
              return true;
            }, null);
            $scope.cacheInfo = null;
            $mdDialog.hide();
            utils.alert('清除完成');
          }, function () {
            $scope.cacheInfo = null;
            $mdDialog.cancel();
            utils.alert('清除失败');

          }, {
              exclude: exclude,
              timeout: 3000
            })
        }],
        template: '<md-dialog aria-label="正在清除"  ng-cloak><md-dialog-content> <md-progress-circular md-mode="indeterminate" md-diameter="20"></md-progress-circular> 正在清除数据，请稍候……({{cacheInfo}})</md-dialog-content></md-dialog>',
        parent: angular.element(document.body),
        clickOutsideToClose: false,
        fullscreen: false
      })
        .then(function (answer) {
          //auth.logout();
          callback && callback();
        }, function () {

        });

      return;

    }
    vm.clearCache = function () {
      api.uploadTask(function (cfg, item) {
        return true
      }).then(function (result) {
        if (result.rows.length) {
          utils.confirm('您有' + result.rows.length + '条数据未上传，确定清除所有缓存数据吗？').then(function (result) {
            //console.log('r', result);
            vm.trueClear(['v_profile']);
          })
        }
        else {
          utils.confirm('确定清除所有缓存数据吗?').then(function (result) {
            vm.trueClear(['v_profile']);
          });
        }
      });
    }

    $scope.loadBuildings = function (s) {
      if (!s.buildings) {
        api.szgc.vanke.buildings({
          project_id: s.projectId,
          project_item_id: s.stageId,
          page_size: 0,
          page_number: 1
        }).then(function (res) {
          s.show = true;
          s.buildings = res.data.data.map(function (b) {
            return {
              show: true,
              stageId: s.stageId,
              buildingId: b.building_id,
              name: b.name,
              procedures: vm.list.filter(function (p) {
                return b.building_id == p.buildingId;
              })
            }
          });
        });
      } else {
        s.show = !s.show;
      }
    }

    $scope.loadStages = function (p) {
      if (!p.stages) {
        api.szgc.vanke.project_items({ project_id: p.project_id, page_size: 0, page_number: 1 }).then(function (res) {
          p.show = true;
          p.stages = res.data.data.map(function (v) { return { show: false, projectId: v.project.project_id, stageId: v.project_item_id, name: v.name } })
        });
      } else {
        p.show = !p.show;
      }
    }

    // $scope.getValue = function(g){
    //   console.log(g);
    // }

    $scope.loadProcedure = function (item) {
      item.show = !item.show;
    }

    var list3 = [];
    var dateFilter = $filter('date');
    vm.openProjectSetting = function (isRefresh) {
      vm.loading = true;
      if (vm.data && !isRefresh) {
        vm.loading = false;
        return;
      }

      vm.data = vm.project;
      //vm.Downloaded = vm.project.map(function (p) { return { projectId: p.project_id, name: p.name } });
      var date = new Date();
      // api.szgc.vanke.project_items({ project_id: vm.projectId, page_size: 0, page_number: 1 }).then(function (res) {
      //   vm.data = res.data.data;
      //   vm.data = vm.data.map(function (v) { return { projectId: v.project.project_id, stageId: v.project_item_id, name: v.name } });
      // })

      $q.all([api.szgc.ProjectSettingsSevice.ex.getProjectBuildingProcedure(vm.projectId),
      api.szgc.projectProgressService.getProjectBuildingProcedure(vm.projectId, dateFilter(date, 'yyyy-MM'))]).then(function (res) {
        //vm.Downloaded = [];
        // vm.list = res[1].data.Rows.map(function (p) { return { id: p.Id, buildingId: p.BuildingId, procedureId: p.ProcedureId, procedureName: p.ProcedureName, value: p.Value } });
        vm.list = []
        var list2 = [];
        var download = [];
        list3 = res[1].data.Rows.map(function (p) { return { id: p.Id, buildingId: p.BuildingId, procedureId: p.ProcedureId, procedureName: p.ProcedureName, value: p.Value, isPull: true } });
        vm.list = res[0].data.Rows.map(function (r) {
          return { id: null, buildingId: r.BuildingId, procedureId: r.ProcedureId, procedureName: r.ProcedureName, isPull: true };
        })

        list3.forEach(function (item) {
          var r = vm.list.find(function (s) { return s.buildingId == item.buildingId && s.procedureId == item.procedureId });
          if (r) {
            r.id = item.id;
            r.value = item.value;
          } else {
            vm.list.push(item);
          }
        })

        //console.log(vm.list);

        //过滤已设置的工序
        // list3.forEach(function (r) {
        //   var r = vm.list.find(function (s) { return s.buildingId == r.buildingId && s.procedureId == r.procedureId });
        //   if (r) {
        //     vm.list.splice($.inArray(r, vm.list), 1)
        //   }
        // })

        // res[0].data.Rows.forEach(function (r) {
        //   if (!download.find(function (s) { return s.stageId == r.StageId })) {
        //     download.push({ projectId: r.ProjectId, stageId: r.StageId, stage: r.Stage })
        //   }
        //   if (!list2.find(function (s) { return s.buildingId == r.BuildingId })) {
        //     list2.push({ stageId: r.StageId, buildingId: r.BuildingId, buildingName: r.Building })
        //   }
        // })

        // res[1].data.Rows.forEach(function (r) {
        //   if (!download.find(function (s) { return s.stageId == r.StageId })) {
        //     download.push({ projectId: r.ProjectId, stageId: r.StageId, stage: r.StageName })
        //   }

        //   if (!list2.find(function (s) { return s.buildingId == r.BuildingId })) {
        //     list2.push({ stageId: r.StageId, buildingId: r.BuildingId, buildingName: r.BuildingName })
        //   }
        // })

        // list2.forEach(function (r) {
        //   var f = list3.filter(function (s) { return s.id && s.buildingId == r.buildingId });
        //   r.procedures = f;
        // })

        // download.forEach(function (r) {
        //   var f = list2.filter(function (s) { return s.stageId == r.stageId && s.procedures.length != 0 });
        //   r.buildings = f;
        // })

        // download = download.filter(function (x) {
        //   return x.buildings.length != 0;
        // })

        // vm.Downloaded.forEach(function (d) {
        //   d.stages = download.filter(function (s) {
        //     return d.projectId == s.projectId;
        //   })
        // })

        // vm.Downloaded = vm.Downloaded.filter(function (p) {
        //   return p.stages.length != 0;
        // })

        vm.loading = false;
      })
    }
    vm.loading = false;
    vm.save = function () {
      var data = [];
      vm.loading = true;
      vm.data.forEach(function (s) {
        s.stages && s.stages.forEach(function (r) {
          r.buildings && r.buildings.forEach(function (b) {
            b.procedures.forEach(function (p) {
              if (p.id || p.value) {
                var isAdd = p.id ? false : true;
                p.id = p.id ? p.id : sxt.uuid();
                data.push({
                  id: p.id,
                  ProjectId: r.projectId,
                  ProjectName: s.name,
                  StageId: b.stageId,
                  StageName: r.name,
                  BuildingId: p.buildingId,
                  BuildingName: b.name,
                  ProcedureId: p.procedureId,
                  Value: p.value,
                  IsAdd: isAdd
                })
              }
            })
          })
        })
      })

      // vm.Downloaded.forEach(function (s) {
      //   s.stages && s.stages.forEach(function (r) {
      //     r.buildings && r.buildings.forEach(function (b) {
      //       b.procedures.forEach(function (p) {
      //         data.push({
      //           id: p.id,
      //           ProjectId: r.projectId,
      //           StageId: b.stageId,
      //           StageName: r.stage,
      //           BuildingId: p.buildingId,
      //           BuildingName: b.buildingName,
      //           ProcedureId: p.procedureId,
      //           Value: p.value
      //         })
      //       })
      //     })
      //   })
      // })
      api.szgc.projectProgressService.postData(data).then(function (r) {
        vm.openProjectSetting(true);
        utils.alert('设置成功');
      })
    }


    $scope.project = {};
    vm.current = null;


    // vm.openNav = function (id, building) {
    //   $mdSidenav(id).open();
    //   current = building;
    // };
    // vm.closeNav = function (id) {
    //   $mdSidenav(id).close().then(function () {
    //     var c = current.procedures.find(function (c) { return c.procedureId == $scope.project.procedureId });
    //     if (c) {
    //       utils.alert('已设置该工序');
    //       return;
    //     }

    //     current.procedures.push({ id: null, buildingId: current.buildingId, procedureId: $scope.project.procedureId, procedureName: $scope.project.procedureName })
    //   });
    // };


    //---------------------------------

    function buildToggler(navID, building) {
      return function () {
        $mdSidenav(navID)
          .toggle()
          .then(function () {

          });
      }
    }

    vm.openGx = buildToggler('procedure_right');

    $scope.$watch('vm.build.isOpen', function () {
      if (vm.procedures) {
        if (!vm.build.isOpen) {
          var g = [];
          vm.procedures.forEach(function (gx) {
            if (gx.checked) {
              g.push(gx);
              gx.checked = false;
            }
          })
          selected.ps = [];
          selected.children[0].ps = [];
          g.forEach(function (x) {
            var gx = vm.current.procedures.find(function (p) { return p.procedureId == x.ProcedureId });
            if (!gx && !list3.find(function (g) { return g.buildingId == vm.current.buildingId && g.procedureId == x.ProcedureId })) {
              vm.current.procedures.push({ id: null, buildingId: vm.current.buildingId, procedureId: x.ProcedureId, procedureName: x.ProcedureName, isPull: false })
            }
          })

          for (var i = vm.current.procedures.length - 1; i >= 0; i--) {
            var x = g.find(function (p) { return p.ProcedureId == vm.current.procedures[i].procedureId });
            if (!x && vm.current.procedures[i].isPull == false) {
              vm.current.procedures.splice(i, 1);
            }
          }

        } else {
          vm.current.procedures.forEach(function (gx) {
            var g = vm.procedures.find(function (p) { return p.ProcedureId == gx.procedureId });
            if (g) {
              g.checked = true;
              selected.ps.push(g);
              selected.children[0].ps.push(g);
            }
          })
        }
        vm.current.show = true;
      }
    })

    vm.clearAll = function () {
      vm.selected.ps = [];
      vm.procedures.forEach(function (r) {
        r.checked = false;
      })
    }

    vm.itemChecked1 = function (p) {
      p.checked = !p.checked;
      vm.itemChecked(p);
    }
    vm.itemChecked = function (p) {
      vm.procedures.forEach(function (gx) {
        if (gx.checked && !selected.ps.find(function (a) {
          return a === gx;
        })) {
          selected.ps.push(gx);
          selected.children[0].ps.push(gx);
        }
      });
    }

    $q.all([
      api.szgc.vanke.skills({ page_number: 1, page_size: 0 }),
      api.szgc.BatchSetService.getAll({ status: 4, batchType: 255 })
    ]).then(function (results) {

      var s = [], result = results[0];
      result.data.data.forEach(function (item) {
        if (!item.parent) return;
        var gn = s.find(function (g) { return item.parent.name == g.name });
        if (!gn) {
          gn = {
            name: item.parent.name,
            children: []
          };
          s.push(gn);
        }
        gn.children.push(item);
      });

      s.forEach(function (g) {
        g.ps = [];
        g.children.forEach(function (c) {
          c.ps = [];
          results[1].data.Rows.forEach(function (p) {
            if (p.ProcedureTypeId == c.skill_id) {
              c.ps.push(p);
              g.ps.push(p);
            }
          })
        });
      });
      vm.types = s;
      vm.procedures = results[1].data.Rows;

    });
    // vm.setValue = function ($event, g) {
    //   var idx = $(".progress").find('div.point').index($($event.target).parent());
    //   vm.keyboard = true;
    //   pontTo(idx);
    // }
    $element.on('click', ' div.point', function (e) {
      var idx = $(".progress").find('div.point').index($(e.target).parent());
      vm.keyboard = true;
      $scope.$apply();
      pontTo(idx);
    });
    var currentPoint = null;
    function pontTo(index) {
      if (currentPoint) {
        currentPoint.css({'background': '','color':''})
      }
      $scope.index = index;
      var p = currentPoint = $('div.point', $(".progress")).eq(index), span = p.find('span');
      if (p) {
        currentPoint.css({'background': '#e93030','color':'#fff'})
        $rootScope.$emit('keyboard:setvalue', '');
        $(".progress").animate({
          scrollTop: $(".progress").scrollTop() + p.offset().top - $(".progress").height() + p.height() - $(".progress").offset().top + 10
        });
      }
    }

    $rootScope.$on('keyboard:nextpoint', function () {
      //pontTo($scope.index + 1);
      var datas = $('.datas', $(".progress"));
      var eq = datas.index($(currentPoint.parents('.datas')[0])) + 1;
      var curdata = datas.index($(currentPoint.parents('.datas')[0]));
      var nextItem = datas.eq(eq);
      var ilen = datas.eq(curdata).find('.point').length;

      if (eq < datas.length) {
        pontTo($('div.point', $(".progress")).index(nextItem.find('div.point').eq(0)));
      } else {
        vm.keyboard = false;
      }
    });

    $rootScope.$on('keyboard:value', function ($event, value) {
      currentPoint && currentPoint.find('span').text(value);
    });
  }

})();
