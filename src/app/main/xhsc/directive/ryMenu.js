/**
 * Created by emma on 2016/6/12.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .directive('ryMenu',ryMenuDirective);

  /**@ngInject*/
  function ryMenuDirective(){
    return {
      scope:{
        ryData:'='
      },
      templateUrl:'app/main/xhsc/directive/rymenu.html',
      link:link
    }

    function link(scope,element,attr,ctrl){
      //var resize = function(){
      //  var iHeight = $(element).parent().height();
      //  var iWh= $(window).height();
      //  var iToolbar = $('#toptoolbar').height();
      //  var itbar = $('#toolbar2').height();
      //  if(scope.halfHeight){
      //    $('.list-left',element).css({'height':(iHeight)+'px','overflow':'auto'});
      //    $('.list-right',element).css({'height':(iHeight)+'px','overflow':'auto'})
      //  }else{
      //    $('.list-left',element).css({'height':(iWh-iToolbar-itbar-6)+'px','overflow':'auto'});
      //    $('.list-right',element).css({'height':(iWh-iToolbar-itbar-6)+'px','overflow':'auto'})
      //  }
      //}
      //resize();
      //$(window).resize(function(){
      //  resize();
      //})

      console.log(scope.ryData)
    }
  }
})();
