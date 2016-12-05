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
      getArr:function (name) {
        var arr=this.getObj(name);
        if (!angular.isArray(arr)){
          arr=[];
        }
        return arr;
      },
      setArr:function (name,arr,compare) {
        var old=this.getArr(name);
        if (!angular.isArray(arr)){
          arr=[arr];
        }
        if (!compare){
          compare=function (item) {
              return true;
          }
        }
        arr.forEach(function (o) {
           if (old.some(function (t) {
                 return compare(t);
             })){
             old.push(o);
           }
        });
        this.setObj(name,old);
      },
      setArr2:function (name,arr,compare) {
        var old=this.getArr(name);
        if (!angular.isArray(arr)){
          arr=[arr];
        }
        if (!compare){
          compare=function (_old,_new) {
            return _new;
          }
        }
        arr=compare(old,arr);
        arr.forEach(function (o) {
          old.push(o);
        });
        this.setObj(name,old);
      },
      removeArrItem:function (db,filter) {
        var arr=this.getArr(db);
        var t=[];
        if (!filter){
          filter=function (item) {
            return true;
          }
        }
        arr.forEach(function (o) {
          if (!filter(o)){
            t.push(o);
          }
        });
        this.setObj(db,t);
      },
      removeArrItem2:function (db,filter) {
        var arr=this.getArr(db);
        if (!filter){
          filter=function (source) {
            return source;
          }
        }
        arr=filter(arr);
        this.setObj(db,arr);
      },
      clear:function () {
        window.localStorage.clear();
      }
    }
  }
})();
