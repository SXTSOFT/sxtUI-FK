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
        ct:'='
      },
      link:link,
      template:'<div class="sxtnumdowndown" style="position:relative"><span ng-click="toggleView()" style="display: block;">&nbsp;{{value}}</span><div class="numberpanel"  style="position: absolute;left:-56px;top:30px;width:auto;z-index:10005;" ><sxt-num-input ng-model="value" ok="ok()"></sxt-num-input></div></div>'
    }

    function link(scope,element,attr,ctrl){
      //ng-show="isView"
     $('.numberpanel').css('display','none');
      if(scope.ct) {
        scope.ct.show = function () {
         // console.log('a',$(element).parent().parent().parent().hasClass('nostamp'))
          if ($(element).parent().parent().hasClass('addPanel')) {
            if($(element).parent().parent().parent().hasClass('stamp')){
              $(element).find('.numberpanel').css('display', 'block');
              for(var i=0;i<$(element).parent().parent().parent().find('.addPanel').length;i++){
                $(element).parent().parent().parent().find('.addPanel').eq(i).find('.numberpanel').css('display', 'none');

              }
              $(element).parent().parent().parent().find('.addPanel').eq(0).find('.numberpanel').css('display', 'block');

            }else{
               $(element).parent().parent().eq(0).find('.numberpanel').css('display', 'block');
               $(element).find('.numberpanel').css('display', 'block');
            }

          } else if ($(element).parent().hasClass('addPanel')) {
            $(element).parent().eq(0).find('.numberpanel').css('display', 'block');
          } else {
            $('.numberpanel').css('display', 'block');
          }
        };
      };
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
          //$(element).find('.numberpanel').css('display','none');
          $('.numberpanel').css('display','none');
        }
      }
      $(document).bind("click",docClick);

      scope.$on('$destroy',function(){
        $(document).unbind("click",docClick);
      })
    }
  }


})();
