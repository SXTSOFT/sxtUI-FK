/**
 * Created by emma on 2016/6/25.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .directive('sxtAreaShow',sxtAreaShowDirective);

  /**@ngInject*/
  function sxtAreaShowDirective($timeout,remote,sxt,ys7){
    return {
      scope:{
        projectId:'=',
        projectName:'='
      },
      link:link
    }
    function link(scope,element,attr,ctrl){

      var map,layer,dlg;
      var ran = function(){
        $timeout(function(){
          if(!scope.projectId) return;
          if (map && map.projectId == scope.projectId) return;
          if (map) map.remove();
          remote.Assessment.EngineeringProcess.getWorkingMap(scope.projectId).then(function(result){
            var project = result.data;
            //console.log('project',result.data)
            if(project.AreaImage){
              remote.Assessment.EngineeringProcess.getWorkingMapDetail(project.AreaImage).then(function(fs){
                if (fs.data.Files.length == 0) return;
                map = L.map(element[0], {
                  crs: L.extend({}, L.CRS, {
                    projection: L.Projection.LonLat,
                    transformation: new L.Transformation(1, 0, 1, 0),
                    scale: function (e) {
                      return 256 * Math.pow(2, e);
                    }
                  }),
                  center: [.48531902026005, .5],
                  zoom: 0,
                  minZoom: 0,
                  maxZoom: 3,
                  scrollWheelZoom: true,
                  annotationBar: false,
                  attributionControl: false
                }),
                  layer = L.tileLayer(sxt.app.api + '/Api/Picture/Tile/{z}_{x}_{y}?size=256&path=~/FileServer/UploadFiles/map.jpg', {
                    noWrap:true,
                    continuousWorld:false,
                    tileSize:256
                  });
                //console.log('picUrl',scope.picUrl)
                map.projectId = scope.projectId;
                layer.addTo(map);
                var feature = {"type":"FeatureCollection",
                  "features":[
                    {"type":"Feature","properties":{}, "geometry":{"type":"Polygon","coordinates":[[[0.76953125,0.330078125],[0.478515625,0.328125],[0.341796875,0.48046875],[0.4375,0.642578125],[0.55078125,0.638671875],[0.693359375,0.44921875],[0.76953125,0.330078125]]]},"options":{"stroke":true,"color":"#ff0000","dashArray":null,"lineCap":null,"lineJoin":null,"weight":4,"opacity":0.5,"fill":true,"fillColor":null,"fillOpacity":0.2,"clickable":true,"smoothFactor":1,"noClip":false}},
                    {"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[0.9296875,0.01953125],[0.103515625,0.015625],[0.08203125,0.056640625],[0.080078125,0.171875],[0.345703125,0.4453125],[0.455078125,0.31640625],[0.771484375,0.3125],[0.9296875,0.01953125]]]},"options":{"stroke":true,"color":"#ff9800","dashArray":null,"lineCap":null,"lineJoin":null,"weight":5,"opacity":0.5,"fill":true,"fillColor":null,"fillOpacity":0.2,"clickable":true,"smoothFactor":1,"noClip":false}}//,
                    //{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[0.345703125,0.44921875]},"options":{"icon":{"options":{"className":"","shadowUrl":null,"iconAnchor":[15,15],"iconSize":[30,30],"iconUrl":"/dp/libs/leaflet/images/photo.png","color":"#9c27b0"},"_initHooksCalled":true},"title":"","alt":"","clickable":true,"draggable":false,"keyboard":true,"zIndexOffset":0,"opacity":1,"riseOnHover":false,"riseOffset":250}},
                    //{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[0.498046875,0.31640625]},"options":{"icon":{"options":{"className":"","shadowUrl":null,"iconAnchor":[15,15],"iconSize":[30,30],"iconUrl":"/dp/libs/leaflet/images/photo.png","color":"#ff0000"},"_initHooksCalled":true},"title":"","alt":"","clickable":true,"draggable":false,"keyboard":true,"zIndexOffset":0,"opacity":1,"riseOnHover":false,"riseOffset":250}}
                  ]};
                var myIcon = L.icon({
                  iconUrl: 'assets/js/images/marker-icon-2x.png',
                  iconSize: [40, 40],
                  iconAnchor: [20, 20]
                });
                L.marker([0.345703125,0.44921875], {icon: myIcon}).addTo(map).on('click',function () {
                  ys7.getToken().then(function (token) {
                    sxt.plugin.playYs7([token,'d5576863efc74427a297d17d157b2843']);
                  });
                });
                L.marker([0.498046875,0.31640625], {icon: myIcon}).addTo(map).on('click',function () {
                  ys7.getToken().then(function (token) {
                    sxt.plugin.playYs7([token,'a231ce71fdd84b43a541526f2eb6cbec']);
                  });
                });;
                L.geoJson(feature).addTo(map);

/*                $(element).click(function(){
                  $state.go('app.xhsc.xxjd.xxjdbuildings',{projectId:scope.projectId,projectName:scope.projectName})
                });*/
              })
            }

          })
        },1000)
      }
      scope.$watch('projectId',ran);
      scope.$on('$destory',function(){

      })
    }
  }
})();
