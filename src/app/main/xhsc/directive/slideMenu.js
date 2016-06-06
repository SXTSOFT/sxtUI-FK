/**
 * Created by emma on 2016/6/4.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .directive('slideMenu',slideMenuDirective);

  /**@ngInject*/
  function slideMenuDirective(){
    return {
      scope:{
        slideData:'=',
        showCheck:'=',
        halfHeight:'='
      },
      templateUrl:'app/main/xhsc/ys/slideMenu.html',
      link:link
    }

    function link(scope,element,attr,ctrl){
      scope.selectProcedure = function(item){
        scope.gxlevels = null;
        scope.slideData.forEach(function(t){
          t.children.forEach(function(_t){
            _t.checked = false;
          })
        })
        item.checked = true;
        scope.gxlevels = item.procedureCh;
      }
      scope.selectProcedure(scope.slideData[0].children[0])
    }
  }
})();
