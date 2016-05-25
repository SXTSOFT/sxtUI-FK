/**
 * Created by emma on 2016/5/24.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .directive('sxtNumber',sxtNumber);

  /** @ngInject*/
  function sxtNumber(){
    return{
      scope:{
        user:'=ngModel'
      },
      link:link,
      template:'<span ng-click="toggleView($event)" style="display: block;"><input style="border:none;background: transparent;text-align: center;width:50px;" ng-model="user"></span><div class="numberpanel"  style="display: none;" ><sxt-num-input ng-model="user"></sxt-num-input></div>'
    }

    function link(scope,ele,attr,ctl){
     // console.log('b',scope)
      scope.$watch('value',function () {

      });
      scope.toggleView = function(e){
        console.log('e',$(e.target).position())
        $('.ybxm').animate({scrollTop:$(e.target).position().top-100});
        $('.ybxm').css('padding-bottom','250px');
        //$(ele).find('input').focus();
        if($('.numberpanel').is(':hidden')){
          $('.numberpanel').css({'position':'fixed','bottom':0,'left':0,width:'100%','height':'250px','display':'block'})
        }

      }

    }
  }
})();
