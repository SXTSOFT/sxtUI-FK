/**
 * Created by leshuangshuang on 16/8/1.
 */
(function(){
  'use strict';

  angular
    .module('JPushPlugin')
    .factory('JPushPlugin',JPushPlugin);
  /** @ngInject */
  function JPushPlugin($window,$rootScope,utils,xhUtils,$timeout,$state){
    var JPushPlugin = $window.plugins && $window.plugins.jPushPlugin;
    $window.document.addEventListener('jpush.receiveMessage',function(e){
      var msg = {
        Title: e.title,
        Content: e.message|| e.content,
        ExtrasContent: e.extras,
        SendTime: e.extras.SendTime,
        Status:2,
        Id: e.extras.Id,
        Sender: e.Sender
      }
      // $rootScope.$emit('receiveMessage',msg);
      // $rootScope.showMessage = true;
      // xhUtils.showMessage(msg.Content,function(isCancel){
      //   if(!isCancel){
      //     $state.go('app.xhsc.mcenter');
      //   }
      // })

    },false)



    if(!JPushPlugin){
      JPushPlugin = {
        setTagsWithAlias:emptyFn,
        setTags:emptyFn,
        init:emptyFn,
        setAlias:emptyFn
      }
    }

    JPushPlugin.init();

    return JPushPlugin;

    function emptyFn(){

    }

  }
})();
