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
      template:'<div class="sxtnumdowndown" style="position:relative"><span ng-click="toggleView()" style="display: block;">&nbsp;{{value}}</span><div class="numberpanel"  style="position: absolute;left:-56px;top:20px;width:auto;z-index:10005;display:none;" ><sxt-num-input ng-model="value" ok="ok()"></sxt-num-input></div></div>'
    }

    function link(scope,element,attr,ctrl){
      //ng-show="isView"
      $('.numberpanel').css('display','none');
      console.log('a',$(element).find('.numberpanel').is(':hidden'))

      scope.toggleView = function(){
        //console.log('a',$(element).parent().siblings().find('.numberpanel').length)
        if($(element).parent().siblings().find('.numberpanel').length){
          $('.addPanel .numberpanel').css('display','none');
          $(element).parent().siblings().find('.numberpanel').css('display','none');
          $(element).parent().parent().siblings().find('.numberpanel').css('display','none');
        }else{
          $(element).parent().parent().siblings().find('.numberpanel').css('display','none');
          $('table .numberpanel').css('display','none');
        }
        if($(element).find('.numberpanel').is(':hidden')){
          $(element).find('.numberpanel').css('display','block');
          var width = $('.sxt-num-input').width()-$(element).parent().width();
          $(element).find('.numberpanel').css('left',-width/2+'px');
          //scope.isView = true;
        }else{
          $(element).find('.numberpanel').css('display','none');
          //$('.numberpanel').css('display','none');
        }
      }
      scope.ok = function(){
        //$(element).find('.numberpanel').css('display','none');
        $('.numberpanel').css('display','none');
      }
      var docClick = function(e){
        var target = $(e.target);
        if(target.closest(".sxtnumdowndown").length == 0){
          $(element).find('.numberpanel').css('display','none');
        }
      }
      $(document).bind("click",docClick);

      scope.$on('$destroy',function(){
        $(document).unbind("click",docClick);
      })
    }
  }


})();
