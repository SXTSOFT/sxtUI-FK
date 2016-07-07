/**
 * Created by emma on 2016/6/8.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('mcenterController',mcenterController);

  /**@ngInject*/
  function mcenterController($scope,$rootScope,$http,xhUtils){
    var vm = this;
    vm.msgList = [{
      id:1,
      name:'甲方',
      title:'报检通知',
      description:'深圳市星河银河谷项目 1期 1栋 1001，铝合金工序'
    },{
      id:2,
      name:'甲方',
      title:'报检通知',
      description:'深圳市星河银河谷项目1期1栋1001，铝合金工序'
    },{
      id:3,
      name:'甲方',
      title:'报检通知',
      description:'深圳市星河银河谷项目1期1栋1001，铝合金工序'
    },{
      id:4,
      name:'甲方',
      title:'报检通知',
      description:'深圳市星河银河谷项目1期1栋1001，铝合金工序'
    },{
      id:5,
      name:'甲方',
      title:'报检通知',
      description:'深圳市星河银河谷项目1期1栋1001，铝合金工序'
    }]
    vm.msgList.forEach(function(t){
      t.checked = false;
    })
    $scope.$watch('vm.msgList',function(){
      var i=0;
      vm.msgList.forEach(function(t){
        console.log(t.checked)
        if(t.checked){
          i++;
        }
      })
      if(i){
        vm.showSend = true;
      }else{
        vm.showSend  = false;
      }
    },true)
    function operateMsg(){
      vm.showCheck = !vm.showCheck;
    }
    $rootScope.$on('operateMsg',operateMsg);


  }
})();
