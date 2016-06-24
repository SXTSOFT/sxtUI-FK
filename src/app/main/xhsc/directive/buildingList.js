/**
 * Created by emma on 2016/6/24.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .directive('buildingList',buildingListDirective);

  /**@ngInject*/
  function buildingListDirective(api){
    return {
      scope:{
        data:'=sxtfloor',
        floorNum:'=floorNum'
      },
      link:link
    }

    function link(scope,element,attr,ctrl){
      scope.$watch('data',function(){
        if(!scope.data) return;
        //console.log('floorNum',scope.floorNum)
        var sellLine = scope.data.sellLine, gx1 = scope.data.gx1, gx2 = scope.data.gx2;
        if (gx1 > scope.data.floors) gx1 = scope.data.floors;
        if (gx2 > scope.data.floors) gx2 = scope.data.floors;
        var str=[];
        var iFloorHeight= 0,itemp,iWinHeight;
        var zoom=0;

        str.push('<div class="floor-layer"><div class="item" flex>\
          <a>\
          <div class="whole"><ul class="whole-progress">');
        for (var i = Math.max(gx1, gx2) ; i >= 1; i--) {
          if (i == sellLine) {
            str.push('<li class="build-m-presell" style="z-index:' + i + '"></li>')
          }
          else {
            if (gx2 >= i) {
              str.push('<li class="wall-m" style="z-index:' + i + '"></li>')
            }
            else {
              str.push('<li class="build-m" style="z-index:' + i + '"></li>')
            }
          }
        }

        str.push('<li class="build-b"></li></ul><ul class="whole-target">');
        str.push('<li class="wall-t" style="z-index:'+scope.data.floors+'"></li>');
        var totalFloors = scope.data.floors;
        while((totalFloors--)){
          if(totalFloors == sellLine){
            str.push('<li class="wall-m-presell" style="z-index:'+totalFloors+'"></li>');
          }else{
            str.push('<li class="wall-m" style="z-index:'+totalFloors+'"></li>');
          }

        }
        str.push('<li class="build-b"></li></ul></div><p>'+scope.data.name+'('+Math.max(gx1, gx2)+'/'+scope.data.floors+'层)<br/>&nbsp;'+scope.data.summary+'</p></a></div></div>');
        var o = $(str.join('')).appendTo(element);
        var iWinWidth = $(window).width();

        //itemp=(scope.floorNum)*18+107+34+50;
        itemp=(scope.floorNum)*17+143+50;

        iWinHeight = $(window).height()-130;
        var newobj={},iflayerWidth=0;
        //console.log(api)
        newobj = api.xhsc.Assessment.sxtHouseService.getZ(iWinWidth,iWinHeight,scope.data.length,500,itemp);
        //zoom = newobj.z;
        zoom = iWinHeight/newobj.y/itemp;
        iflayerWidth = (1/newobj.x)*iWinWidth;
        $('#floorlayer').css('width',100+'%');
        iFloorHeight = itemp*zoom;
        //console.log('heights',itemp,iFloorHeight,iWinHeight,newobj.z,zoom)
        $('.floor-layer').css({'height':iFloorHeight+'px','width':iflayerWidth+'px'});
        var iFh=(iFloorHeight-50)/itemp;
        $('.whole',element).css({'zoom':iFh});
        scope.$on('$destroy',function(){
          o.remove();
          $(element).remove();
        });
      })
    }
  }
})();
