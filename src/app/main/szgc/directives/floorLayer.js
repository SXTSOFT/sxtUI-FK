/**
 * Created by emma on 2016/2/19.
 */

(function() {
  'use strict';

  angular
    .module('app.szgc')
    .directive('floorLayer', floorLayerDirective);

  /** @ngInject */
  function floorLayerDirective($timeout,api){
    return {
      restrict:'EA',
      scope:{
        floorData:'=sxtfloor',
        floorNum: '=',
        sellLine:'=',
        buildLen:'='
      },
      link:link
    }

    function link(scope,element,attr,ctrl){

      //element.click(function(){
        //var floorData=[50,50,20,10,30];
      scope.$watch('floorNum',function(){
        if(!scope.floorNum) return;
      //console.log('floorNum',scope.floorNum)
      var sellLine = parseInt(scope.sellLine * scope.floorData.floors), gx1 = scope.floorData.gx1, gx2 = scope.floorData.gx2;
      if (gx1 > scope.floorData.floors) gx1 = scope.floorData.floors;
      if (gx2 > scope.floorData.floors) gx2 = scope.floorData.floors;
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
        str.push('<li class="wall-t" style="z-index:'+scope.floorData.floors+'"></li>');
      var totalFloors = scope.floorData.floors;
        while((totalFloors--)){
          if(totalFloors == sellLine){
            str.push('<li class="wall-m-presell" style="z-index:'+totalFloors+'"></li>');
          }else{
            str.push('<li class="wall-m" style="z-index:'+totalFloors+'"></li>');
          }

        }
        str.push('<li class="build-b"></li></ul></div><p>'+scope.floorData.name+'('+scope.floorData.floors+'层)<br/>&nbsp;'+scope.floorData.summary+'</p></a></div></div>');
      var o = $(str.join('')).appendTo(element);
      var iWinWidth = $(window).width();

      //itemp=(scope.floorNum)*18+107+34+50;
       itemp=(scope.floorNum)*17+143+50;

      iWinHeight = $(window).height()-130;
      var newobj={},iflayerWidth=0;
      newobj = api.szgc.sxtHouseService.getZ(iWinWidth,iWinHeight,scope.buildLen,200,itemp);
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

