/**
 * Created by leshuangshuang on 16/4/18.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .directive('sxtMaps',sxtMapsDirective);

  /** @ngInject */
  function sxtMapsDirective($timeout){
    return {
      scope:{
        markers:'=',
        markerClick:'&'
      },
      link:link
    }

    function  link(scope,element,attr,ctrl){



      $timeout(function () {
        var map = L.map(element[0], {
            center: [39.125596,117.190182],
            zoom: 10,
            attributionControl: false
          }),
          layer = L.tileLayer('http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
            subdomains: "1234"
          });

        layer.addTo(map);
        var mks = [];

          scope.markers = [];


              scope.markers.push({
                projectId:'1234567',
                title: '天津星河时代',
                lat: '39.193092',
                lng: '117.106007'
              })


          angular.forEach(scope.markers, function (o, k) {
            mks.push(L
              .marker([o.lat, o.lng], L.extend({
                icon: L.icon({
                  iconUrl: 'libs/leaflet/images/M.png',
                  iconSize: [24, 24],
                  iconAnchor: [12, 12]
                })
              }, o))
              .on('click', markerClick)
              .addTo(map));
          })

        map.on('zoomend', function (e) {
          var zoom = map.getZoom();
          if (zoom < 10) {
            mks.forEach(function (marker) {
              marker.setIcon(L.icon({
                iconUrl: 'libs/leaflet/images/S1.png',
                iconSize: [18, 18],
                iconAnchor: [9, 9]
              }));
            })
          }
          else if (zoom < 11) {
            mks.forEach(function (marker) {
              marker.setIcon(L.icon({
                iconUrl: 'libs/leaflet/images/S.png',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
              }));
            })
          }
          else if(zoom>=11 && zoom <=12) {
            mks.forEach(function (marker) {
              marker.setIcon(L.icon({
                iconUrl: 'libs/leaflet/images/M.png',
                iconSize: [39, 39],
                iconAnchor: [20, 20]
              }));
            })
          }
          else {
            mks.forEach(function (marker) {
              marker.setIcon(L.icon({
                iconUrl: 'libs/leaflet/images/L.png',
                iconSize: [70, 70],
                iconAnchor: [35, 35]
              }));
            })
          }
        })
        scope.$on('destroy', function () {
          map.remove();
        })
      }, 500)

      function markerClick(e){
        //console.log('e.target.options',e.target.options)
        scope.markerClick( {$current : e.target.options,pid: e.target.options.projectId, pname: e.target.options.title});

      }

    }
  }


})();
