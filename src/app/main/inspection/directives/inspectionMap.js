/**
 * Created by jiuyuong on 2016/8/13.
 */
(function () {
  'use strict';
  angular
    .module('app.inspection')
    .directive('inspectionMap',inspectionMap);
  /** @inject */
  function inspectionMap(sxt,$window,$timeout,api,map) {
    var mymap = map;
    return {
      scope:{
        mapShow:'=',
        mapUrl:'=',
        ctrl:'=',
        mapClick:'&'
      },
      link:function (scope,el,api) {
        function mapOperate(operate) {
          switch (operate.cmd){
            case 'click':
              console.log('click',operate.marker,operate.marker.el)
              scope.ctrl.markers.forEach(function (mk) {
                $(mk.el).removeClass('current');
              });
              if(operate.marker.el){
                $(operate.marker.el).addClass('current');
              }
              else{
                var dom = $('<div>'+(scope.ctrl.markers.length+1)+'</div>');
                var geo={
                  el:dom[0],
                  id: sxt.uuid(),
                  dataType:1,
                  latlng: operate.marker.latlng,
                  iconSize: [24, 24],
                  iconAnchor: [12, 12],
                  status: {
                    selected: false,
                    editing: false,
                    current: false
                  },
                  tag: {
                    type:'task',
                    isNew:true
                  }
                };
                scope.ctrl.markers.push(geo);
                scope.ctrl.added(geo);
                console.log('markers',scope.ctrl.markers);
                scope.$apply();
              }
              break;
          }
        }
        scope.$watch('ctrl',function () {
          if(!scope.ctrl) return;
          mymap(function () {
            var mv = scope.ctrl;
            //if(scope.mapUrl)
            var map = L.map(el[0], {
              crs: L.RicentCRS,
              center: [0, 0],
              zoom: 0,
              zoomControl: false,
              attributionControl: false,
              closePopupOnClick: false
            });
            var layer;
            layer = L.sheetLayer('http://pic.focus.cn/ccimg.focus.cn/upload/photos/390279/t1718.jpg');
            layer.addTo(map);
            var regionLayer = L.layerGroup();
            regionLayer.addTo(map);
            map.on('click',function (e) {
              mapOperate({
                cmd:'click',
                marker:{
                  latlng:[e.latlng.lat,e.latlng.lng],
                  status:{
                  }
                }
              })
            });
            scope.ctrl.added = function (marker) {
              var mk = L.marker(marker.latlng, {
                icon: new L.HtmlIcon({
                  className: 'rc-marker',
                  iconSize: marker.iconSize || [30, 30],
                  iconAnchor: marker.iconAnchor || [15, 15],
                  el: marker.el
                })
              }).on('click', function () {
                mapOperate({
                  cmd:'click',
                  marker:marker
                });
                //点击marker做的事情，popup，选择中--
              });
              mk.id = marker.id;
              regionLayer.addLayer(mk);
            }
            scope.ctrl.removed = function (marker) {
              console.log('remove',marker);
              var group = regionLayer,
                mk = null;
              layer.eachLayer(function (layer) {
                if (layer.id === marker.id) {
                  mk = layer;
                }
              });
              if (mk) {
                group.removeLayer(mk);
              }
            }


          });
        })
      }
    }

  }
})();

