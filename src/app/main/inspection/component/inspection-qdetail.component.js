/**
 * Created by emma on 2016/11/16.
 */
(function(){
  'use strict';

  angular
    .module('app.inspection')
    .component('inspectionQdetail',{
      templateUrl:'app/main/inspection/component/inspection-qdetail.html',
      controller:inspectionQdetailController,
      controllerAs:'vm'
    });

  /**@ngInject*/
  function inspectionQdetailController($stateParams,$scope,$rootScope){

    var vm = this;
    vm.showorhienimg=false;
    // vm.showImg = function () {
    //   $rootScope.$emit('sxtImageViewAll',{data:true});
    // }
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

    vm.data={
      id:1,
      problemnumber:'A10210',
      problem:'问题描述测试',
      position:'出现位置测试',
      datatiem:'2016-11-23测试',
      responsibilityunit:'责任单位测试',
      status:true,
      complementaryDescription:'问题补充描述测试',
      imgs:[
        {
          url:'app/main/szgc/images/1.jpg'
        },{

          url:'app/main/szgc/images/bg_home.png'
        }
      ]
    }
  }
})();
