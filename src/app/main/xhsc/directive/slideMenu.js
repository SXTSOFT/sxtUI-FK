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
        areaId:'='
      },
      templateUrl:'app/main/xhsc/directive/slideMenu.html',
      link:link
    }

    function link(scope,element,attr,ctrl){
      var resize = function(){
        var iHeight = $(element).parent().height();
        var iWh= $(window).height();
        var iToolbar = $('#toptoolbar').height();
        var itbar = $('#toolbar2').height();
        if(scope.halfHeight){
          $('.list-left',element).css({'height':(iHeight)+'px','overflow':'auto'});
          $('.list-right',element).css({'height':(iHeight)+'px','overflow':'auto'})
        }else{
          $('.list-left',element).css({'height':(iWh-iToolbar-itbar-6)+'px','overflow':'auto'});
          $('.list-right',element).css({'height':(iWh-iToolbar-itbar-6)+'px','overflow':'auto'})
        }
      }
      resize();
      $(window).resize(function(){
        resize();
      })
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
        console.log(item)
        if(!scope.showCheck){
          $state.go('app.xhsc.gxmain.gxhousechoose',{acceptanceItemID:item.AcceptanceItemID,projectId:scope.projectId,acceptanceItemName:item.AcceptanceItemName,areaId:scope.areaId})
        }else{
          item.checked = !item.checked;
        }
      }
    }
  }
})();
