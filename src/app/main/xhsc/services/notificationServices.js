/**
 * Created by leshuangshuang on 16/6/24.
 */
(function(){
  'use strict';
  angular
    .module('app.xhsc')
    .factory('notification',notification);
  /** @ngInject */
  function notification(JPushPlugin){

    return{
      receiveMessage:receiveMessage
    }
    //获取自定义消息推送内容
    function receiveMessage(){
    }

  }

})();
