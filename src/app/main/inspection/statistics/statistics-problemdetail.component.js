/**
 * Created by emma on 2016/11/16.
 */
(function(){
  'use strict';

  angular
    .module('app.inspection')
    .component('statisticsProblemdetail',{
      templateUrl:'app/main/inspection/statistics/statistics-problemdetail.html',
      controller:statisticsProblemdetailController,
      controllerAs:'vm'
    });

  /**@ngInject*/
  function statisticsProblemdetailController($stateParams,$scope,$rootScope,api,$timeout){

    var vm = this;
    vm.showorhienimg=false;
    // vm.showImg = function () {
    //   $rootScope.$emit('sxtImageViewAll',{data:true});
    // }

    var ssl = sxt.requireSSL,
      host = ssl?'http://szapi2.vanke.com':'http://szmp.vanke.com';

    vm.load=function() {
      return api.inspection.estate.getrepair_tasksData($stateParams.task_id).then(function (r) {
        $timeout(function () {
          vm.data = r.data.data;
          vm.data.pictures.forEach(function (n) {
            n.url=host+n.url;
          });
          vm.data.status = vm.data.status == 'closed' ? true : false;
          vm.show = true;
        })
      })
    }





    // vm.checkimg=(function(src,istrue){
    //   vm.checkimgsrc=src;
    //   vm.showorhienimg=istrue;
    // })
    // vm.hidencheckimg=(function (data) {
    //   vm.showorhienimg=data;
    // })
    // $scope.$watch('vm.data',function(nv,ov){
    //   if(nv){
    //     console.log(nv)
    //     //修改问题状态API
    //   }
    // },true);
    // $scope.$watch('vm.data.complementaryDescription',function(nv,ov){
    //   if(nv){
    //     //修改问题状态API
    //   }
    // },true);

      vm.load();

  }
})();
