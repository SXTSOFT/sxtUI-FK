/**
 * Created by zhangzhaoyong on 16/2/16.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .directive('sxtMaps',sxtMapsDirective);

  /** @ngInject */
  function sxtMapsDirective($timeout,api){
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
            center: [22.631026,114.111701],
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
          scope.markers.push({
           // projectId: row.ProjectId,
           // title: 星河智荟,
            lat:  22.662545,
            lng: 114.220836
          })
          scope.markers.push({
            // projectId: row.ProjectId,
            // title: 星河传奇,
            lat:  22.633222,
            lng: 114.019178
          })

          //result.data.Rows.forEach(function (row) {
          //  //console.log('makers2', row)
          //  if (row.Latitude && row.Longitude) {
          //
          //  }
          //});

          angular.forEach(scope.markers, function (o, k) {
            mks.push(L
              .marker([o.lat, o.lng], L.extend({
                icon: L.icon({
                  iconUrl: 'libs/leaflet/images/M.png',
                  iconSize: [27, 37],
                  iconAnchor: [13, 18]
                })
              }, o))
              .on('click', markerClick)
              .addTo(map));
          })
        });
        map.on('zoomend', function (e) {
          var zoom = map.getZoom();
          if (zoom < 10) {
            mks.forEach(function (marker) {
              marker.setIcon(L.icon({
                iconUrl: 'libs/leaflet/images/S1.png',
                iconSize: [17, 23],
                iconAnchor: [8, 11]
              }));
            })
          }
          else if (zoom < 11) {
            mks.forEach(function (marker) {
              marker.setIcon(L.icon({
                iconUrl: 'libs/leaflet/images/S.png',
                iconSize: [17, 23],
                iconAnchor: [8, 11]
              }));
            })
          }
          else if(zoom>=11 && zoom <=12) {
            mks.forEach(function (marker) {
              marker.setIcon(L.icon({
                iconUrl: 'libs/leaflet/images/L1.png',
                iconSize: [32, 43],
                iconAnchor: [16, 21]
              }));
            })
          }
          else {
            mks.forEach(function (marker) {
              marker.setIcon(L.icon({
                iconUrl: 'libs/leaflet/images/L1.png',
                iconSize: [48, 65],
                iconAnchor: [24, 32]
              }));
            })
          }
        })
        scope.$on('destroy', function () {
          map.remove();
        })
      }, 1000)

      function markerClick(e){
        //console.log('e.target.options',e.target.options)
        scope.markerClick( {$current : e.target.options,pid: e.target.options.projectId, pname: e.target.options.title});

      }

    }
  }


})();
