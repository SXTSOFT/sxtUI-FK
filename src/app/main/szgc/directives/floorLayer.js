/**
 * Created by emma on 2016/2/19.
 */

(function() {
  'use strict';

  angular
    .module('app.szgc')
    .directive('floorLayer', floorLayerDirective);

  /** @ngInject */
  function floorLayerDirective($timeout){
    return {
      restrict:'EA',
      scope:{
        floorData:'=sxtfloor',
        floorNum: '=',
        sellLine:'='
      },
      link:link
    }

    function link(scope,element,attr,ctrl){

      //element.click(function(){
        //var floorData=[50,50,20,10,30];
      var sellLine = parseInt(scope.sellLine * scope.floorData.floors), gx1 = scope.floorData.gx1, gx2 = scope.floorData.gx2;
      if (gx1 > scope.floorData.floors) gx1 = scope.floorData.floors;
      if (gx2 > scope.floorData.floors) gx2 = scope.floorData.floors;
        var str=[];
        var iFloorHeight= 0,itemp,iWinHeight;
        var zoom=0;

        str.push('<div class="floor-layer"><div class="item" flex>\
          <a>\
          <div class="whole"><ul class="whole-progress">');
      for (var i = Math.max(gx1, gx2) ; i >= 0; i--) {
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
        str.push('<li class="build-b"></li></ul></div><p>'+scope.floorData.name+'('+scope.floorData.floors+'层)</p></a><div>'+scope.floorData.summary+'</div></div></div>');
      var o = $(str.join('')).appendTo(element)

      zoom=0.18;
      itemp=(scope.floorNum-1)*18+107+34;
        //根据手机大小来定zoom，最小为0.12
      iWinHeight = $(window).height()-220;
      var izoom = iWinHeight/2/itemp;
      if(izoom < 0.1){
        zoom = 0.12;
      }else{
        zoom = izoom;
      }
      if(zoom>1)
        zoom=1;

        //窗口缩放时自动调整相应参数
        $(window).resize(function(){
          if($(window).width()>960){
            zoom = 1;
            iFloorHeight = ((scope.floorNum-1)*18+107+34)*zoom+80;
            $('.whole').css('zoom',zoom);
            $('.floor-layer').css('height',iFloorHeight+'px');
          }
          else if($(window).width() > 760){
            zoom = 0.5;
            iFloorHeight = ((scope.floorNum-1)*18+107+34)*zoom+50;
            $('.whole').css('zoom',zoom);
            $('.floor-layer').css('height',iFloorHeight+'px');
          }else{
            zoom = izoom;
            $('.whole').css('zoom',zoom);
            iFloorHeight = ((scope.floorNum-1)*18+107+34)*zoom+50;
            $('.floor-layer').css('height',iFloorHeight+'px');
          }
        })


        iFloorHeight = itemp*zoom+50;
        $('.whole',element).css('zoom',zoom);
        $('.floor-layer').css('height',iFloorHeight+'px');

        scope.$on('$destroy',function(){
          o.remove();
          $(element).remove();
        });

    }
  }

})();
