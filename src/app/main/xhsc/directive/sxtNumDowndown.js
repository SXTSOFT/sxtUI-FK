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
      template:'<div class="sxtnumdowndown" style="position:relative"><span ng-click="toggleView()">&nbsp;{{value}}</span><div class="numberpanel"  style="position: absolute;left:-56px;bottom:-280px;width:auto;z-index:10005;" ><sxt-num-input ng-model="value" ok="ok()"></sxt-num-input></div></div>'
    }

    function link(scope,element,attr,ctrl){
      //ng-show="isView"
      console.log('b',scope)
      $('.numberpanel').css('display','none');
      scope.toggleView = function(){
        $(element).parent().siblings().find('.numberpanel').css('display','none');
        if($(element).find('.numberpanel').is(':hidden')){
          $(element).find('.numberpanel').css('display','block');
          var width = $('.sxt-num-input').width()-$(element).parent().width();
          $(element).find('.numberpanel').css('left',-width/2+'px');
        }else{
          $(element).find('.numberpanel').css('display','none');
        }
        //scope.isView = !scope.isView;
      }
      scope.ok = function(){
        $(element).find('.numberpanel').css('display','none');
        //scope.isView = false;
      }

      $(document).bind("click",function(e){
        var target = $(e.target);
        if(target.closest(".sxtnumdowndown").length == 0){
          $(element).find('.numberpanel').css('display','none');
        }

      })
        //$(document).not($('.sxtnumdowndown')).on('click',scope.ok);


      scope.$on('$destroy',function(){
        $(element).find('.numberpanel').css('display','none');
        //$(document.body).not(element).un('click',scope.ok);
      })
    }
  }


})();
