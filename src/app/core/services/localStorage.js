/**
 * Created by shaoshunliu on 2016/11/20.
 */
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
    .factory('sxtlocaStorage',sxtlocaStorage);
  /** @ngInject */
  function sxtlocaStorage($q,$window){
    return {
      getItem:function (name) {
        return window.localStorage.getItem(name);
      },
      setItem:function (name,val) {
        window.localStorage.removeItem(name);
        window.localStorage.setItem(name,val);
      },
      removeItem:function (name) {
        window.localStorage.removeItem(name);
      },
      setObj:function (name,obj) {
        window.localStorage.removeItem(name);
        if(angular.isObject(obj)){
          window.localStorage.setItem(name,JSON.stringify(obj));
        }else {
          window.localStorage.setItem(name,null);
        }
      },
      getObj:function (name) {
        var val=window.localStorage.getItem(name);
        if (val){
          try {
            return JSON.parse(val);
          }catch(ex){
            return null;
          }
        }
        return null;
      },
      clear:function () {
        window.localStorage.clear();
      }
    }
  }
})();
