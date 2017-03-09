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
              return $("<span  style='background: green;height: 32px;width:32px;border-radius: 50%;text-align: center;line-height: 32px;'>" +
              "<span style='line-height: 32px;display: inline-block;max-width: 30px;color:white;text-align: center;overflow: hidden'>"+
                cname +
              "</span></div>")[0];
            default:
              return $("<div style='background: red;height: 32px;width: 32px;border-radius: 50%;text-align: center;line-height: 32px'>"+
                "<span style='line-height: 32px;display: inline-block;max-width: 30px;color:white;text-align: center;overflow: hidden'>"+
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
          mk.id=marker.id;
          marker.layer.addLayer(mk);
          scope.ctrl.added(marker, isload);

        }

        function findMark(marker) {
          var group = marker.layer,
            mk = null;
          group.eachLayer(function (layer) {
            if (layer.id === marker.id) {
              mk = layer;
            }
          });
          return mk;
        }

        function popup(marker) {
          var el = mapCache.get("pop")[0];
          scope.pop= L.popup({autoClose:true,closeButton:false})
            .setLatLng(marker.latlng)
            .setContent(el)
            .openOn(scope.map);
          $(".remove",el).off("click");
          $(".remove",el).click(function () {
            var mk=findMark(marker);
            if (mk) {
              marker.layer.removeLayer(mk);
              scope.ctrl.removed(marker);
            }
            scope.map.closePopup(scope.pop);
          })

          $(".move",el).off("click");
          $(".move",el).click(function () {
             var mk=findMark(marker);
             mk.editing.enable();
             scope.map.closePopup(scope.pop);
          })
          return scope.pop;
        }

        //map各类事件处理
        function mapOperate(operate) {
          var marker = operate.marker;
          switch (operate.cmd) {
            case 'click':
              scope.ctrl.preClick().then(function () {
                scope.ctrl.markers.forEach(function (mk) {
                  $(mk.el).removeClass('shine shine2');
                });
                $(marker.el).addClass('shine shine2');
                click_event(operate);
              }).catch(function (ex) {
                utils.alert("必须选择问题,并拍照,才能进行下一步操作!");
              })
              break;
            case "moved":
              moved_event(operate);
              break;
          }

          function moved_event(operate) {
            var marker =operate.marker;
            var mk=findMark(marker)
            if(mk){
              mk.editing.disable();
              scope.ctrl.moved(marker);
              popup(marker);
            }
          }

          function cancelEdit(marker) { //取消上次编辑
            return scope.ctrl.cancelEdit(marker).then(function (m) {
              if (scope.pop){ //关闭弹窗
                scope.map.closePopup(scope.pop);
              }
              if (m){
                var mk=findMark(m); //取消编辑状态
                mk.editing.disable();
              }
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
                    popup(marker);
                  });
                } else {
                  cancelEdit();
                }
                break;
              case "marker":
                cancelEdit(marker).then(function () {
                  scope.ctrl.editing(marker);
                  popup(marker);
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
                  var map=scope.map = L.map(el[0], {
                    crs: L.RicentCRS,
                    center: [0, 0],
                    zoom: 0,
                    zoomControl: false,
                    attributionControl: false,
                    closePopupOnClick: false
                  });
                  var layer;
                  layer = L.sheetLayer(scope.mapUrl,{
                    loadUrl:window.cordova?function (url,callback) {
                      window.resolveLocalFileSystemURL(url, function (fileEntry) {
                        fileEntry.file(function (file) {
                          var reader = new FileReader();
                          reader.onloadend = function (e) {
                            callback(this.result);
                          };
                          reader.readAsArrayBuffer(file);
                        },function () {
                        });
                      }, function (err) {
                          console.log(err);
                      });

                    }:null
                  });
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
                  map.on('draw:saving',function (e) {
                    var latlng = e.layer.getLatLng();
                    var marker=scope.ctrl.markers.find(function (m) {
                       return e.layer.id==m.id;
                    })
                    marker=marker?marker:{
                        id:e.layer.id,
                        latlng:latlng,
                        layer: regionLayer
                      };
                    marker.latlng=latlng;
                    mapOperate({
                      cmd: 'moved',
                      source: "map",
                      marker:marker
                    })
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

