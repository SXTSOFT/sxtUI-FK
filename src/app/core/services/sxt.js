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
  function sxtServe($q){
    var s = window.sxt||{},forEach = angular.forEach;
    s.invoke = invokeFn;
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
  }
})();
