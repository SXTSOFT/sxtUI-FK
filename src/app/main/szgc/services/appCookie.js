/**
 * Created by jiuyuong on 2016/3/15.
 */
(function(){
  'use strict';
  angular
    .module('app.szgc')
    .factory('appCookie',appCookie);
  /** @ngInject */
  function appCookie(){
    var $cookies = {
      c:{},
      put:function(name,value){
        this.c[name] = value;
      },
      remove:function(name){
        delete this.c[name];
      },
      get:function(name){
        return this.c[name];
      }
    };
    return $cookies;
  }
})();
