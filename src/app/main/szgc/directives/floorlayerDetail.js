/**
 * Created by emma on 2016/3/1.
 */

(function () {
  'use strict';

  angular
    .module('app.szgc')
    .directive('floorLayerDetail', floorLayerDetailDirective);

  /** @ngInject */
  function floorLayerDetailDirective($timeout) {
    return {
      restrict: 'EA',
      scope: {
        floorData: '=sxtfloor',
        floorNum: '=',
        sellLine: '=',
        single: '@',
        bdetailData: '='
      },
      link: link
    }

    function link(scope, element, attr, ctrl) {
      scope.$watch('bdetailData', function () {
        if (!scope.bdetailData) return;

        var sellLine = scope.floorData.sellLine, gx1 = scope.floorData.gx1, gx2 = scope.floorData.gx2;
        if (gx1 > scope.floorData.floors) gx1 = scope.floorData.floors;
        if (gx2 > scope.floorData.floors) gx2 = scope.floorData.floors;
        //var _floorData = [scope.floorNum, scope.floorData.floors, 20, 10, sellLine, scope.floorData.name]
        var str = [];
        var zIndex = 1, zWholeIndex = 1;
        var iFloorHeight = 0, iWinHeight = 0, itemp = 0, iWwidth = 0;
        var zoom = 0;
        var p = element.position(), h = $(window).height();

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

        str.push('<li class="wall-t" style="z-index:' + scope.floorData.floors + '"></li>');
        var totalFloors = scope.floorData.floors;
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

        str.push('<div style="height:55px;"></div></div></div><p>' + scope.floorData.name + '('+ Math.max(gx1, gx2) +'/' + scope.floorData.floors + '层)<br/>&nbsp;' + scope.floorData.summary +'</p></a></div></div>');
        var o = $(str.join('')).appendTo(element);
        var barchartHeight=$('#barchart').outerHeight();
        itemp = (scope.floorNum - 1) * 18 + 500;
        //根据手机大小来定zoom，最小为0.12
        iWinHeight = $(window).height() - 100-barchartHeight;

        zoom=iWinHeight/itemp;
        // var zoom = iWinHeight / itemp;


        $('.newlayer>div').on('click', function () {
          $(this).css('z-index',101).siblings().css('z-index',100);
        })
        //窗口缩放时自动调整相应参数
        //$(window).resize(function () {
        //  if ($(window).width() > 960) {
        //    zoom = 0.5;
        //    iFloorHeight = ((scope.floorNum - 1) * 18 + 107 + 34) * zoom + 80;
        //    $('.whole').css('zoom', zoom);
        //    $('.floor-layer1').css('height', iFloorHeight + 'px');
        //  }
        //  else if ($(window).width() > 760) {
        //    zoom = 0.5;
        //    iFloorHeight = ((scope.floorNum - 1) * 18 + 107 + 34) * zoom + 50;
        //    $('.whole').css('zoom', zoom);
        //    $('.floor-layer1').css('height', iFloorHeight + 'px');
        //  } else {
        //    zoom = izoom;
        //    $('.whole').css('zoom', zoom);
        //    iFloorHeight = ((scope.floorNum - 1) * 18 + 107 + 34) * zoom + 50;
        //    $('.floor-layer1').css('height', iFloorHeight + 'px');
        //  }
        //})

        iFloorHeight = itemp * zoom ;
        $('.whole', element).css('zoom', '0.24');
        $('.floor-layer1').css({'height': '250px','width': '250px'});

        scope.$on('$destroy', function () {
          o.remove();
          $(element).remove();
        });
      });
    }
  }

})();
