/**
 * Created by jiuyuong on 2016/8/13.
 */
(function () {
  'use strict';
  angular
    .module('app.inspection')
    .directive('inspectionMap', inspectionMap);
  /** @inject */
  function inspectionMap(sxt, $window, $timeout, api, map,$q, utils, mapCache,inspectionServe) {
    var mymap = map;
    return {
      scope: {
        mapShow: '=',
        mapUrl: '=',
        ctrl: '=',
        loaded: "="
      },
      link: function (scope, el) {

        //添加控制组件
        function addControl(map) {
          var el = mapCache.get("mapControl");
          el.click(function (e) {
            if (e.stopPropagation) {
              e.stopPropagation();
            }
            scope.edit = !scope.edit;
            // <md-icon  id="elW" md-svg-src="app/main/inspection/images/mark.svg"  ></md-icon>
            //   <md-icon  id="elR" md-svg-src="app/main/inspection/images/mark_.svg" style="display: none"></md-icon>
            if (scope.edit){
              $("div",el).html('<img src="app/main/inspection/images/mark_.svg" style="height: 28px;width: 28px"></img>');
            }else {
              $("div",el).html('<img src="app/main/inspection/images/mark.svg"  style="height: 28px;width: 28px"></img>');
            }
          });
          var c = L.control.elControl({
            position: 'topright',
            el: el[0]
          })
          map.addControl(c);
        }

        function InitMarker(layer) {
          var roomid=scope.ctrl.delivery.room.room_id;
          $q.all([
            inspectionServe.getIssues(),
            api.inspection.estate.getRepair_tasks_off(roomid)
          ]) .then(function (res) {
            var issues=res[0],r=res[1];
            if (r && r.data) {
              var marker, shape;
              r.data.forEach(function (k) {
                marker = {
                  id:k.id,
                  latlng: [k.drawing_x, k.drawing_y],
                  layer: layer,
                  tag: k
                }
                shape = k.pictures && k.issues ? "loaded" : null;
                var iss=issues.find(function (o) {
                  return o.issue_id==k.issues;
                })
                addMarker(marker, shape, true,iss?iss.abbrname:"");
              });
            }
          })
        }

        //marker形状
        function markerShape(shape,cname) {
          switch (shape) {
            case "loaded":
              return $("<span  style='background: green;height: 24px;width:24px;border-radius: 50%;text-align: center;line-height: 24px;position: relative'>" +
              "<span style='line-height: 32px;display: inline-block;max-width: 30px;text-align: center;overflow: hidden'>"+
                cname +
              "</span></div>")[0];
            default:
              return $("<div style='background: red;height: 24px;width: 24px;border-radius: 50%;text-align: center;line-height: 24px'>"+
                "<span style='line-height: 32px;display: inline-block;max-width: 30px;text-align: center;overflow: hidden'>"+
                "</span></div>")[0];
          }
        }

        //添加marker
        function addMarker(marker, shape, isload,cname) {
          cname=cname?cname:"";
          marker.el = markerShape(shape,cname);
          var mk = L.marker(marker.latlng, {
            icon: new L.HtmlIcon({
              className: 'rc-marker',
              iconSize: marker.iconSize || [32, 32],
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
          marker.layer.addLayer(mk);
          scope.ctrl.added(marker, isload);

        }

        //map各类事件处理
        function mapOperate(operate) {
          scope.ctrl.preClick().then(function (k) {
            var marker = operate.marker;
            switch (operate.cmd) {
              case 'click':
                scope.ctrl.markers.forEach(function (mk) {
                  $(mk.el).removeClass('shine shine2');
                });
                $(marker.el).addClass('shine shine2');
                click_event(operate);
                break;
            }
          }).catch(function () {
              utils.alert("必须选择问题,并拍照,才能进行下一步操作!");
          });
          function cancelEdit(marker) { //取消上次编辑
            return scope.ctrl.cancelEdit(marker).then(function (m) {
              if (m) {
                var style = m.tag.pictures && m.tag.issues ? "loaded" : null
                switch (style) {
                  case "loaded":
                    $(m.el).css("background", "green");
                    break;
                }
              }
            });
          }

          //点击事件
          function click_event(operate) {
            var marker = operate.marker;
            switch (operate.source) {
              case"map":
                if (scope.edit) { //添加mark
                  cancelEdit().then(function () {
                    addMarker(marker);
                    $(marker.el).addClass('shine shine2');
                  });
                } else {
                  cancelEdit();
                }
                break;
              case "marker":
                cancelEdit(marker).then(function () {
                  scope.ctrl.editing(marker);
                });
                break;
            }
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
                        id:sxt.uuid(),
                        latlng: [e.latlng.lat, e.latlng.lng],
                        layer: regionLayer
                      }
                    })
                  });
                  map.on('sheet:load', function (f) {
                    addControl(map);
                    InitMarker(regionLayer);
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

