/**
 * Created by emma on 2016/11/15.
 */
(function(){
  'use strict';

  angular
    .module('app.inspection')
    .component('inspectionCheck',{
      templateUrl:'app/main/inspection/component/inspection-check.html',
      controller:inspectionCheckController,
      controllerAs:'vm'
    });

  /**@ngInject*/
  function inspectionCheckController($scope,$rootScope,utils,$state,$stateParams,$mdPanel,api,auth,$timeout){

    var vm = this;
    vm.data={
      roomid:'',
      mapurl:'',
      username:''
    }


    auth.getUser().then(function (r) {
      vm.data.username=r.Username
    });

     vm.showPopup = $stateParams.showPopup || false;

    //publicquestion 不变的问题指标 question 可变的问题指标
    vm.publicquestion =$stateParams.publicquestion;
    if (vm.publicquestion!=''){
      vm.question = vm.publicquestion;
    }else {
      vm.question = $stateParams.question;
    }

    //vm.add = function(){
    //  vm.showPopup = true;
    //}
    //vm.showCjwt = function(){
    //  var position = $mdPanel.newPanelPosition()
    //    .relativeTo('md-toolbar')
    //    .addPanelPosition($mdPanel.xPosition.ALIGN_START, $mdPanel.yPosition.BELOW)
    //    .bottom(0)
    //    .right(0)
    //
    //  $mdPanel.open({
    //    controller: function () {
    //
    //    },
    //    template: '<inspection-cjwt layout="column" flex></inspection-cjwt>',
    //    hasBackdrop: false,
    //    position: position,
    //    trapFocus: true,
    //    panelClass: 'is-cjwt',
    //    zIndex: 5000,
    //    clickOutsideToClose: true,
    //    escapeToClose: true,
    //    focusOnOpen: true,
    //    attachTo:angular.element('#content')
    //  });
    //}
    //拦截头部按钮事件
    utils.onCmd($scope,['cjwt','csb','prev'],function(cmd,e){
      switch (cmd){
        case 'csb':
              $state.go('app.meterreading.page',{delivery_id:$stateParams.delivery_id})
              break;
        case 'cjwt':
          $state.go('app.inspection.cjwt',{delivery_id:$stateParams.delivery_id});
              //vm.showCjwt();
              break;
      }
    })
    //获取任务详情数据
    vm.load=function() {
     return api.inspection.estate.getdeliverys($stateParams.delivery_id).then(function (r) {
        //设置头部标题
       $timeout(function(){
         $rootScope.shell.title = r.data.data.room.name;
        vm.data.mapurl = r.data.data.room.layout.drawing_url;
        vm.data.roomid = r.data.data.room.room_id;
        vm.show=true;
       })
      })
    }
    vm.load();
  }
})();
