/**
 * Created by emma on 2016/6/20.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .directive('windowHeight',windowHeight);
  /**@ngInject*/
  function windowHeight(){
    return {
      link:link
    }

    function link(scope,element,attr,ctrl){
      var winh= $(window).height();
      var iToolbar = 44;
      var itbar = 44;
      var resize = function(){
        //var winh= $(window).height();
        //var iToolbar = $('#toptoolbar').height();
        //var itbar = $('#toolbar2').height();
        console.log(iToolbar,itbar)
        $(element).css({'height':(winh-iToolbar-itbar-6)+'px','overflow':'hidden'})
      }
      resize();
      $(window).resize(function(){
        resize();
      })
    }
  }
})();
