/**
 * Created by emma on 2016/6/24.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .directive('buildingDetail',buildingDetailDirective);

  /**@ngInject*/
  function buildingDetailDirective(api){
    return {
      scope:{
        data:'=buildData',
        bdetailData:'='
      },
      link:link
    }

    function link(scope,element,attr,ctrl){
      scope.$watch('data',function(){
        if(!scope.data) return;
        console.log('floorNum',scope.data)
        var sellFloor = scope.data.sellLine, gx1 = scope.data.gx1, gx2 = scope.data.gx2,sellLine;
        if (gx1 > scope.data.floors) gx1 = scope.data.floors;
        if (gx2 && gx2 > scope.data.floors){
          gx2 = scope.data.floors
        }else{
          gx2 = 0;
        }
        if(sellFloor < 1 ){
          sellLine = parseInt(scope.data.floors * sellFloor);
        }else{
          sellLine = sellFloor;
        }
        var str=[];
        var iFloorHeight= 0,itemp,iWinHeight;
        var zoom=0;
        str.push('<div class="floor-layer1"><div class="item" flex>\
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

        str.push('<li class="wall-t" style="z-index:' + scope.data.floors + '"></li>');
        var totalFloors = scope.data.floors;
        while (totalFloors--) {
          if (totalFloors == sellLine) {
            str.push('<li class="wall-m-presell" style="z-index:' + totalFloors + '"></li>');
          } else {
            str.push('<li class="wall-m" style="z-index:' + totalFloors + '"></li>');
          }
        }
        str.push('<li class="build-b"></li></ul><div style="position:relative;bottom:0;left:175px;z-index:100;min-width:200%;" class="newlayer">');
        var temparr = [];
        var temparr2 = [];
        angular.forEach(scope.bdetailData[0].datapoints, function (v, k) {
          var find = temparr.find(function (v1) { return v1.y == v.y });
          if (!find) {
            find = {
              y: v.y,
              x: v.x
            };
            temparr.push(find)
          }
          else {
            find.x += ';' + v.x;
          }
        })
        angular.forEach(temparr, function (v, k) {
          if(!v.y)return;
          var iBottom = v.y * 18 + 60;
          str.push('<div style="height:18px;position:absolute;bottom:' + iBottom + 'px;"><span style="height:4px;width:30px;background:#f00;display:block;float:left;margin-top:6px;"></span><span style="display:block;margin-left:35px;border:1px solid #ddd;background:#fff;text-align:left;padding:3px;">' +v.y+'层'+ v.x + '<span><span style="clear:both;"></span></div>');
        })

        str.push('<div style="height:55px;"></div></div></div><p>' + scope.data.name + '('+ Math.max(gx1, gx2) +'/' + scope.data.floors + '层)<br/>&nbsp;' + scope.data.summary +'</p></a></div></div>');

        //str.push('<div class="floor-layer1"><div class="item" flex>\
        //  <a>\
        //  <div class="whole"><ul class="whole-progress">');
        //for (var i = Math.max(gx1, gx2) ; i >= 1; i--) {
        //  if (i == sellLine) {
        //    str.push('<li class="build-m-presell" style="z-index:' + i + '"></li>')
        //  }
        //  else {
        //    if (gx2 >= i) {
        //      str.push('<li class="wall-m" style="z-index:' + i + '"></li>')
        //    }
        //    else {
        //      str.push('<li class="build-m" style="z-index:' + i + '"></li>')
        //    }
        //  }
        //}
        //str.push('<li class="build-b"></li></ul><ul class="whole-target">');
        //str.push('<li class="wall-t" style="z-index:'+scope.data.floors+'"></li>');
        //var totalFloors = scope.data.floors;
        //while((totalFloors--)){
        //  if(totalFloors == sellLine){
        //    str.push('<li class="wall-m-presell" style="z-index:'+totalFloors+'"></li>');
        //  }else{
        //    str.push('<li class="wall-m" style="z-index:'+totalFloors+'"></li>');
        //  }
        //}
        //str.push('<li class="build-b"></li></ul></div><p>'+scope.data.name+'('+Math.max(gx1, gx2)+'/'+scope.data.floors+'层)<br/>&nbsp;'+scope.data.summary+'</p></a></div></div>');
        var o = $(str.join('')).appendTo(element);
        var iWinWidth = $(window).width();

        //itemp=(scope.floorNum)*18+107+34+50;
        itemp=(scope.data.floors)*17+143+50;
        //console.log(itemp)
        iWinHeight = $(window).height()-100;
        var detailH = parseInt(iWinHeight/2);
        var izoom = detailH/itemp;
        var fwidth = $('.whole-target').width();
        $('.floor-layer1').css({'height':detailH+'px','width':fwidth+'px','margin':'0 auto'});
        var iFh=(detailH-50)/itemp;
        //console.log('a',scope.buildsLen)
        $('.whole',element).css({'zoom':iFh});
        scope.$on('$destroy',function(){
          o.remove();
          $(element).remove();
        });
      })
    }
  }
})();
