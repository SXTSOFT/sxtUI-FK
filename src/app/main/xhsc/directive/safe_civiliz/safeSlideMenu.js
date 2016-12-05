/**
 * Created by lss on 2016/10/24.
 */
/**
 * Created by emma on 2016/6/4.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .directive('safeSlideMenu',safeSlideMenu);

  /**@ngInject*/
  function safeSlideMenu($state){
    return {
      scope:{
        slideData:'=',
        showCheck:'=',
        current:'='
      },
      templateUrl:'app/main/xhsc/directive/safe_civiliz/safeSlideMenu.html',
      link:link
    }

    function link(scope,element,attr,ctrl){
      scope.info = {

      };
      scope.selectProcedure = function(item){
        scope.gxlevels = null;
        scope.slideData.forEach(function(t){
          t.SpecialtyChildren.forEach(function(_t){
            _t.checked = false;
          })
        })
        item.checked = true;
        scope.gxlevels = item.WPAcceptanceList;
      }
      scope.$watch('slideData',function(){
        if(!scope.slideData) return;
        if(!scope.slideData.length) return;
        if(scope.slideData[0].SpecialtyChildren.length)
          scope.selectProcedure(scope.slideData[0].SpecialtyChildren[0]);
      })

      scope.$watch('info.current',function () {
        scope.current = scope.info.current;
      });
      scope.$watch('current',function () {
        scope.info.current = scope.current;
      });
    }
  }
})();
