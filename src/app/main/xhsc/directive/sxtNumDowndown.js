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
        value:'=ngModel',
        ct:'=',
        onChange:'&',
        onToggle:'&'
      },
      link:link,
      template:'<div class="sxtnumdowndown" style="position:relative"><span fast-click="toggleView()" style="display: block;">&nbsp;{{value}}</span><div class="numberpanel nmmPanel"><sxt-num-input ng-model="value"  ok="ok()"></sxt-num-input></div></div>'
    }

    function link(scope,element,attr,ctrl){
      scope.$watch('value',function () {
        if(scope.isToggleView){
          scope.value = scope.oValue;
          scope.isToggleView =false;
        }
        else {
          scope.onChange && scope.onChange();
        }
      });
      //ng-show="isView"
     $('.numberpanel',element).css('display','none');
      if(typeof(scope.ct)=="object") {
        scope.ct.show = function () {
          var mpanel = $(document).find('.numberpanel').eq(0);
          mpanel.css({
            'display': 'block',
            'left':$('.sxtnumdowndown',element).width()+'px',
            'top':'0px'
          });
        };
      };
      scope.toggleView = function(){
        scope.isToggleView = true;
        scope.oValue =  angular.copy(scope.value);
        $timeout(function () {
          scope.isToggleView =false;
        },300);
        scope.onToggle && scope.onToggle();
        if($(element).find('.numberpanel').is(':hidden')){
          $('.numberpanel').css('display','none');
          var mpanel = $(element).find('.numberpanel');
          mpanel.css({
            'display': 'block',
            'left':$('.sxtnumdowndown',element).width()+'px',
            'top':'0px'
          });
        }else{
          $(element).find('.numberpanel').css('display','none');
        }
      }
      scope.ok = function(){
        $('.numberpanel').css('display','none');
      }
      var docClick = function(e){
        var target = $(e.target);
        if(target.closest(".sxtnumdowndown").length == 0){
          $('.numberpanel').css('display','none');
        }
      }
      $(document).bind("click",docClick);
      scope.$on('$destroy',function(){
        $('.numberpanel',element).css('display','none');
        $(document).unbind("click",docClick);
      })
    }
  }


})();
