/**
 * Created by emma on 2016/6/8.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('mcenterController',mcenterController);

  /**@ngInject*/
  function mcenterController($scope,$rootScope,$http,xhUtils,sxt,remote,  utils){

    var vm = this;

    function reloadMessage() {

      remote.message.messageList(0, 0).then(function (result) {

        vm.messages = [];
        result.data.Items.forEach(function (item) {
          vm.messages.push({
            id: sxt.uuid(),
            name: '系统',
            time: item.SendTime,
            title: item.Title,
            description: item.Content
          });

        })
      })
    }
    reloadMessage();
    var onMessage = $rootScope.$on('receiveMessage',function(){
      reloadMessage();
    })

    $scope.$on('destroy',function(){
      onMessage();
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

    function operateMsg(ev){

      utils.confirm('确认全部删除?',ev,'','').then(function(){
       remote.message.deleteAllMessage().then(function () {
          vm.messages = [];
        })
      })
    }
    var event=   $rootScope.$on('operateMsg',operateMsg);
    $scope.$on("$destroy",function(){
      //$mdDialog
      event();
      event=null;
    });
  }
})();
