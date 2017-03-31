/**
 * Created by 陆科桦 on 2016/11/4.
 */
(function (angular,undefined) {
  'use strict';
  angular
    .module('app.szgc')
    .controller('visitResultController',visitResultController);

  /** @ngInject */
  function visitResultController($scope,$filter,api,utils){
    var vm = this;
    vm.eDate = new Date();
    var date_tmp = new Date();
    date_tmp.setDate(date_tmp.getDate() - 7);
    vm.sDate = date_tmp;
    var dateFilter = $filter('date');

    $scope.$on('$destroy',$scope.$on('goBack',function (s,e) {
      if(vm.searchResult){
        vm.searchResult  = false;
        e.cancel = true;
      }
    }));

    var initData = [
      { project: '渔一村', user: '官有风',times:0 },
      //{ project: '南科大', user: '王和贵', times: 0 },
      { project: '兰江', user: '秦朝胜', times: 0 },
      { project: '车公庙', user: '姜丽丽', times: 0 },
      { project: '北站', user: '林雪旭', times: 0 },
      { project: '正顺', user: '乌锵', times: 0 },
      { project: '时代广场', user: '赵俭', times: 0 },
      { project: '三馆', user: '潘家霖', times: 0 },
      { project: '双月湾', user: '王建斌', times: 0 },
      { project: '九洲三期', user: '谢守亮', times: 0 },
      { project: '九洲四期', user: '莫智', times: 0 },
      { project: '红树湾', user: '邓荣宣', times: 0 },
      //{ project: '第五园', user: '徐凯', times: 0 },
      { project: '云城三街坊', user: '赵偲翼', times: 0 },
      { project: '云城四街坊', user: '杨帆', times: 0 },
      { project: '云城五街坊', user: '吴勤成', times: 0 },
      //{ project: '云城', user: '朱志荣', times: 0 },
      { project: '九龙山', user: '吴煜楷', times: 0 },
      { project: '水径', user: '程含涛', times: 0 },
      { project: '壹海城', user: '沈爱民', times: 0 },
      { project: '公园里', user: '宋细多', times: 0 },
      { project: '南科大-崇文花园', user: '朱思波', times: 0 },
      { project: '南科大-智园D区', user: '殷小华', times: 0 },
      { project: '安托山', user: '郑书航', times: 0 }
    ];
    var r2 = [];
    initData.forEach(function (t,i) {
      var i1 = i%2,r = r2[i1] = r2[i1]||[];
      r.push(t);
    });
    vm.results = r2;



    vm.seach = function () {
      vm.results = [];
      vm.searchResult=true;
      api.szgc.projectMasterListService.getVisitResult('?fromDate=' + dateFilter(vm.sDate, 'yyyy-MM-dd') + '&toDate=' + dateFilter(vm.eDate, 'yyyy-MM-dd'))
        .then(function (result) {
          initData.forEach(function (d) {
            result.data.Rows.forEach(function (r) {
              if (d.user == r.name) {
                d.times = r.times;
              }
            });
          });
          vm.results = r2;
        });
    }
  }

})(angular,undefined);
