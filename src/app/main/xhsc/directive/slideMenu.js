/**
 * Created by emma on 2016/6/4.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .directive('slideMenu',slideMenuDirective);

  /**@ngInject*/
  function slideMenuDirective($state){
    return {
      scope:{
        slideData:'=',
        showCheck:'=',
        halfHeight:'=',
        level:'=',
        projectId:'=',
        areaId:'=',
        current:'='
      },
      templateUrl:'app/main/xhsc/directive/slideMenu.html',
      link:link
    }

    function link(scope,element,attr,ctrl){
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
        console.log('data',scope.areaId)
        if(scope.slideData[0].SpecialtyChildren.length)
        scope.selectProcedure(scope.slideData[0].SpecialtyChildren[0]);
      })

      scope.changeOrclick = function(item){
        if(item.checked){
          scope.current = null;
        }
        else{
          scope.gxlevels.forEach(function (it) {
            if(item!==it)
              it.checked = false;
          });
          scope.current = item;
        }

      }
      scope.goToLink = function (item) {
        if(!scope.showCheck){
          $state.go('app.xhsc.gx.gxhousechoose',{acceptanceItemID:item.AcceptanceItemID,projectId:scope.projectId,acceptanceItemName:item.AcceptanceItemName,areaId:scope.areaId})
        }else{
          //item.checked = !item.checked;
        }
      }
    }
  }
})();
