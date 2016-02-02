/**
 * Created by zhangzhaoyong on 16/2/2.
 */
(function () {
  'use strict';

  angular
    .module('app.szgc')
    .directive('hMaps', hMapsDirective);

  /** @ngInject */
  function hMapsDirective($timeout){
    function ComplexCustomOverlay(point, text, mouseoverText){
      this._point = point;
      this._text = text;
      this._overText = mouseoverText;
    }
    ComplexCustomOverlay.prototype = new BMap.Overlay();
    ComplexCustomOverlay.prototype.initialize = function(map){
      this._map = map;
      var that = this;
      var div = this._div = document.createElement("div");
      div.style.position = "absolute";
      div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
      div.style.backgroundColor = "#EE5D5B";
      //div.style.border = "1px solid #BC3B3A";
      //div.style.color = "white";
      //div.style.height = "18px";
      //div.style.padding = "2px";
      div.style.lineHeight = "18px";
      div.style.whiteSpace = "nowrap";
      div.style.MozUserSelect = "none";
      div.style.fontSize = "12px"
      var span = this._span = document.createElement("div");
      span.className = 'point-add cyzn02';
      span.onclick = function(){
         that.onclick && that.onclick();
      };

      div.appendChild(span);
      //span.appendChild(document.createTextNode(this._text));
      var that = this;

      var arrow = this._arrow = document.createElement("div");
      arrow.style.position = "absolute";
      arrow.style.color = 'red';
      arrow.style.marginTop = '68px'
      arrow.style.textIndent = '-50px'
      arrow.innerHTML = this._text;
      arrow.style.fontSize = '20px'
      arrow.style.textShadow = '#fff 2px 0 0,#fff 0 2px 0,#fff -2px 0 0,#fff 0 -2px 0';
      arrow.onclick = function(){
        that.onclick && that.onclick();
      };
      div.appendChild(arrow);

      div.onmouseover = function(){
        this.style.backgroundColor = "#6BADCA";
        this.style.borderColor = "#0000ff";
        arrow.innerHTML = that._overText;
        //arrow.style.backgroundPosition = "0px -20px";
      }

      div.onmouseout = function(){
        this.style.backgroundColor = "#EE5D5B";
        //this.style.borderColor = "#BC3B3A";
        arrow.innerHTML = that._text;
        //arrow.style.backgroundPosition = "0px 0px";
      }

      this._map.getPanes().labelPane.appendChild(div);

      return div;
    }
    ComplexCustomOverlay.prototype.draw = function(){
      var map = this._map;
      var pixel = map.pointToOverlayPixel(this._point);
      this._div.style.left = pixel.x - 30 + "px";
      this._div.style.top  = pixel.y - 30 + "px";
    }

    return {
      scope:{

      },
      link:function(scope,element){
        $timeout(function(){


        var point = new BMap.Point(114.006492,22.555939);
        var map = new BMap.Map(element[0]);
        var overlay = new ComplexCustomOverlay(point, '万科安托山','万科安托山');
         var sContent= '<div class="mouse-over cyzn-bg">\
          <div class="name">万科安托山</div>\
            <div class="add">龙华新区龙观快速与悦兴路交汇处</div>\
            <div class="point-nav">\
            <div class="nav01"><a href="floor.html"><i></i>\
            <span>可视化进度</span>\
            </a>\
            </div>\
            <div class="nav02"><a href="#"><i></i>\
            <span>质量报表</span>\
            </a>\
            </div>\
            <div class="nav03"><a href="#"><i></i>\
            <span>一户一档</span>\
            </a>\
            </div>\
            </div>\
            </div>'
          var infoWindow = new BMap.InfoWindow(sContent,{
            offset:new BMap.Size(-30,-30)
          });

        map.centerAndZoom(point, 15);

          var marker = new BMap.Marker(point,{
            icon:new BMap.Icon('/assets/images/backgrounds/T.png',new BMap.Size(60,60))
          });        // 创建标注
          map.addOverlay(marker);
          map.addOverlay(overlay);
          marker.addEventListener("click",function(){
            //alert('a')
            this.openInfoWindow(infoWindow);
          });
        },1000)
      }
    }
  }
})();
