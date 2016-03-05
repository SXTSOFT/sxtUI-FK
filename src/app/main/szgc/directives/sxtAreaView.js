
/**
 * Created by zhangzhaoyong on 16/2/16.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .directive('sxtAreaView',sxtAreaView);

  /** @ngInject */
  function sxtAreaView($timeout,$http,$state,utils,msUtils,$mdDialog){
    return {
      scope:{
        pid:'@'
      },
      link:link
    }

    function  link(scope,element,attr,ctrl){

      $timeout(function() {
        $http.get ('http://vkde.sxtsoft.com/api/ProjectEx/'+utils.id).then (function (result) {
          var project = result.data || {ProjectId:utils.id};

          var map = L.map (element[0], {
              crs: L.extend ({}, L.CRS, {
                projection: L.Projection.LonLat,
                transformation: new L.Transformation (1, 0, 1, 0),
                scale: function (e) {
                  return 512 * Math.pow (2, e);
                }
              }),
              center: [.48531902026005, .3],
              zoom: 0,
              minZoom: 0,
              maxZoom: 3,
              scrollWheelZoom: true,
              annotationBar: false,
              attributionControl: false
            }
          );
          L.tileLayer (
            'http://vkde.sxtsoft.com/api/picMap/load/{z}_{x}_{y}.png?path=/upload/hx.jpg',
            //'http://vkde.sxtsoft.com/upload/hx_tile_{z}_{x}_{y}.png',
            {
              attribution: false
            }).addTo (map);
          var drawnItems = new L.FeatureGroup ();
          map.addLayer (drawnItems);

          var apiLayer = L.GeoJSON.api ({
            get: function (cb) {
              if (project.AreaRemark) {
                try {
                  var d = JSON.parse(project.AreaRemark),zg=[];
                  d.features.forEach(function(f,i){
                    if(f.geometry.type!='Point' || f.options.pid==scope.pid){
                      if(f.geometry.type != '')f.options.fill=false;
                      zg.push(f)
                    }
                  });
                  d.features = zg;
                  console.log(d);
                  cb(d);
                }
                catch (ex) {
                  cb();
                }
              }
              else {
                cb();
              }
            },
            post: function (data, cb) {

            },
            click: function (layer, cb) {
              if (layer.editing && layer.editing._enabled) return;
              {
                if (layer._icon) {
                  scope.$emit('sxtImageView',{groups:[layer.options.pid]})
                }
                else {
                }
              }

            }
          }).addTo (map);


          var photoMaker = L.Icon.extend ({
            options: {
              shadowUrl: null,
              iconAnchor: [15, 15],
              iconSize: [30, 30],
              iconUrl: 'assets/leaflet/css/images/photo.png'
            }
          });
          var drawControl = new L.Control.Draw ({
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
              rectangle: true,
              polyline: false,
              circle: false,
              marker: {
                icon: new photoMaker ()
              }
            },
            edit: {
              edit: true,
              remove: true,
              featureGroup: apiLayer
            }
          });
          //map.addControl (drawControl);
        });
      }, 500);
    }
  }


})();
