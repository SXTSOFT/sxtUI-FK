/**
 * Created by emma on 2016/7/1.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .directive('slideTopView',slideTopView);

  /**@ngInject*/
  function slideTopView(){
    return {
      scope:{
        slideShow:'='
      },
      templateUrl:'app/main/xhsc/directive/slideTopView.html',
      link:link
    }
    function link(scope,element,attr,ctrl){

    }
  }
})();
