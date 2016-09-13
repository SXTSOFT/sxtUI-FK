/**
 * Created by lss on 2016/9/13.
 */
/**
 * Created by lss on 2016/9/8.
 */
/**
 * Created by emma on 2016/6/7.
 */
(function(){
  'use strict';

  angular
    .module('app.pcReport_ys')
    .controller('scslFilterController',scslFilterController);

  /**@ngInject*/
  function scslFilterController($scope,remote,$mdDialog,$state,$rootScope){
    var vm = this;
    vm.gxSelected=[];
    vm.secSelected=[]
    vm.regions=[];
    remote.Project.getMap().then(function (result) {
      result.data.forEach(function (m) {
        vm.regions.push({
          RegionID: m.ProjectID,
          RegionName: m.ProjectName
        })
      });
    });
    vm.submit=function(){
      $rootScope.scParams={
        secSelected:vm.secSelected,
        gxSelected:vm.gxSelected
      };
      $state.go("app.pcReport_sl_rp");
    }
  }
})();
