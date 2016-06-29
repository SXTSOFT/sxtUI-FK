/**
 * Created by leshuangshuang on 16/6/24.
 */
(function(){
  'use strict';
  angular
    .module('app.xhsc')
    .factory('notification',notification);
  /** @ngInject */
  function notification(){

    return{
      openNotification:openNotification,
      receiveNotification:receiveNotification,
      receiveMessage:receiveMessage
    }

    //获取点击通知内容
    function openNotification(){

      function onOpenNotification (){
        var alertContent;
      if(device.platform == "Android") {
        alertContent = window.plugins.jPushPlugin.openNotification.alert;
      } else {
        alertContent = event.aps.alert;
      }
      alert("open Notificaiton:" + alertContent);
      }

      document.addEventListener("jpush.openNotification", onOpenNotification, false);
    }

    //获取通知内容
    function receiveNotification(){

      function onReceiveNotification (){

        var alertContent;
        if(device.platform == "Android") {
          alertContent = window.plugins.jPushPlugin.receiveNotification.alert;
        } else {
          alertContent = event.aps.alert;
        }
        alert("open Notificaiton:" + alertContent);
      }

      document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);
    }

    //获取自定义消息推送内容
    function receiveMessage(){



      var onReceiveMessage = function(event) {
        try{
          var message
          if(device.platform == "Android") {
            message = window.plugins.jPushPlugin.receiveMessage.message;
          } else {
            message = event.content;
          }
          $("#messageResult").html(message);
        } catch(exception) {
          console.log("JPushPlugin:onReceiveMessage-->" + exception);
        }
      }

      document.addEventListener("jpush.receiveMessage", onReceiveMessage, false);
    }

  }

})();
