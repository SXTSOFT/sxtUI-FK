(function () {
  'use strict';

  angular
    .module('app.szgc')
    .controller('SzgcHomeController', SzgcHomeController);

  /** @ngInject */
  function SzgcHomeController($scope, auth, $state, $rootScope, appCookie, $timeout, versionUpdate, api, utils, $q, $filter) {
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
      "杨业标",
      "汪尚毅",
      "王曦",
      "黄书韵"
    ];

    var user = auth.current();
    if (managers.findIndex(function (m) { return m == user.RealName }) != -1) {
      $q.all([api.szgc.vanke.profile(),
      api.szgc.vanke.projects()]).then(function (r) {
        vm.profile = r[0].data.data;
        vm.project = r[1].data.data;
        if (vm.profile.type == "employee") {

          var dateFilter = $filter('date');

          var now = dateFilter(new Date(), 'yyyy-MM-dd');
          var time = JSON.parse(appCookie.get("projectProgress"));
          var yesterday;
          if (time) {
            yesterday = dateFilter(time.time, 'yyyy-MM-dd');
          }

          if (!yesterday || now > yesterday) {
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
        }
      });
    }
  }
})();
