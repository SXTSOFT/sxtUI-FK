/**
 * Created by zhangzhaoyong on 16/1/27.
 */
(function ()
{
  'use strict';

  angular
    .module('app.szgc')
    .controller('SzgcReportController', SzgcReportController);

  /** @ngInject */
  function SzgcReportController($scope,$state)
  {

    var vm = this;
    // Data
    vm.data = {
      name: '报表详细',
      disabled: true,
      selectedIndex: 1
    }
    vm.tabs = [];
    if (!$state.is('app.szgc.report')) {
      vm.tabs.push({
        name: $state.is('app.szgc.report.viewBath')?'质量总表':
          $state.is('app.szgc.report.projectMasterList') ? '项目班组总览表' :
            $state.is('app.szgc.report.batchCount') ? '项目填报情况统计表' :
              '报表详细'
      });
    }
    console.log('scope',vm)
    $scope.$watch(function(){
      return $state.is('app.szgc.report');
    },function(){
      vm.data.selectedIndex = $state.is('app.szgc.report')?0:1;
    });

    vm.goToReport = function (name, path, $event) {
      if (vm.tabs.length == 0) {
        vm.tabs.push({
          name: name
        });
      }
      else {
        vm.tabs[0].name = name;
      }
      vm.data.selectedIndex = 1;
      $state.go(path);
    }
    vm.onNavList = function () {
      vm.tabs.length = 0;
      $state.go('app.szgc.report');
      // $scope.tabs.splice($scope.data.selectedIndex-1, 1);
    };
  }
})();
