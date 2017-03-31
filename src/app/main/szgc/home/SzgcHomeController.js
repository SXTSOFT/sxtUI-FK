(function () {
  'use strict';

  angular
    .module('app.szgc')
    .controller('SzgcHomeController', SzgcHomeController);

  /** @ngInject */
  function SzgcHomeController($scope, auth, $state, $rootScope, appCookie, $timeout, versionUpdate, api, utils, $q) {
    versionUpdate.check();
    var vm = this;
    vm.data = {};
    vm.is = function (state) {
      return vm.includes(state);
    }
    vm.markerClick = markerClick;
    vm.querySearch = function (text) {
      var k = [];
      if (vm.markers) {
        vm.markers.forEach(function (item) {
          if (!text || text == '' || item.title.indexOf(text) != -1 || item.pinyin.indexOf(text) != -1) {
            k.push(item);
          }
        })
      }
      return k;
    }
    vm.changeItem = function (item) {
      $timeout(function () {
        $state.go('app.szgc.project', { pid: item.projectId, pname: item.title });
      }, 200)

    }

    function markerClick($current) {
      appCookie.put('projects', JSON.stringify([{ project_id: $current.projectId, name: $current.title }]))
      $state.go('app.szgc.project', { pid: $current.projectId, pname: $current.title });
    }

    $q.all([api.szgc.vanke.profile(),
    api.szgc.vanke.projects()]).then(function (r) {
      vm.profile = r[0].data.data;
      vm.project = r[1].data.data;


      if (vm.profile.type == "employee") {
        var date = new Date();
        var startDate = new Date(date.getFullYear() + "-" + (date.getMonth() + 1) + "-25 00:00:00");
        var day = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        var lastdate = new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + day.getDate() + " 23:59:59");
        var time = JSON.parse(appCookie.get("projectProgress"));

        if (date > startDate && date < lastdate) {
          if (!time) {
            vm.projectId = vm.project[0].project_id;
            var date = new Date;
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            $q.all([api.szgc.ProjectSettingsSevice.ex.getProjectBuildingProcedure(vm.projectId),
            api.szgc.projectProgressService.getProjectBuildingProcedure(vm.projectId, year + '-' + month)]).then(function (res) {
              vm.list = res[1].data.Rows.map(function (p) { return { id: p.Id, buildingId: p.BuildingId, procedureId: p.ProcedureId, procedureName: p.ProcedureName, count: p.Value } });
              for (var i = 0; i < res[0].data.Rows.length; i++) {
                var p = vm.list.find(function (p) { return p.buildingId == res[0].data.Rows[i].BuildingId && p.procedureId == res[0].data.Rows[i].ProcedureId });
                if (!p || !p.count) {
                  appCookie.put('projectProgress', JSON.stringify({ time: new Date() }))
                  utils.confirm('您有项目进度未设置，是否设置？').then(function (result) {
                    $state.go('app.szgc.settings');
                  });
                  break;
                }
              }
            })
          }
        } else {
          if (time) {
            $cookies.remove('projectProgress');
          }
        }
      }
    });
  }
})();
