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
        floorData:'=sxtfloor'
      },
      link:link
    }

    function link(scope,element,attr,ctrl){

      //element.click(function(){
        //var floorData=[50,50,20,10,30];
        var floorData = scope.floorData;
        var str=[];
        var zIndex= 1,zWholeIndex=1;
        var iFloorHeight= 0,iWinHeight= 0,itemp=0;
        var zoom=0;
        //append数据
    //<md-list>
    //  <md-list-item class="md-3-line">
    //    <div class="md-list-item-text">
    //    <p></p>
    //    </div>
    //    </md-list-item>
    //    </md-list>
        if(!floorData){
          floorData=[50,50,20,10,30];
        }
        str.push('<div class="floor-layer"><div class="item" flex>\
          <a>\
          <div class="whole"><md-list class="whole-progress">');
        while(floorData[2]--){
          zIndex++;
          if(floorData[2]+floorData[3]+1 == floorData[4]){
            str.push('<md-list-item class="build-m-presell" style="z-index:'+(floorData[2]+floorData[3])+'"></md-list-item>');
          }else{
            str.push('<md-list-item class="build-m" style="z-index:'+(floorData[2]+floorData[3])+'"></md-list-item>');
          }

        }
        while(floorData[3]--){
          zIndex++;
          if(floorData[3]+1 == floorData[4]){
            str.push('<md-list-item class="wall-m-presell" style="z-index:'+(floorData[3])+'"></md-list-item>');
          }else{
            str.push('<md-list-item class="wall-m" style="z-index:'+(floorData[3])+'"></md-list-item>');
          }

        }
        str.push('<md-list-item class="build-b"></md-list-item></md-list><md-list class="whole-target">');
        floorData[1]=floorData[1]-1;
        str.push('<md-list-item class="wall-t" style="z-index:'+(floorData[1])+'"></md-list-item>');
        while((floorData[1]--)){
          zIndex++;
          if(floorData[1]+1 == floorData[4]){
            str.push('<md-list-item class="wall-m-presell" style="z-index:'+(floorData[1])+'"></md-list-item>');
          }else{
            str.push('<md-list-item class="wall-m" style="z-index:'+(floorData[1])+'"></md-list-item>');
          }

        }
        str.push('<md-list-item class="build-b"></md-list-item></md-list></div><p>100栋（100层）</p></a></div></div>');
        //var o = $(str.join('')).appendTo('#progress')
      var o = $(str.join('')).appendTo(element)
       // console.log($('.floor-layer').length);
        if($('.floor-layer').length<=4){
            //$('.floor-layer').css('width','25%');

        }

        zoom=0.18;
        itemp=(floorData[0]-1)*18+107+34;
        //根据手机大小来定zoom，最小为0.12
        iWinHeight = $(window).height()-220;
        var izoom = iWinHeight/2/itemp;
        if(izoom < 0.1){
          zoom = 0.12;
        }else{
          zoom = izoom;
        }

        //窗口缩放时自动调整相应参数
        $(window).resize(function(){
          if($(window).width()>960){
            zoom = 1;
            iFloorHeight = ((floorData[0]-1)*18+107+34)*zoom+80;
            $('.whole').css('zoom',zoom);
            $('.floor-layer').css('height',iFloorHeight+'px');
          }
          else if($(window).width() > 760){
            zoom = 0.5;
            iFloorHeight = ((floorData[0]-1)*18+107+34)*zoom+50;
            $('.whole').css('zoom',zoom);
            $('.floor-layer').css('height',iFloorHeight+'px');
          }else{
            zoom = izoom;
            $('.whole').css('zoom',zoom);
            iFloorHeight = ((floorData[0]-1)*18+107+34)*zoom+50;
            $('.floor-layer').css('height',iFloorHeight+'px');
          }
        })


        iFloorHeight = itemp*zoom+50;
        $('.whole').css('zoom',zoom);
        $('.floor-layer').css('height',iFloorHeight+'px');

      //放大缩小区域，暂不用
        //$('.item').on('mousewheel DOMMouseScroll', function (e) {
        //  var direct=0;
        //  var self=this;
        //
        //  e=e || window.event;
        // //console.log(obj)
        //  //var t1=document.getElementById("wheelDelta");
        //  //var t2=document.getElementById("detail");
        // // var d = e.wheelDelta||e.detail;
        //  var value = e.originalEvent.wheelDelta || -e.originalEvent.detail;
        //  var delta = Math.max(-1, Math.min(1, value));
        //  //console.log(delta < 0 ? 'down' : 'up');
        //  zoom += (delta<0 ?-10:10);
        // // console.log('zoom1',zoom)
        //  if(zoom<20) zoom=20;
        //  if(zoom>100) zoom=100;
        //  $(this).css('zoom',zoom+'%')
        //  //document.getElementById('click').style.zoom = zoom +'%';
        //  //e.style.zoom = zoom+'%';
        //  //console.log(zoom)
        //  e.preventDefault();
        //  return false;
        //});
     // })

    }
  }

})();
