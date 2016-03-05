/**
 * Created by jiuyuong on 2016/3/4.
 */

/**
 * Created by zhangzhaoyong on 16/2/16.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .directive('sxtAreaXc',sxtAreaXc);

  /** @ngInject */
  function sxtAreaXc($timeout,$http,$state){
    return {
      scope:{

      },
      link:link
    }

    function  link(scope,element,attr,ctrl){
      $timeout(function(){
        var map = L.map('map',{
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
            attributionControl: false
          }
        );
        L.tileLayer(
          'http://vkde.sxtsoft.com/api/picMap/load/{z}_{x}_{y}.png?path=/upload/hx.jpg',
          //'http://vkde.sxtsoft.com/upload/hx_tile_{z}_{x}_{y}.png',
          {
            attribution: false
          }).addTo(map);
        var drawnItems = new L.FeatureGroup();
        map.addLayer(drawnItems);

        var apiLayer = L.GeoJSON.api({
          get: function (cb) {

          },
          post: function (data, cb) {
            console.log('data',data);
          },
          click: function (layer, cb) {
            if (layer.editing && layer.editing._enabled) return;
            {
              if (layer._icon) {
              }
              else {
              }
            }

          },
          onAdd:function(layer){

          }
        }).addTo(map);


        var photoMaker = L.Icon.extend({
          options: {
            shadowUrl: null,
            iconAnchor: [15, 15],
            iconSize: [30, 30],
            iconUrl: 'images/photo.png'
          }
        });
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
            rectangle: false,
            polyline: false,
            circle: false,
            marker: {
              icon: new photoMaker()
            }
          },
          edit: {
            edit: true,
            remove: true,
            featureGroup: apiLayer
          }
        });
        map.addControl(drawControl);
      },500)
    }
  }


})();
