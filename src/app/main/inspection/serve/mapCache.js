/**
 * Created by shaoshun on 2017/1/22.
 */
/**
 * Created by shaoshun on 2017/1/19.
 */
/**
 * Created by leshuangshuang on 16/4/15.
 */
(function() {
  'use strict';

  angular
    .module('app.inspection')
    .factory('mapCache', mapCache);

  function mapCache() {
    var cache={};
    var  cacheServe={
      get:function (key) {
        return cache[key];
      },
      set:function (key,val) {
        cache[key]=val;
      }
    }
    return cacheServe
  }
})();
