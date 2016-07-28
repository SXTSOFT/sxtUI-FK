/**
 * Created by zhangzhaoyong on 16/1/29.
 */
(function(){
  'use strict';

  angular
    .module('app.core')
    .factory('utils', utilsFactory);


  /** @ngInject */
  function  utilsFactory($mdToast,$mdDialog,$window){

    var storage = $window.localStorage;
    return {
      id:'52327c423debf68027000006',
      math: {

        //+
        sum:function(){
          var t=0,arg = arguments,p;
          for(var i=0;i<arg.length;i++){
            p = parseFloat(arg[i]);
            if (!isNaN(p))
              t = accAdd(t, p);
          }
          return t;
        },
        //"/"
        div: function (a, b) {
          return accDiv(a, b);
        },
        //*
        mul: function (a, b) {
          return accMul(a, b);
        },
        //-
        sub: function (a, b) {
          return accSub(a, b);
        }
      },
      tips:tipsMessage,
      alert:alertMessage,
      confirm:confirmMessage,
      error:errorMessage,
      copy:copyFn,
      cookies:{
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
      }
    };

    function accSub(arg2, arg1) {
      var r1, r2, m, n;
      try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
      try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
      m = Math.pow(10, Math.max(r1, r2));
      n = (r1 >= r2) ? r1 : r2;
      return parseFloat(((arg2 * m - arg1 * m) / m).toFixed(n));
    }
    function accAdd(arg2, arg1) {
      var r1, r2, m;
      try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
      try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
      m = Math.pow(10, Math.max(r1, r2));
      return parseFloat((arg1 * m + arg2 * m) / m);
    }
    function accMul(arg2, arg1) {
      var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
      try { m += s1.split(".")[1].length } catch (e) { }
      try { m += s2.split(".")[1].length } catch (e) { }
      return parseFloat(Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m));
    }
    function accDiv(arg1, arg2) {
      var t1 = 0, t2 = 0, r1, r2;
      try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
      try { t2 = arg2.toString().split(".")[1].length } catch (e) { }
      //with (Math) {

      r1 = Number(arg1.toString().replace(".", ""));
      r2 = Number(arg2.toString().replace(".", ""));
      return parseFloat((r1 / r2) * Math.pow(10, t2 - t1));
      //}
    }

    function tipsMessage(message){
      return $mdToast.show(
        $mdToast
          .simple()
          .textContent(message)
          .position({
            bottom:false,
            top:true,
            right:true
          })
          .hideDelay(3000)
      );
    }

    function alertMessage(message,ev,fn){
      return $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('body')))
          .clickOutsideToClose(true)
          .title('温馨提示')
          .textContent(message)
          .ariaLabel('温馨提示')
          .ok('确定')
          .targetEvent(ev)
      ).then(function(){
        fn && fn();
      })
    }

    function confirmMessage(message,ev,ok,cancel){
      return $mdDialog.show(
        $mdDialog.confirm()
          .title('需要您的确认')
          .textContent(message)
          .ariaLabel('需要您的确认')
          .targetEvent(ev)
          .ok(ok || '确定')
          .cancel(cancel || '取消')
      );
    }

    function copyFn(a,b,c,d){
      return angular.copy(a,b,c,d)
    }

    function errorMessage(message,errorData){
      return $mdToast.show(
        $mdToast
          .simple()
          .textContent(message+(errorData?errorData:''))
          .position({
            bottom:false,
            top:true,
            right:true
          })
          .hideDelay(3000)
      );
    }
  }
})();
