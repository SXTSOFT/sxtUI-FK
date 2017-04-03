/**
 * Created by zhangzhaoyong on 16/2/1.
 */
(function () {
  'use strict';

  angular
    .module('app.szgc')
    .controller('SzgcSettingsController', SzgcSettingsController);

  /** @ngInject */
  function SzgcSettingsController(auth, api, $scope, utils, $rootScope, appCookie, $mdDialog, versionUpdate, $q, $mdSidenav) {

    var vm = this, selected;

    vm.selected = selected = {
      name: '已选择',
      children: [{
        name: '已选择',
        ps: []
      }],
      ps: []
    }

    var managers = [
      "秦洪磊",
      "江焕志",
      "王冬臻",
      "刘志毅",
      "江海平",
      "陈战国",
      "吴文操",
      "魏鲁喆",
      "李文俊",
      "陈世旅",
      "聂旸",
      "刘健",
      "关奥",
      "陈俊儒",
      "吴崇德",
      "靳启言",
      "王曦",
      "周千军",
      "张天一",
      "贺行",
      "严章猛",
      "梅忠敏",
      "秦国奎",
      "刘啸",
      "余晓华",
      "廖毅",
      "赵新平",
      "罗亦",
      "黄敏",
      "黄鑫",
      "邓伟栋",
      "李永涛",
      "邓朝",
      "钱一戈",
      "张智强",
      "蓝铭",
      "胡铁山",
      "戈轶峰",
      "王静博",
      "梁峰铭",
      "黄兵勇",
      "张顺",
      "张波",
      "宿伟",
      "杨业标"];

    $q.all([api.szgc.vanke.profile(),
    api.szgc.vanke.projects()]).then(function (r) {
      vm.profile = r[0].data.data;
      vm.project = r[1].data.data;
      //vm.projectId = '52ba76053cf7fbe61100001b';
      if (managers.findIndex(function (m) { return m == vm.profile.name }) != -1) {
        vm.projectId = vm.project[0].project_id;
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
          project_id: vm.projectId,
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

    $scope.loadProcedure = function (item) {
      item.show = !item.show;
    }

    var list3 = [];
    vm.openProjectSetting = function () {
      if (vm.data) return;
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      api.szgc.vanke.project_items({ project_id: vm.projectId, page_size: 0, page_number: 1 }).then(function (res) {
        vm.data = res.data.data;
        vm.data = vm.data.map(function (v) { return { projectId: v.project.project_id, stageId: v.project_item_id, name: v.name } });
      })

      $q.all([api.szgc.ProjectSettingsSevice.ex.getProjectBuildingProcedure(vm.projectId),
      api.szgc.projectProgressService.getProjectBuildingProcedure(vm.projectId, year + '-' + month)]).then(function (res) {
        vm.Downloaded = [];
        // vm.list = res[1].data.Rows.map(function (p) { return { id: p.Id, buildingId: p.BuildingId, procedureId: p.ProcedureId, procedureName: p.ProcedureName, count: p.Value } });
        vm.list = []
        var list2 = [];
        list3 = res[1].data.Rows.map(function (p) { return { id: p.Id, buildingId: p.BuildingId, procedureId: p.ProcedureId, procedureName: p.ProcedureName, count: p.Value } });

        vm.list = res[0].data.Rows.map(function (r) {
          return { id: null, buildingId: r.BuildingId, procedureId: r.ProcedureId, procedureName: r.ProcedureName, isPull: true };
        })

        //过滤已设置的工序
        list3.forEach(function (r) {
          var r = vm.list.find(function (s) { return s.buildingId == r.buildingId && s.procedureId == r.procedureId });
          if (r) {
            vm.list.splice($.inArray(r, vm.list), 1)
          }
        })

        res[0].data.Rows.forEach(function (r) {
          if (!vm.Downloaded.find(function (s) { return s.stageId == r.StageId })) {
            vm.Downloaded.push({ projectId: r.ProjectId, stageId: r.StageId, stage: r.Stage })
          }
          if (!list2.find(function (s) { return s.buildingId == r.BuildingId })) {
            list2.push({ stageId: r.StageId, buildingId: r.BuildingId, buildingName: r.Building })
          }
        })

        res[1].data.Rows.forEach(function (r) {
          if (!vm.Downloaded.find(function (s) { return s.stageId == r.StageId })) {
            vm.Downloaded.push({ projectId: r.ProjectId, stageId: r.StageId, stage: r.StageName })
          }

          if (!list2.find(function (s) { return s.buildingId == r.BuildingId })) {
            list2.push({ stageId: r.StageId, buildingId: r.BuildingId, buildingName: r.BuildingName })
          }
        })

        list2.forEach(function (r) {
          var f = list3.filter(function (s) { return s.id && s.buildingId == r.buildingId });
          r.procedures = f;
        })

        vm.Downloaded.forEach(function (r) {
          var f = list2.filter(function (s) { return s.stageId == r.stageId && s.procedures.length != 0 });
          r.buildings = f;
        })

        vm.Downloaded = vm.Downloaded.filter(function (x) {
          return x.buildings.length != 0;
        })
      })
    }

    vm.save = function () {
      var data = [];
      vm.data.forEach(function (r) {
        r.buildings && r.buildings.forEach(function (b) {
          b.procedures.forEach(function (p) {
            if (p.count) {
              data.push({
                id: p.id,
                ProjectId: r.projectId,
                StageId: b.stageId,
                StageName: r.name,
                BuildingId: p.buildingId,
                BuildingName: b.name,
                ProcedureId: p.procedureId,
                Value: p.count
              })
            }
          })
        })
      })

      vm.Downloaded.forEach(function (r) {
        r.buildings && r.buildings.forEach(function (b) {
          b.procedures.forEach(function (p) {
            data.push({
              id: p.id,
              ProjectId: r.projectId,
              StageId: b.stageId,
              StageName: r.name,
              BuildingId: p.buildingId,
              BuildingName: b.name,
              ProcedureId: p.procedureId,
              Value: p.count
            })
          })
        })
      })
      api.szgc.projectProgressService.postData(data).then(function (r) {
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
            if (!gx && !list3.find(function(g){ return g.buildingId == vm.current.buildingId && g.procedureId == x.ProcedureId })) {
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

      // if(selected.ps.length>4){
      //   utils.alert('一次仅能显示四种工序');
      //   p.checked =false;
      // }
      // for(var i=selected.ps.length-1;i>=0;i--){
      //   if(!selected.ps[i].checked){
      //     selected.ps.splice(i,1);
      //     selected.children[0].ps.splice(i,1);
      //   }
      // }
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
            //console.log(p,c);
            if (p.ProcedureTypeId == c.skill_id) {
              c.ps.push(p);
              g.ps.push(p);
            }
          })
        });
      });
      //console.log('s',s);
      vm.types = s;
      vm.procedures = results[1].data.Rows;
      // var g = appCookie.get('_gx_');
      // if(g){
      //   g = angular.isArray(g)?g:g.replace('[','').replace(']','').split(',');
      //   g.forEach(function (item) {
      //     var fd = vm.procedures.find(function (gx) {
      //       return gx.ProcedureId==item;
      //     });
      //     if(fd){
      //       fd.checked = true;
      //       selected.ps.push(fd);
      //       selected.children[0].ps.push(fd);
      //     }
      //   });
      // }
      // if(g && g.length) {
      //   vm.query();
      // }
      // else{
      //   vm.openGx();
      // }

    });
  }

})();
