/**
 * Created by leshuangshuang on 16/8/1.
 */
(function(){
  'use strict';

  angular
    .module('JPushPlugin')
    .factory('JPushPlugin',JPushPlugin);
  /** @ngInject */
  function JPushPlugin($window){
    var JPushPlugin = $window.plugins.jPushPlugin;
    return JPushPlugin;
  }
})();
