/**
 * Created by emma on 2016/9/30.
 */
(function(){
  'use strict';

  angular
    .module('app.plan')
    .directive('scrollTop',scrollTop);

  /**@ngInject*/
  function scrollTop($timeout){
    return {
      scope:{
        scrollTop:'='
      },
      link:link
    }

    function link(scope,element,attr,ctrl){
      scope.$watch('scrollTop',function(){
        $timeout(function(){
          $('#content').animate({scrollTop: '0'});
        },500)

      })
    }
  }
})();
