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
  function statisticsProblemdetailController($stateParams,$scope,$rootScope,api){

    var vm = this;
    vm.showorhienimg=false;
    // vm.showImg = function () {
    //   $rootScope.$emit('sxtImageViewAll',{data:true});
    // }

    api.inspection.estate.getrepair_tasksData($stateParams.task_id).then(function (r) {
      vm.data=r.data.data;

      vm.data.status=vm.data.status=='closed'?true:false;
    })



    vm.checkimg=(function(src,istrue){
      vm.checkimgsrc=src;
      vm.showorhienimg=istrue;
    })
    vm.hidencheckimg=(function (data) {
      vm.showorhienimg=data;
    })
    $scope.$watch('vm.data',function(nv,ov){
      if(nv){
        console.log(nv)
        //修改问题状态API
      }
    },true);
    $scope.$watch('vm.data.complementaryDescription',function(nv,ov){
      if(nv){
        //修改问题状态API
      }
    },true);


  }
})();
