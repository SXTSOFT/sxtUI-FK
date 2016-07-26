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
        current:'=',
        isSC:'=', //是否为实测项
        role:'=',
        assessmentId:'='
      },
      templateUrl:'app/main/xhsc/directive/slideMenu.html',
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
        console.log('scope.gxlevels',scope.gxlevels)
      }
      scope.$watch('slideData',function(){
        if(!scope.slideData) return;
        console.log('data',scope.slideData)
        if(!scope.slideData.length) return;
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
      scope.$watch('info.current',function () {
        scope.current = scope.info.current;
      });
      scope.$watch('current',function () {
        scope.info.current = scope.current;
       // console.log('current',scope.current)
      });
      scope.goToLink = function (item) {
        if(!scope.showCheck){
          if (scope.isSC){
            var tmp= {assessmentID:scope.assessmentId,role:scope.role,acceptanceItemID:item.AcceptanceItemID , projectId: scope.projectId, acceptanceItemName:item.AcceptanceItemName, maxRegion: item.maxRegion}
            $state.go('app.xhsc.scsl.scRegion',tmp);
          }else if (scope.role){
            $state.go('app.xhsc.gx.gxhousechoose',{role:scope.role,acceptanceItemID:item.AcceptanceItemID,projectId:scope.projectId,acceptanceItemName:item.AcceptanceItemName,areaId:scope.areaId,maxRegion:item.maxRegion})
          }else {
            $state.go('app.xhsc.gx.zjhouseChoose',{acceptanceItemID:item.AcceptanceItemID,projectId:scope.projectId,acceptanceItemName:item.AcceptanceItemName,areaId:scope.areaId,maxRegion:item.maxRegion})
          }
        }else{
        }
      }
    }
  }
})();
