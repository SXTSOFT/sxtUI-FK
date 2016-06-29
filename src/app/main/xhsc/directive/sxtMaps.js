/**
 * Created by leshuangshuang on 16/4/18.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .directive('sxtMaps',sxtMapsDirective);

  /** @ngInject */
  function sxtMapsDirective($timeout,remote,markerCulster){
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
            zoom: 10,
            attributionControl: false
          }),
          layer = L.tileLayer('http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
            subdomains: "1234"
          });
        layer.addTo(map);
        var mks = [];
        remote.Project.getMap().then(function(result){
          console.log('map',result);
          scope.markers=[];
          result.data.filter(function(item) {
            return !!item.Coordinate
          }).forEach(function(m) {
            var latlngs = m.Coordinate.split(',');
            scope.markers.push({
              projectId: m.ProjectID,
              title: m.ProjectName,
              lat: parseFloat(latlngs[1]),
              lng: parseFloat(latlngs[0]),
              center: function () {
                map.setView(new L.latLng([parseFloat(latlngs[1]), parseFloat(latlngs[0])]), 14)
              }
            })
          })
            //mks.push(L
            //  .marker([parseFloat(latlngs[1]), parseFloat(latlngs[0])], L.extend({
            //    icon: L.icon({
            //      iconUrl: 'libs/leaflet/images/M.png',
            //      iconSize: [27, 37],
            //      iconAnchor: [20, 20]
            //    }),
            //    projectId: m.ProjectID,
            //    title: m.ProjectName
            //  }))
            //  .on('click', markerClick)
            //  .addTo(map)
            //);
            var parentGroup = L.markerClusterGroup();
            angular.forEach(scope.markers, function (o, k) {
              var mk = L
                .marker([o.lat, o.lng], L.extend({
                  icon: L.icon({
                    iconUrl: 'libs/leaflet/images/M.png',
                    iconSize: [27, 37],
                    iconAnchor: [20, 20]
                  })
                }, o))
                .on('click', markerClick);
              mks.push(mk);
              parentGroup.addLayer(mk);

            });
            parentGroup.addTo(map);
        })
        map.on('zoomend', function (e) {
          var zoom = map.getZoom();
          console.log('zoom',zoom)
          if(zoom <10) {
            mks.forEach(function (marker) {
              marker.setIcon(L.icon({
                iconUrl: 'libs/leaflet/images/S1.png',
                iconSize: [17, 23],
                iconAnchor: [9, 9]
              }));
            })
          }else if(zoom<11){
            mks.forEach(function (marker) {
              marker.setIcon(L.icon({
                iconUrl: 'libs/leaflet/images/S.png',
                iconSize: [24, 27],
                iconAnchor: [12, 12]
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
        //console.log('e.target.options',e)
        scope.markerClick( {$current : e.target.options,pid: e.target.options.projectId, pname: e.target.options.title});

      }

    }
  }


})();
