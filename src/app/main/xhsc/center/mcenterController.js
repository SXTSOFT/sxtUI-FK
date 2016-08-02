/**
 * Created by emma on 2016/6/8.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('mcenterController',mcenterController);

  /**@ngInject*/
  function mcenterController($scope,$rootScope,$http,xhUtils,sxt,remote){

    var vm = this;

      remote.message.messageList(0,0).then(function (result) {

        vm.messages=[];
        result.data.forEach(function (item) {
        vm.messages.push({
          id:sxt.uuid(),
          name:'系统',
          title:item.Title,
          description:item.Content
        });

        })
      })




    //$rootScope.$on('receiveMessage',function(s,e){
    //  console.log(arguments);
    //  vm.msgList.push({
    //    id:sxt.uuid(),
    //    name:'test test ',
    //    title:e.title,
    //    description:e.content
    //  });
    //
    //});



    //vm.msgList = [{
    //  id:1,
    //  name:'甲方',
    //  title:'报检通知',
    //  description:'深圳市星河银河谷项目 1期 1栋 1001，铝合金工序'
    //},{
    //  id:2,
    //  name:'甲方',
    //  title:'报检通知',
    //  description:'深圳市星河银河谷项目1期1栋1001，铝合金工序'
    //},{
    //  id:3,
    //  name:'甲方',
    //  title:'报检通知',
    //  description:'深圳市星河银河谷项目1期1栋1001，铝合金工序'
    //},{
    //  id:4,
    //  name:'甲方',
    //  title:'报检通知',
    //  description:'深圳市星河银河谷项目1期1栋1001，铝合金工序'
    //},{
    //  id:5,
    //  name:'甲方',
    //  title:'报检通知',
    //  description:'深圳市星河银河谷项目1期1栋1001，铝合金工序'
    //}]
    vm.messages&&vm.messages.forEach(function(t){
      t.checked = false;
    })
    $scope.$watch('vm.msgList',function(){
      var i=0;
      vm.messages&&vm.messages.forEach(function(t){
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
