/**
 * Created by jiuyuong on 2016/1/22.
 */
/**
 * Created by jiuyuong on 2016/1/22.
 */
(function(){
  'use strict';
  angular
    .module('app.core')
    .factory('sxt',sxtServe);
  /** @ngInject */
  function sxtServe($q,$window){
    var s = window.sxt||{},forEach = angular.forEach;
    s.invoke = invokeFn;
    s.uuid = uuidfn;
    s.plugin = {
      playYs7:playYs7
    };
    return s;

    function invokeFn(array,name, config){
      var chain = [];
      var promise = $q.when (config);
      forEach (array, function (interceptor) {
        if (interceptor[name]) {
          chain.unshift(interceptor[name]);
        }
      });

      while (chain.length) {
        var thenFn = chain.shift ();
        promise = promise.then(thenFn);
      }
      return promise;
    }

    function uuidfn(){
      var d = new Date().getTime();
      if(window.performance && typeof window.performance.now === "function"){
        d += performance.now();
      }
      var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
      });
      return uuid;
    }

    function playYs7(options) {
      var q = $q.defer();
      $window.cordova.plugins.sxt.playYs7(
        function (result) {
          q.resolve(result);
        }, function (result) {
          q.reject(result);
        },options);
      return q.promise;
    }
  }
})();
