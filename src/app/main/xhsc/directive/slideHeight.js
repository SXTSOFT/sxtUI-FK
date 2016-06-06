/**
 * Created by emma on 2016/6/4.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .directive('slideHeight',slideHeightDirective);

  /**@ngInject*/
  function slideHeightDirective(){
    return {
      link:link
    }

    function link(scope,element,attr,ctrl){
      console.log('el',$(element).parent().parent().parent().parent().height())
      var setHeight = function(){
        var iHeight=$(window).height();
        var iToolbar = $('#toptoolbar').height();
        var itbar = $('#toolbar2').height();
        $(element).css({'height':(iHeight-iToolbar-itbar-6)+'px','overflow':'auto'})
      }
      $(window).resize(function(){
        setHeight();
      })
      setHeight();
      //var iHeight=$(window).height();
      //var iToolbar = $('#toptoolbar').height();
      //var itbar = $('#toolbar2').height();
      //$(element).css({'height':(iHeight-iToolbar-itbar-6)+'px','overflow':'auto'})
      //console.log(iHeight)
    }
  }
})();
