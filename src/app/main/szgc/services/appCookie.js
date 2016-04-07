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
    var storage = window.localStorage;
    var $cookies = {
      c:{},
      put:function(name,value){
        this.c[name] = value;
        storage && storage.setItem(name,value);
      },
      remove:function(name){
        delete this.c[name];
        storage && storage.removeItem(name);
      },
      get:function(name){
        var v = this.c[name];
        if(!v && storage)
          v=storage.getItem(name);
        return v;
      }
    };
    return $cookies;
  }
})();
