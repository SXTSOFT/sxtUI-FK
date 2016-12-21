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
    //   var msg = {
    //     Title: e.title,
    //     Content: e.message|| e.content,
    //     ExtrasContent: e.extras,
    //     SendTime: e.extras.SendTime,
    //     Status:2,
    //     Id: e.extras.Id,
    //     Sender: e.Sender
    //   }
    //   $rootScope.$emit('receiveMessage',msg);
    //   $rootScope.showMessage = true;
    //   xhUtils.showMessage(msg.Content,function(isCancel){
    //     if(!isCancel){
    //       $state.go('app.xhsc.mcenter');
    //     }
    //   })
    //
    // },false)




    // var getRegistrationID = function() {
    //   JPushPlugin.getRegistrationID(onGetRegistrationID);
    // };
    // var onGetRegistrationID = function(data) {
    //   try {
    //     var s=data;
    //     if (data.length == 0) {
    //       var t1 = window.setTimeout(getRegistrationID, 1000);
    //     }
    //   } catch (exception) {
    //     console.log(exception);
    //   }
    // };
    // var onTagsWithAlias = function(event) {
    //   try {
    //     var result = "result code:" + event.resultCode + " ";
    //     result += "tags:" + event.tags + " ";
    //     result += "alias:" + event.alias + " ";
    //   } catch (exception) {
    //    var  s=exception;
    //   }
    // };
    // var onOpenNotification = function(event) {
    //   try {
    //     var alertContent;
    //     if (device.platform == "Android") {
    //       alertContent = jPushPlugin.openNotification.alert;
    //     } else {
    //       alertContent = event.aps.alert;
    //     }
    //     alert("open Notification:" + alertContent);
    //   } catch (exception) {
    //   var s=exception
    //   }
    // };
    // var onReceiveNotification = function(event) {
    //   try {
    //     var alertContent;
    //     if (device.platform == "Android") {
    //       alertContent = jPushPlugin.receiveNotification.alert;
    //     } else {
    //       alertContent = event.aps.alert;
    //     }
    //   } catch (exception) {
    //    var s= exception
    //   }
    // };
    // var onReceiveMessage = function(event) {
    //   try {
    //     var message;
    //     if (device.platform == "Android") {
    //       message = jPushPlugin.receiveMessage.message;
    //     } else {
    //       message = event.content;
    //     }
    //   } catch (exception) {
    //     var  s=exception;
    //   }
    // };
    //
    // document.addEventListener("jpush.setTagsWithAlias", onTagsWithAlias, false);
    // document.addEventListener("jpush.openNotification", onOpenNotification, false);
    // document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);
    // document.addEventListener("jpush.receiveMessage", onReceiveMessage, false);
    //
    //
    //
    //
    //
    //
    // try {
    //   JPushPlugin.init();
    //   getRegistrationID();
    //   if (device.platform != "Android") {
    //     JPushPlugin.setDebugModeFromIos();
    //     JPushPlugin.setApplicationIconBadgeNumber(0);
    //   } else {
    //     JPushPlugin.setDebugMode(true);
    //     JPushPlugin.setStatisticsOpen(true);
    //   }
    // } catch (exception) {
    //  var s=exception;
    // }
    // JPushPlugin.setAlias(15999657572);













    if(!JPushPlugin){
      JPushPlugin = {
        setTagsWithAlias:emptyFn,
        setTags:emptyFn,
        init:emptyFn,
        setAlias:emptyFn
      }
    }

    // JPushPlugin.init();

    return JPushPlugin;

    function emptyFn(){

    }

  }
})();
