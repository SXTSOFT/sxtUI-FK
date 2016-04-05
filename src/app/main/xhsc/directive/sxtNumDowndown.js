/**
 * Created by jiuyuong on 2016/4/3.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .directive('sxtNumDowndown', sxtNumDowndown);

  /** @Inject */
  function sxtNumDowndown($timeout){
    return {
      scope:{
        value:'=ngModel'
      },
      link:link,
      template:'<div class="sxtnumdowndown" style="position:relative"><span ng-click="toggleView()">&nbsp;{{value}}</span><div ng-show="isView" style="position: absolute;left:-56px;bottom:-280px;width:auto;z-index:10005;" ><sxt-num-input ng-model="value" ok="ok()"></sxt-num-input></div></div>'
    }

    function link(scope,element,attr,ctrl){
      scope.toggleView = function(){
        scope.isView = !scope.isView;
      }
      scope.ok = function(){
        scope.isView = false;
      }
      //$(document.body).not(element).on('click',scope.ok);
      scope.$on('$destroy',function(){
        //$(document.body).not(element).un('click',scope.ok);
      })
    }
  }


})();
