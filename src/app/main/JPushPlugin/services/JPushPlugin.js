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
    // $window.document.addEventListener('jpush.receiveMessage',function(e){
      // var msg = {
      //   Title: e.title,
      //   Content: e.message|| e.content,
      //   ExtrasContent: e.extras,
      //   SendTime: e.extras.SendTime,
      //   Status:2,
      //   Id: e.extras.Id,
      //   Sender: e.Sender
      // }
      // $rootScope.$emit('receiveMessage',msg);
      // $rootScope.showMessage = true;
      // xhUtils.showMessage(msg.Content,function(isCancel){
      //   if(!isCancel){
      //     $state.go('app.xhsc.mcenter');
      //   }
      // })

    // },false)



    if(!JPushPlugin){
      JPushPlugin = {
        setTagsWithAlias:emptyFn,
        setTags:emptyFn,
        init:emptyFn,
        setAlias:emptyFn
      }
    }

    // function onGetRegistrationID(data) {
    //   try {
    //     console.log("JPushPlugin:registrationID is " + data);
    //     if (data.length == 0) {
    //       var t1 = window.setTimeout(getRegistrationID, 5000);
    //     }
    //   } catch (exception) {
    //     console.log(exception);
    //   }
    // };
    //
    // var getRegistrationID = function() {
    //   window.plugins.jPushPlugin.getRegistrationID(onGetRegistrationID);
    // };
    //
    // var onTagsWithAlias = function(event) {
    //   try {
    //     console.log("onTagsWithAlias");
    //     var result = "result code:" + event.resultCode + " ";
    //     result += "tags:" + event.tags + " ";
    //     result += "alias:" + event.alias + " ";
    //   } catch (exception) {
    //     console.log(exception)
    //   }
    // };
    //
    // function init() {
    //   try {
    //     window.plugins.jPushPlugin.init();
    //     window.setTimeout(getRegistrationID, 5000);
    //     if (device.platform != "Android") {
    //       window.plugins.jPushPlugin.setDebugModeFromIos();
    //       window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
    //     } else {
    //       window.plugins.jPushPlugin.setDebugMode(true);
    //       window.plugins.jPushPlugin.setStatisticsOpen(true);
    //     }
    //   } catch (exception) {
    //     console.log(exception);
    //   }
    // };
    // document.addEventListener("jpush.setTagsWithAlias", onTagsWithAlias, false);
    // init();
    JPushPlugin.init();
    return JPushPlugin;

    function emptyFn(){

    }

  }
})();
