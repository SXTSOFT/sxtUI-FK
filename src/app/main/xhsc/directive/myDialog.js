/**
 * Created by emma on 2016/6/7.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .directive('myDialog',myDialogDirective);

  /**@ngInject*/
  function myDialogDirective($state){
    return {
      //templateUrl:'app/main/xhsc/directive/mydialog.html',
      scope:{
        dialogShow:'='
      },
      template:'<div class="my-dialog-mask">\
      <div class="my-dialog"><div class="dialog-top">\
      <p>深圳市星河银河谷项目 》 1期 》 1栋 》1001，铝合金工序，是否报检？</p>\
    <md-button flex style="width:100%;" ng-click="submit()">报检</md-button>\
    </div><div class="dialog-bottom"><md-button flex style="width:100%;" ng-click="cancel()">取消</md-button></div></div></div>',
      link:link
    }
    function link(scope,element,attr,ctrl){
      $(element).appendTo('body');
      $('.my-dialog-mask').css('display','block');
      scope.cancel= function(){
        //$('.my-dialog-mask').css('display','none');
        scope.dialogShow = false;
      }
      scope.submit = function(){
        scope.dialogShow = false;
        $state.go('app.xhsc.gxtest');

      }
    }
  }
})();
