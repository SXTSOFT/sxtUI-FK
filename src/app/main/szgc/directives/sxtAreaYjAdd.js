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
              layer = tileLayer.tile({api:sxt.app.api,Id:fs.data.Files[0].Id,Url:fs.data.Files[0].Url.replace('/s_','/')});
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
              var l = 1;//batchs.length;
              if(l) {
                var conents = [];
                conents.push('<div class="yj"><strong>'+layer.data.name+'</strong>');
                conents.push('<div><table><thead><tr><th>批</th><th>状态</th><th>操作</th></tr></thead><tbody>');
                batchs.forEach(function (r) {
                  conents.push('<tr><td>' + r.BatchNo + '</td><td>' + r.stateName + '</td><td>');

                  if (r.hasTask) {
                    conents.push('已验未传')
                  }
                  else if (scope.project.roleId != '3rd' && r.ZbChecked !== false && scope.project.isPartner) {
                    conents.push('<a class="btn btn-white btn-xs zb" batch="'+r.Id+'">' + ((scope.project.roleId == 'zb' && !r.ZbCount) || (scope.project.roleId == 'jl' && !r.JLCount) ? '录入' : '复验') + '</a>')
                  }
                  else if (scope.project.roleId != '3rd' && !scope.project.isPartner && ((r.JLCount||0) + (r.WKCount||0) + (r.ZbCount||0))) {
                    conents.push('<a class="btn btn-white btn-xs zb" batch="'+r.Id+'">' + (r.CheckDate1 ? '复验' : '抽验') + '</a>')
                  }
                  else if (scope.project.roleId == '3rd') {
                    conents.push('<a class="btn btn-white btn-xs rd" batch="'+r.Id+'">抽验</a>')
                  }
                  conents.push('</td></tr>');
                })
                conents.push('</tbody></table></div>');
                if (scope.project.roleId != 'eg') {
                  conents.push('<button class="btn new">新验收批</button>');
                }
                conents.push('</div>')
                el = $(conents.join(''));
                var popup = L.popup()
                  .setLatLng(layer.getBounds().getCenter())
                  .setContent(el[0])
                  .openOn(map);
                el.on('click', '.goto', function () {
                  console.log('a')
                })
                el.on('click', 'button.new', function () {
                  var item = layer.data,
                    project = scope.project;
                  $state.go('app.szgc.ys.addnew', {
                    projectid: item.$id,
                    name: item.$name,
                    batchId: 'new',
                    procedureTypeId: project.procedureTypeId,
                    procedureId: project.procedureId,
                    type: project.type,
                    idTree: project.idTree,
                    procedureName: project.procedureName,
                    nameTree: project.nameTree,
                    flag: true,
                    project_item_id: item.project_item_id,
                    checkRequirement: project.CheckRequirement
                  });
                });
                el.on('click', 'a.zb', function (e) {
                  var item = layer.data,
                    project = scope.project,
                    Id = $(e.target).attr('batch');
                  $state.go('app.szgc.ys.addnew', {
                    projectid: item.$id,
                    name: item.$name,
                    batchId: Id,
                    procedureTypeId: project.procedureTypeId,
                    procedureId: project.procedureId,
                    type: project.type,
                    idTree: project.idTree,
                    procedureName: project.procedureName,
                    nameTree: project.nameTree,
                    checkRequirement: project.CheckRequirement
                  });
                })
                el.on('click', 'a.rd', function () {
                  var item = layer.data,
                    project = scope.project,
                    Id = $(e.target).attr('batch');;
                  $state.go('app.szgc.ys.addnew', {
                    projectid: item.$id,
                    name: item.$name,
                    batchId: Id || '',
                    procedureId: project.procedureId,
                    type: project.type,
                    idTree: project.idTree,
                    procedureName: project.procedureName,
                    nameTree: project.nameTree,
                    procedureTypeId: project.procedureTypeId,
                    checkRequirement: project.CheckRequirement
                  });
                })
                popup.layer = layer;
              }
              else{
                var item = layer.data,
                  project = scope.project;
                $state.go('app.szgc.ys.addnew',{
                  projectid:item.$id,
                  name:item.$name,
                  batchId:'new',
                  procedureTypeId:project.procedureTypeId,
                  procedureId:project.procedureId,
                  type:project.type,
                  idTree:project.idTree,
                  procedureName:project.procedureName,
                  nameTree:project.nameTree,
                  flag:true,
                  project_item_id:item.project_item_id,
                  checkRequirement:project.CheckRequirement
                });
              }
            }
          });
        }
        scope.$watch('values', ran);
      }
    }
  }
})();
