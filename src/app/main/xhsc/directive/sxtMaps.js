/**
 * Created by leshuangshuang on 16/4/18.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .directive('sxtMaps',sxtMapsDirective);

  /** @ngInject */
  function sxtMapsDirective($timeout,remote){
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
            center: [22.632591,114.019304],
            zoom: 14,
            attributionControl: false
          }),
          layer = L.tileLayer('http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
            subdomains: "1234"
          });

        layer.addTo(map);
        var mks = [];
          //scope.markers = [];
          //    scope.markers.push({
          //      projectId:'1234567',
          //      title: '天津星河时代',
          //      lat: '39.193092',
          //      lng: '117.106007',
          //      pinyin:'tjxhsd'
          //    })
          //
        remote.Assessment.Project.getMap().then(function(result){
          console.log('map',result);
          scope.markers=[];
          result.data.filter(function(item) {
            return !!item.Coordinate
          }).forEach(function(m){
            var latlngs = m.Coordinate.split(',');
            mks.push(L
              .marker([parseFloat(latlngs[1]), parseFloat(latlngs[0])], L.extend({
                icon: L.icon({
                  iconUrl: 'libs/leaflet/images/M.png',
                  iconSize: [27, 37],
                  iconAnchor: [20, 20]
                })
              }))
              .on('click', markerClick)
              .addTo(map));
          })
        })

          //angular.forEach(scope.markers, function (o, k) {
          //  mks.push(L
          //    .marker([o.lat, o.lng], L.extend({
          //      icon: L.icon({
          //        iconUrl: 'libs/leaflet/images/M.png',
          //        iconSize: [27, 37],
          //        iconAnchor: [20, 20]
          //      })
          //    }, o))
          //    .on('click', markerClick)
          //    .addTo(map));
         // })

        map.on('zoomend', function (e) {
          var zoom = map.getZoom();

          if(zoom <=12) {
            mks.forEach(function (marker) {
              marker.setIcon(L.icon({
                iconUrl: 'libs/leaflet/images/M.png',
                iconSize: [27, 37],
                iconAnchor: [20, 20]
              }));
            })
          }
          else {
            mks.forEach(function (marker) {
              marker.setIcon(L.icon({
                iconUrl: 'libs/leaflet/images/M.png',
                iconSize: [27, 37],
                iconAnchor: [20, 20]
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
