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
