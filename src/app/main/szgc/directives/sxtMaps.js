/**
 * Created by zhangzhaoyong on 16/2/16.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .directive('sxtMaps',sxtMapsDirective);

  /** @ngInject */
  function sxtMapsDirective($timeout,api,markerCulster){
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
            center: [22.631026, 114.111701],
            zoom: 10,
            attributionControl: false
          }),
          layer = L.tileLayer('http://mt2.google.cn/vt/lyrs=r&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}', {
            subdomains: "1234"
          });

        layer.addTo(map);
        var mks = [];
        api.szgc.ProjectExService.query(4).then(function (result) {
          scope.markers = [];

          result.data.Rows.forEach(function (row) {
            //console.log('makers2', row)
            if (row.Latitude && row.Longitude) {
              scope.markers.push({
                projectId: row.ProjectId,
                title: row.ProjectNo,
                lat: row.Latitude,
                lng: row.Longitude,
                center: function () {
                  map.setView(new L.latLng([row.Latitude, row.Longitude]))
                }
              })
            }
          });
          var parentGroup = markerCulster.markerClusterGroup();
          angular.forEach(scope.markers, function (o, k) {
            var mk = L
              .marker([o.lat, o.lng], L.extend({
                icon: L.icon({
                  iconUrl: 'assets/leaflet/images/M.png',
                  iconSize: [24, 24],
                  iconAnchor: [12, 12]
                })
              }, o))
              .on('click', markerClick);
            mks.push(mk);
            parentGroup.addLayer(mk);
          });
          parentGroup.addTo(map);

        });
        map.on('zoomend', function (e) {
          var zoom = map.getZoom();
          if (zoom < 10) {
            mks.forEach(function (marker) {
              marker.setIcon(L.icon({
                iconUrl: 'assets/leaflet/images/S1.png',
                iconSize: [18, 18],
                iconAnchor: [9, 9]
              }));
            })
          }
          else if (zoom < 11) {
            mks.forEach(function (marker) {
              marker.setIcon(L.icon({
                iconUrl: 'assets/leaflet/images/S.png',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
              }));
            })
          }
          else if(zoom>=11 && zoom <=12) {
            mks.forEach(function (marker) {
              marker.setIcon(L.icon({
                iconUrl: 'assets/leaflet/images/M.png',
                iconSize: [39, 39],
                iconAnchor: [20, 20]
              }));
            })
          }
          else {
            mks.forEach(function (marker) {
              marker.setIcon(L.icon({
                iconUrl: 'assets/leaflet/images/L.png',
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
