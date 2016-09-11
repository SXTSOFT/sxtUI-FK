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
    .controller('gxysReportController',gxysReportController);

  /**@ngInject*/
  function gxysReportController($scope,$mdPanel){
    var vm = this;
    vm.gxSelected=[];
    vm.secSelected=[]
    vm.regions=[{
      RegionID:'00023',
      RegionName:'星河雅宝项目'
    }]


    vm.removeRegion=function(chip){
      for (var i=vm.regions.length-1;i>=0;i--)
      {
        if (vm.regions[i].regionID>chip.regionID){
          vm.regions.splice(i,1);
        }
      }
    }
  }

})();
