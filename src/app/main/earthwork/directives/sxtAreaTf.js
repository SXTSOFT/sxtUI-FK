/**
 * Created by lukehua on 2016/11/22.
 */

(function (angular, undefined) {
  'use strict';

  angular
    .module('app.earthwork')
    .directive('sxtAreaTf', sxtAreaTf);

  /**@ngInject*/
  function sxtAreaTf($timeout, sxt, utils, api) {

    return {
      scope: {
        data: '=',
        isShow: '=',
        popup: '@'
      },
      link: function (scope, element, attrs, ctrl) {
        var map, el;
        var ran = function () {
          if (!scope.isShow || !scope.data || scope.data.files.length === 0) return;
          if (map) map.remove();

          var url = scope.data.obj.FileId;
          var layer;
          map = L.map(element[0], {
            crs: L.extend({}, L.CRS, {
              projection: L.Projection.LonLat,
              transformation: new L.Transformation(1, 0, 1, 0),
              scale: function (e) {
                return 512 * Math.pow(2, e);
              }
            }),
            center: [.48531902026005, .5],
            zoom: 0,
            minZoom: 0,
            maxZoom: 3,
            scrollWheelZoom: true,
            annotationBar: false,
            zoomControl: false,
            attributionControl: false
          }),
            //layer = L.tileLayer(sxt.app.api + '/api/file/load?x={x}&y={y}&z={z}', {
            layer = L.tileLayer(sxt.app.api + '/api/PicMap/load/{z}_{x}_{y}.png?fid=' + url.replace('/s_', '/'), {
              noWrap: true,
              continuousWorld: false,
              tileSize: 512
            });
          map.projectId = scope.projectId;
          layer.addTo(map);
          L.drawLocal = {
            draw: {
              toolbar: {
                actions: {
                  title: '取消',
                  text: '取消'
                },
                undo: {
                  title: '撤消最后一个点',
                  text: '撤消'
                },
                buttons: {
                  polyline: '',
                  polygon: '切画区域',
                  rectangle: 'Draw a rectangle',
                  circle: 'Draw a circle',
                  marker: '摄像头位置'
                }
              },
              handlers: {
                circle: {
                  tooltip: {
                    start: 'Click and drag to draw circle.'
                  },
                  radius: 'Radius'
                },
                marker: {
                  tooltip: {
                    start: '点击这里放置摄像头'
                  }
                },
                polygon: {
                  tooltip: {
                    start: '点击开始',
                    cont: '点击继续',
                    end: '点击第一点结束.'
                  }
                },
                polyline: {
                  error: '<strong>Error:</strong> shape edges cannot cross!',
                  tooltip: {
                    start: 'Click to start drawing line.',
                    cont: 'Click to continue drawing line.',
                    end: 'Click last point to finish line.'
                  }
                },
                rectangle: {
                  tooltip: {
                    start: 'Click and drag to draw rectangle.'
                  }
                },
                simpleshape: {
                  tooltip: {
                    end: 'Release mouse to finish drawing.'
                  }
                }
              }
            },
            edit: {
              toolbar: {
                actions: {
                  save: {
                    title: '保存编辑.',
                    text: '保存'
                  },
                  cancel: {
                    title: '取消编辑，所有改动将取消',
                    text: '取消'
                  }
                },
                buttons: {
                  edit: 'Edit layers.',
                  editDisabled: 'No layers to edit.',
                  remove: 'Delete layers.',
                  removeDisabled: 'No layers to delete.'
                }
              },
              handlers: {
                edit: {
                  tooltip: {
                    text: '点击方块改变区域.',
                    subtext: '点击取消退出编辑'
                  }
                },
                remove: {
                  tooltip: {
                    text: '点击物件删除'
                  }
                }
              }
            }
          };
          var drawnItems = L.featureGroup(),
            labels = L.featureGroup();

          map.addLayer(labels);
          map.addLayer(drawnItems);

          api.earthwork.earthwork.getEarthworkList({
            regionTreeId: scope.data.obj.RegionTreeId + '>' + scope.data.obj.Id,
            status: 4
          }).then(function (r) {
            r.data.forEach(function (ly) {
              var geojson = JSON.parse(ly.GeoJSON),
                options = geojson.options;
              if (scope.data.zy && options.zy != scope.data.zy) return;
              switch (geojson.geometry.type) {
                case 'Circle':
                  layer = L.circle(L.GeoJSON.coordsToLatLng(geojson.geometry.coordinates), options.radius, options);
                  break;
                default:
                  var layer = L.GeoJSON.geometryToLayer(geojson, options.pointToLayer, options.coordsToLatLng, options);
                  layer.feature = L.GeoJSON.asFeature(geojson);

                  break;
              }
              layer.data = ly;
              drawnItems.addLayer(layer);
              updateText(layer);
              layer.on('mouseover', function () {
                console.log('mouseover');
              })
              layer.on('mouseout', function () {
                console.log('mouseout');
              })
              layer.on('click', function (e) {
                openPopup(layer);
              })
            })
          });


          var editing, isPopup, drawLine;
          map.on('draw:drawstart', function (e) {
            var type = e.layerType;
            if (type == 'polyline') {
              drawLine = true;
            }
            console.log('start', type);
          });
          map.on('draw:drawstop', function (e) {
            drawLine = false;
            console.log('end');
          });
          map.on('draw:pointChanged', function (e) {
            console.log('point', e);
          })
          map.on('draw:editstart', function () {
            editing = true;
          })
          map.on('draw:deletestart', function () {
            editing = true;
          })
          map.on('draw:editstop', function () {
            editing = false;
          })
          map.on('draw:deletestop', function () {
            editing = false;
          })
          map.on('draw:created', function (e) {
            var type = e.layerType,
              layer = e.layer;
            drawnItems.addLayer(layer);
            layer.on('click', function (e) {
              openPopup(layer);
            })
            openPopup(layer);
          });
          map.on('draw:edited', function (e) {
            var layers = e.layers;
            layers.eachLayer(function (layer) {
              var geojson = layer.toGeoJSON();
              geojson.geometry.type = geojson.geometry.type != 'Polygon' ? 'Circle' : 'Polygon';
              geojson.options = layer.options;
              geojson.options.radius = layer._mRadius;
              layer.data.GeoJSON = JSON.stringify(geojson);
              api.earthwork.earthwork.updateEarthworkArea(layer.data.Id, layer.data);
            });
          });
          map.on('draw:deleted', function (e) {
            var layers = e.layers;
            layers.eachLayer(function (layer) {
              api.earthwork.earthwork.delete(layer.data.Id).then(function () {
                var ly = null;
                labels.eachLayer(function (lb) {
                  if (lb.id == layer.options.id)
                    ly = lb;
                });
                if (ly) {
                  labels.removeLayer(ly);
                }
              })
            });
          });
          // map.on('popupclose', function (e) {
          //
          //   var text = $('input', el).val();
          //   var type = $('#zjtypeB', el).length ? $('#zjtypeB', el).prop('checked') ? 'B' : 'A' : null;
          //   if (text == '') {
          //     setTimeout(function () {
          //       //alert('请输入名称');
          //       e.popup.openOn(map);
          //     }, 10);
          //   }
          //   else {
          //     isPopup = false;
          //     var layer = e.popup.layer;
          //     layer.options.text = text;
          //     layer.options.type = type;
          //     var json = layer.toGeoJSON();
          //     json.geometry.type = json.geometry.type != 'Polygon' ? 'Circle' : 'Polygon';
          //     json.options = layer.options;
          //     json.options.radius = layer._mRadius;
          //     json.options.zy = scope.data.zy;
          //     json.options.id = json.options.id || sxt.uuid();
          //     layer.data = {
          //       Id: json.options.id,
          //       RegionName: text,
          //       RegionType: scope.data.obj.RegionType,
          //       RegionTreeId: scope.data.obj.RegionTreeId + '>' + scope.data.obj.Id,
          //       RegionTreeName: scope.data.obj.RegionTreeName + '>' + scope.data.obj.RegionName,
          //       UserId: json.options.type,
          //       GeoJSON: JSON.stringify(json)
          //     }
          //
          //     api.earthwork.earthwork.createEarthworkArea(layer.data).then(function () {
          //       $('input', el).val('');
          //       updateText(layer);
          //     });
          //   }
          // });

          function updateText(layer) {
            if (!layer.options.text) return;
            var ly = null;
            labels.eachLayer(function (lb) {
              if (lb.id == layer.options.id)
                ly = lb;
            });
            if (ly) {
              labels.removeLayer(ly);
            }

            ly = L.marker(layer.getBounds().getCenter(), {
              icon: new ST.L.LabelIcon({
                html: layer.options.text,
                color: layer.options.color,
                iconAnchor: [(layer.options.text.length * 6), 12]
              }),
              saved: false,
              draggable: false,       // Allow label dragging...?
              zIndexOffset: 1000     // Make appear above other map features
            });
            ly.id = layer.options.id;
            labels.addLayer(ly);

          }

          function openPopup(layer) {
            // if (editing || isPopup) {
            //   map.closePopup();
            //   return;
            // };

            el = el || document.getElementById(scope.popup);
            $('input', el).val(layer.options.text);
            if (layer.options.type == 'B') {
              $('#zjtypeA', el).prop('checked', false);
              $('#zjtypeB', el).prop('checked', true);
            }
            else {
              $('#zjtypeB', el).prop('checked', false);
              $('#zjtypeA', el).prop('checked', true);
            }
            var popup = L.popup()
              .setLatLng(layer.getBounds().getCenter())
              .setContent(el)
              .openOn(map);
            isPopup = true;
            popup.layer = layer;
          }

          var drawControl = new L.Control.Draw({
            draw: {
              select: false,
              yun: false,
              arrow: false,
              pen: false,
              zi: false,
              hand: false,
              polygon: {
                allowIntersection: false,
                drawError: {
                  color: '#b00b00',
                  timeout: 1000
                },
                shapeOptions: {
                  color: '#ff0000'
                },
                showArea: false
              },
              rectangle: false,
              polyline: false,
              circleMarker: {
                shapeOptions: {
                  weight: 2
                }
              },
              video: false,
              marker: false
            },
            edit: {
              edit: true,
              remove: true,
              featureGroup: drawnItems
            }
          });
          map.addControl(drawControl);

        }

        function ran1() {
          $timeout(ran, 300);
        }

        scope.$watch('data', ran1);
        scope.$watch('data.zy', ran1);
        scope.$watch('isShow', ran1);
        scope.$watchCollection('data.files', function () {
          if (scope.data.files && scope.data.files.length) {
            ran1();
          }
          else {
            if (map) {
              map.remove();
              map = null;
            }
          }
        });
      }
    };
  }
})(angular, undefined);
