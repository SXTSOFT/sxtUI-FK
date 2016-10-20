/**
 * Created by jiuyuong on 2016/4/5.
 */
(function(){
  'use strict';
  angular
    .module('app.szgc')
    .directive('sxtAreaYjAdd',sxtAreaYjAdd);

  /** @ngInject */
  function sxtAreaYjAdd($timeout,$rootScope,api,sxt,$state,$http,tileLayer){
    return {
      scope: {
        values:'=sxtAreaYjAdd',
        project:'=',
        roleId:'='
      },
      link: function (scope, element, attrs, ctrl) {
        var map,layer,el;
        var ran = function () {
          if(!scope.values || !scope.project || !scope.project.pid) return;
          api.szgc.FilesService.group(scope.project.pid).then(function (fs) {
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
              zoomControl: false,
              attributionControl: false
            }),
              layer = tileLayer.tile({api:sxt.app.api,Url:fs.data.Files[0].Url});
            layer.addTo(map);

            var drawnItems = L.featureGroup(),
              labels = L.featureGroup();

            map.addLayer(labels);
            map.addLayer(drawnItems);

            scope.values.forEach(function (ly) {
              var geojson = JSON.parse(ly.geoJSON),
                options = geojson.options;
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
                  color: layer.options.color,
                  iconAnchor: [(layer.options.text.length*6), 12]
                }),
                saved: false,
                draggable: false,       // Allow label dragging...?
                zIndexOffset: 1000     // Make appear above other map features
              });
              ly.id = layer.options.id;
              labels.addLayer(ly);
              ly.on('click',function (e) {
                openPopup(layer);
              })

            }
            function openPopup(layer) {
              var batchs = layer.data.batchs;
              var conents = [];
              conents.push('<div class="yj">');
              if(batchs.length){
                conents.push('<div><table><thead><tr><th>批</th><th>状态</th><th>操作</th></tr></thead><tbody>');
              }
              batchs.forEach(function(r){
                conents.push('<tr><td>'+r.BatchNo+'</td><td>'+r.stateName+'</td><td><div class="office" ng-if="'+!layer.data.hasTasks+'">\
                  <a class="btn btn-white btn-xs goto">'+(scope.roleId=='zb'?'录入':'复验')+'</a></div>\
                   </td></tr><div>'+'已验未传'+'</div>')
              })
              if(batchs.length){
                conents.push('</tbody></table></div>')
              }
              conents.push('<button class="btn">新验收批</button></div>');
                el = $(conents.join(''));
              var popup = L.popup()
                .setLatLng(layer.getBounds().getCenter())
                .setContent(el[0])
                .openOn(map);
              el.on('click','.goto',function(){
                console.log('a')
              })
              el.on('click','button',function () {
                var item = layer.data,
                  project = scope.project;
                $state.go('app.szgc.ys.addnew',{
                  projectid:item.$id,
                  name:item.$name,
                  batchId:item.BatchRelationId,
                  procedureTypeId:project.procedureTypeId,
                  procedureId:project.procedureId,
                  type:project.type,
                  idTree:project.idTree,
                  procedureName:project.procedureName,
                  nameTree:project.nameTree,
                  checkRequirement:project.CheckRequirement
                });
                console.log('add',layer);
              })
              popup.layer = layer;
            }
          });
        }
        scope.$watch('values', ran);
      }
    }
  }
})();
