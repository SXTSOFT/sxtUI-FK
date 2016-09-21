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
        var mks = [];
        remote.Project.getMap().then(function(result){
          var lgn=[22.604987,114.059852];
          if (result&&angular.isArray(result.data)&&result.data.length){
            var d=result.data[0].Coordinate;
            if (d){
               var arr=  d.split(',');
               lgn[0]=arr[1]?arr[1]:lgn[0];
               lgn[1]=arr[0]?arr[0]:lgn[1];
            }
          }
          //lgn.push(result&&angular.isArray(result.data)&&);
          var map = L.map(element[0], {
              center: lgn,
              zoom: 8,
              attributionControl: false
            }),
            layer = L.tileLayer('http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
              subdomains: "1234"
            });
          layer.addTo(map);
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
            var parentGroup = L.markerClusterGroup();
            angular.forEach(scope.markers, function (o, k) {
              var mk = L
                .marker([o.lat, o.lng], L.extend({
                  icon: L.icon({
                    iconUrl: 'assets/leaflet/css/images/M.png',
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
      }, 500)

      function markerClick(e){
        //console.log('e.target.options',e)
        scope.markerClick( {$current : e.target.options,pid: e.target.options.projectId, pname: e.target.options.title});

      }

    }
  }


})();
