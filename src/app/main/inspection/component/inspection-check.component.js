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
    //记录点类型数据
    // {
    //   "id":0
    //   "room_id": 0,
    //   "issues": 0,
    //   "contact_name": "string"Q
    //   "contact_phone": "string",
    //   "caller_name": "string",
    //   "caller_phone": "string",
    //   "reservation_date_begin": "2017-01-19T15:13:43.445Z",
    //   "reservation_date_end": "2017-01-19T15:13:43.445Z",
    //   "description": "string",
    //   "pictures": "string"
    // }

    var vm = this;
    //当前选择的点记录
    $scope.record={};


    vm.data={
      roomid:'',
      mapurl:'',
      username:''
    }

    //获取任务详情数据
    vm.load=function() {
      return api.inspection.estate.getdeliverys($stateParams.delivery_id).then(function (r) {
        //设置头部标题
        $timeout(function(){
          $rootScope.shell.title = r.data.data.room.name;
          vm.data.mapurl = r.data.data.room.layout.drawing_url;
          vm.data.roomid = r.data.data.room.room_id;
        })
      })
    }
    vm.load();




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

    //拦截头部按钮事件
    utils.onCmd($scope,['cjwt','csb','prev'],function(cmd,e){
      switch (cmd){
        case 'csb':
              $state.go('app.meterreading.page',{delivery_id:$stateParams.delivery_id})
              break;
        case 'cjwt':
          $state.go('app.inspection.cjwt',{delivery_id:$stateParams.delivery_id});
              break;
      }
    })
  }
})();
