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

    var vm = this;
    var managers = ['官有风','王和贵','秦朝胜','姜丽丽','林雪旭','乌锵','赵俭','潘家霖','王建斌','谢守亮','莫智','邓荣宣'
    ,'赵偲翼','杨帆','吴勤成','吴煜楷','程含涛','沈爱民','宋细多','朱思波','殷小华','郑书航'];

    $q.all([api.szgc.vanke.profile(),
    api.szgc.vanke.projects()]).then(function (r) {
      vm.profile = r[0].data.data;
      vm.project = r[1].data.data;
      vm.projectId = vm.project[0].project_id;
      console.log(vm.projectId);
      if(managers.findIndex(function(r){ r == vm.profile.name}) != -1){
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

    vm.openProjectSetting = function () {
      var date = new Date;
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      api.szgc.vanke.project_items({ project_id: vm.projectId, page_size: 0, page_number: 1 }).then(function (res) {
        vm.data = res.data.data;
        vm.data = vm.data.map(function (v) { return { projectId: v.project.project_id, stageId: v.project_item_id, name: v.name } });
      })

      $q.all([api.szgc.ProjectSettingsSevice.ex.getProjectBuildingProcedure(vm.projectId),
      api.szgc.projectProgressService.getProjectBuildingProcedure(vm.projectId, year + '-' + month)]).then(function (res) {
        vm.Downloaded = [];
        vm.list = res[1].data.Rows.map(function (p) { return { id: p.Id, buildingId: p.BuildingId, procedureId: p.ProcedureId, procedureName: p.ProcedureName, count: p.Value } });
        var list2 = [];
        res[0].data.Rows.forEach(function (r) {
          if (!vm.Downloaded.find(function (s) { return s.stageId == r.StageId })) {
            vm.Downloaded.push({ projectId: r.ProjectId, stageId: r.StageId, stage: r.Stage })
          }
          if (!list2.find(function (s) { return s.buildingId == r.BuildingId })) {
            list2.push({ stageId: r.StageId, buildingId: r.BuildingId, buildingName: r.Building })
          }
          var p = vm.list.find(function (res) { return res.buildingId == r.BuildingId && res.procedureId == r.ProcedureId });
          if (!p) {
            vm.list.push({ id: null, buildingId: r.BuildingId, procedureId: r.ProcedureId, procedureName: r.ProcedureName });
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
          var f = vm.list.filter(function (s) { return s.id && s.buildingId == r.buildingId });
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
            if (p.count || p.id) {
              data.push({
                id: p.id,
                ProjectId: r.projectId,
                StageId: b.stageId,
                StageName:r.name,
                BuildingId: p.buildingId,
                BuildingName:b.name,
                ProcedureId: p.procedureId,
                Value: p.count
              })
            }
          })
        })
      })
      api.szgc.projectProgressService.postData(data).then(function (r) {
        utils.alert('设置成功');
      })
    }


    $scope.project = {};
    var current = null;


    vm.openNav = function (id, building) {
      $mdSidenav(id).open();
      current = building;
    };
    vm.closeNav = function (id) {
      $mdSidenav(id).close().then(function () {
        var c = current.procedures.find(function (c) { return c.procedureId == $scope.project.procedureId });
        if (c) {
          utils.alert('已设置改工序');
          return;
        }

        current.procedures.push({ id: null, buildingId: current.buildingId, procedureId: $scope.project.procedureId, procedureName: $scope.project.procedureName })
      });
    };
  }

})();
