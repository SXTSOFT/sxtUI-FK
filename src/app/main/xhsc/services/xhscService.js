/**
 * Created by leshuangshuang on 16/4/1.
 */
(function(){
  'use strict';
  angular
    .module('app.core')
    .factory('xhscService',xhscService);
  /** @ngInject */
  function xhscService(){
    return {
      //
      qualified:qualified
    };
   //单个测量点的
    function qualified(items){
       items.qualified>=80 && items.zdpc<items.yxpc;
       return items.qualified


    }
    //多个测量点的

  }
})();
