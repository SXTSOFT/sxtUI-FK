/**
 * Created by emma on 2016/7/27.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .directive('tableAutoHeight',tableAutoHeight);

  /**@ngInject*/
  function tableAutoHeight($timeout){
    return {
      link:link
    }

    function link(scope,element,attr,ctrl){
      var h;
      scope.$watch(function(){
        return h;
      },function(){
        $(element).css('height',h+12+'px');
        $(element).parent().siblings().find('table').css('height',h+12+'px');
      })
      $timeout(function(){
        h= $(element).parent().parent().parent('tbody').height();
        console.log('h',h)
      },400);


    }
  }
})();
