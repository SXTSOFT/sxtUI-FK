/**
 * Created by jiuyuong on 2016/8/13.
 */
(function () {
  'use strict';
  angular
    .module('app.inspection')
    .directive('inspectionMap', inspectionMap);
  /** @inject */
  function inspectionMap(sxt, $window, $timeout, api, map, utils, mapCache) {
    var mymap = map;
    return {
      scope: {
        mapShow: '=',
        mapUrl: '=',
        ctrl: '=',
        loaded: "="
      },
      link: function (scope, el, api) {

        function click_event(operate) {
          var marker = operate.marker;
          switch (operate.source) {
            case"map":
              if (scope.edit){ //添加mark
                marker.el = scope.ctrl.markerDom();
                var mk = L.marker(marker.latlng, {
                  icon: new L.HtmlIcon({
                    className: 'rc-marker',
                    iconSize: marker.iconSize || [30, 30],
                    iconAnchor: marker.iconAnchor || [15, 15],
                    el: marker.el
                  })
                }).on('click', function () {
                  mapOperate({
                    cmd: 'click',
                    source: "marker",
                    marker: marker
                  });
                });
                scope.ctrl.markers.push(marker);
                scope.ctrl.added(marker);
                marker.layer.addLayer(mk);
              }else{
                scope.ctrl.cancelEdit(marker);
              }
              break;
            case "marker":
              scope.ctrl.edited(marker);
              break;
          }
          scope.$apply();
        }


        function mapOperate(operate) {
          var marker = operate.marker;
          switch (operate.cmd) {
            case 'click':
              scope.ctrl.markers.forEach(function (mk) {
                $(mk.el).removeClass('current');
              });
              $(marker.el).addClass('current');
              click_event(operate);
              break;
          }
        }

        scope.$watch("loaded", function () {
          if (scope.loaded) {
            if (scope.mapUrl) {
              $timeout(function () {
                if (!scope.mapUrl) {
                  utils.alert("未找到户型图纸!");
                  return;
                }
                mymap(function () {
                  var mv = scope.ctrl;
                  var map = L.map(el[0], {
                    crs: L.RicentCRS,
                    center: [0, 0],
                    zoom: 0,
                    zoomControl: false,
                    attributionControl: false,
                    closePopupOnClick: false
                  });
                  var layer;
                  layer = L.sheetLayer(scope.mapUrl);
                  layer.addTo(map);
                  var regionLayer = L.layerGroup();
                  regionLayer.addTo(map);
                  map.on('click', function (e) {
                    mapOperate({
                      cmd: 'click',
                      source: "map",
                      marker: {
                        latlng: [e.latlng.lat, e.latlng.lng],
                        layer: regionLayer
                      }
                    })
                  });
                  map.on('sheet:load', function (f) {
                    el = mapCache.get("mapControl");
                    el.click(function (e) {
                      if (e.stopPropagation) {
                        e.stopPropagation();
                      }
                      scope.edit = !scope.edit;
                    });
                    var c = L.control.elControl({
                      position: 'topright',
                      el: el[0]
                    })
                    map.addControl(c);
                  });
                });
              }, 300)
            } else {
              utils.alert("未找到户型图纸");
            }
          }
        })
      }
    }
  }
})();

