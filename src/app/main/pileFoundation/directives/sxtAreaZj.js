/**
 * Created by lukehua on 2016/11/22.
 */

(function (angular, undefined) {
  'use strict';

  angular
    .module('app.pileFoundation')
    .directive('sxtAreaZj', sxtAreaZj);

  /**@ngInject*/
  function sxtAreaZj($timeout, sxt, utils, api) {

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

          var drawnItems = L.featureGroup(),
            labels = L.featureGroup();

          map.addLayer(labels);
          map.addLayer(drawnItems);

          api.pileFoundation.pileFoundation.getPileFoundationList({
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
                console.log('click')
              })
            })
          });


          var editing, isPopup, drawLine,isclose;
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
            isclose = false;
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
              api.pileFoundation.pileFoundation.updatePileFoundationArea(layer.data.Id, layer.data);
            });
          });
          map.on('draw:deleted', function (e) {
            var layers = e.layers;
            layers.eachLayer(function (layer) {
              api.pileFoundation.pileFoundation.delete(layer.data.Id).then(function () {
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
          map.on('popupclose', function (e) {
            isclose = true;
            var text = $('input', el).val();
            var type = $('#zjtypeB', el).length ? $('#zjtypeB', el).prop('checked') ? 'B' : 'A' : null;
            if (text == '') {
              setTimeout(function () {
                //alert('请输入名称');
                e.popup.openOn(map);
              }, 10);
            }
            else {
              isPopup = false;
              var layer = e.popup.layer;
              layer.options.text = text;
              layer.options.type = type;
              var json = layer.toGeoJSON();
              json.geometry.type = json.geometry.type != 'Polygon' ? 'Circle' : 'Polygon';
              json.options = layer.options;
              json.options.radius = layer._mRadius;
              json.options.zy = scope.data.zy;
              json.options.id = json.options.id || sxt.uuid();
              layer.data = {
                Id: json.options.id,
                RegionName: text,
                RegionType: scope.data.obj.RegionType,
                RegionTreeId: scope.data.obj.RegionTreeId + '>' + scope.data.obj.Id,
                RegionTreeName: scope.data.obj.RegionTreeName + '>' + scope.data.obj.RegionName,
                UserId: json.options.type,
                GeoJSON: JSON.stringify(json)
              }

              api.pileFoundation.pileFoundation.createPileFoundationArea(layer.data).then(function () {
                $('input', el).val('');
                updateText(layer);
              });
            }
          });

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

            // ly = L.marker(layer.getBounds().getCenter(), {
            //   icon: new ST.L.LabelIcon({
            //     html: layer.options.text,
            //     color: layer.options.color,
            //     iconAnchor: [(layer.options.text.length * 6), 12]
            //   }),
            //   saved: false,
            //   draggable: false,       // Allow label dragging...?
            //   zIndexOffset: 1000     // Make appear above other map features
            // });
            //ly.id = layer.options.id;
            //labels.addLayer(ly);

          }

          function openPopup(layer) {
            if(isclose == true) {
              isclose = false;
              return;
            }
            if (editing || isPopup) {
              map.closePopup();
              return;
            };

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
              circleMarker: {
                shapeOptions: {
                  weight: 2
                }
              }
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
