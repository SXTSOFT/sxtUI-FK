/**
 * Created by emma on 2016/4/23.
 */
(function(){
  'use strict';
  angular
    .module('app.szgc')
    .directive('sxtFixedRight',sxtFixedRight);
  /** @ngInject */
  function sxtFixedRight(){
    return {
      scope:{
        value:'=sxtFixedRight'
      },
      link:function(scope,element){
        var w = $(window).width(),w1=element.width();
        element.css({
          position:'absolute',
          zIndex:'19',
          left: w-scope.value-20
        })
        var p = $(element.parents('.md-virtual-repeat-scroller')[0]);
        element.parent().css({
          position:'relative'
        })
        p.on('scroll',function(){
          element.css({
            left: p.scrollLeft()+w-scope.value-20
          });
        });
      }
    }
  }
})();
