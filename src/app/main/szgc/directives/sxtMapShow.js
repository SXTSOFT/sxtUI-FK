(function(){
  'use strict';
  angular
    .module('app.szgc')
    .directive('sxtMapShow',sxtMapShow);

  /** @ngInject */
  function sxtMapShow(api,sxt,tileLayer,$state,$timeout){
    return {
      scope: {
        value:'=sxtMapShow'
      },
      link: function (scope, element, attrs, ctrl) {
        var map,layer,drawnItems,labels;
        scope.$watch('value',function () {
          if(scope.value){
            scope.value.resize = function () {
              if(map){
                $timeout(function () {
                  map.invalidateSize();
                },400);
              }
            };
            scope.value.ran = function () {
              if (!map) {
                map = L.map(element[0], {
                  crs: L.extend({}, L.CRS, {
                    projection: L.Projection.LonLat,
                    transformation: new L.Transformation(1, 0, 1, 0),
                    scale: function (e) {
                      return 256 * Math.pow(2, e);
                    }
                  }),
                  center: [.4853, .5],
                  zoom: 0,
                  minZoom: 0,
                  maxZoom: 3,
                  scrollWheelZoom: true,
                  annotationBar: false,
                  zoomControl: false,
                  attributionControl: false
                });
              }
              if (layer && layer.url != scope.value.file) {
                map.removeLayer(layer);
                layer = null;
              }
              if (!layer) {
                layer = tileLayer.tile({
                  api: sxt.app.api,
                  Url: scope.value.file
                });
                layer.url = scope.value.file;
                layer.addTo(map);
              }
              if(!drawnItems) {
                drawnItems = L.featureGroup();
                map.addLayer(drawnItems);
              }
              if(!labels) {
                labels = L.featureGroup();
                map.addLayer(labels);
              }
            };
            scope.value.render = function (data) {
              drawnItems.clearLayers();
              labels.clearLayers();
              data.forEach(function (ly) {
                var geojson = ly.GeoJSON ? JSON.parse(ly.GeoJSON):ly,
                  options = geojson.options;
                if(scope.value.onOptions) {
                  options = scope.value.onOptions(options);
                }
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
                layer.on('click', function (e) {
                  openPopup(layer);
                })
              });
            }

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

          ly = L.marker(layer.getBounds().getCenter(), {
            icon: new ST.L.LabelIcon({
              html: layer.options.text,
              color: layer.options.textColor||layer.options.color,
              iconAnchor: [(layer.options.text.length * 6), 12]
            }),
            saved: false,
            draggable: false,       // Allow label dragging...?
            zIndexOffset: 1000     // Make appear above other map features
          });
          ly.id = layer.options.id;
          labels.addLayer(ly);
          ly.on('click', function (e) {
            openPopup(layer);
          })

        }

        function openPopup(layer) {
          scope.value.onLayerClick && scope.value.onLayerClick(layer);
        }
      }
    }
  }
})();
