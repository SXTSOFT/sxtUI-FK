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
          time:item.SendTime,
          title:item.Title,
          description:item.Content
        });

        })
      })

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
