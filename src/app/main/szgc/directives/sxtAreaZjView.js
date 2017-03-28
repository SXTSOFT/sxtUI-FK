/**
 * Created by jiuyuong on 2016/4/5.
 */
(function(){
  'use strict';
  angular
    .module('app.szgc')
    .directive('sxtAreaZjView',sxtAreaZjView);

  /** @ngInject */
  function sxtAreaZjView(api,sxt,tileLayer,$state){
    return {
      scope: {
        value:'=sxtAreaZjView'
      },
      link: function (scope, element, attrs, ctrl) {
        element.css('background','white');
        var map,layer,el;
        var ran = function () {
          if (!scope.value) return;
          var yjId = scope.value.itemId.split('>'),
            projectId = yjId[0];
          yjId = yjId[yjId.length - 1];
          api.szgc.FilesService.group(yjId).then(function (fs) {
            if (fs.data.Files.length == 0) return;
            map = L.map(element[0], {
              crs: L.extend({}, L.CRS, {
                projection: L.Projection.LonLat,
                transformation: new L.Transformation(1, 0, 1, 0),
                scale: function (e) {
                  return 256 * Math.pow(2, e);
                }
              }),
              center: [.4853, .5],
              zoom: 1,
              minZoom: 0,
              maxZoom: 3,
              scrollWheelZoom: true,
              annotationBar: false,
              zoomControl: false,
              attributionControl: false
            }),
              layer = tileLayer.tile({
                api: sxt.app.api,
                Id: fs.data.Files[0].Id,
                Url: fs.data.Files[0].Url.replace('/s_', '/')
              });
            layer.addTo(map);

            var drawnItems = L.featureGroup(),
              labels = L.featureGroup();

            map.addLayer(labels);
            map.addLayer(drawnItems);

            // api.szgc.addProcessService.getBatchRelation({
            //   //procedureId: $scope.project.procedureId,
            //   regionIdTree: scope.value.itemId,
            //   Status: 4
            //}).then(function (result) {
              scope.value.items.forEach(function (ly) {
              var geojson = JSON.parse(ly.GeoJSON),
                options = geojson.options;
              switch (geojson.geometry.type) {
                case 'Circle':
                  //console.log(options.radius,geojson.geometry);
                  layer = L.circle(L.GeoJSON.coordsToLatLng(geojson.geometry.coordinates), options.radius>1? options.radius/100000:options.radius, options);
                  break;
                default:
                  var layer = L.GeoJSON.geometryToLayer(geojson, options.pointToLayer, options.coordsToLatLng, options);
                  if (geojson.type =='Point' && options.icon && options.icon.options && options.icon.options.iconUrl) {
                    var iconOpt = options.icon.options;
                    layer.setIcon(this.options.icon? this.options.icon(iconOpt) : new L.Icon(iconOpt));
                    layer.options = L.Util.extend(geojson.options, layer.options);
                  }
                  layer.feature = L.GeoJSON.asFeature(geojson);
                  break;
              }
              layer.data = ly;
              drawnItems.addLayer(layer);
              //updateText(layer);
              layer.on('click', function (e) {
                openPopup(layer);
              })
            });
            //});
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
                icon: new L.LabelIcon({
                  html: layer.options.text,
                  color: layer.options.color,
                  iconAnchor: [(layer.options.text.length * 6), 12]
                }),
                saved: false,
                draggable: false,       // Allow label dragging...?
                zIndexOffset: 1000     // Make appear above other map features
              });
              ly.id = layer.options.id;
              labels.addLayer(ly);
              ly.on('click', function (e) {
                openPopup(layer);
              })

            }

            function openPopup(layer) {

              var popup = L.popup()
                .setLatLng(layer.getBounds().getCenter())
                .setContent('loading')
                .openOn(map);
              api.szgc.addProcessService.queryByProjectAndProdure3_1(projectId,{
                regionIdTree: scope.value.itemId + '>' + layer.data.Id,
                isGetChilde: 1
              }).then(function (result) {
                var conents = [];
                conents.push('<div class="yj"><strong>' + layer.data.RegionName + '</strong>');
                conents.push('<div><table style="width: 200px"><thead><tr><th>工序</th></tr></thead><tbody>');
                conents.push('</td></tr>');
                result.data.Rows.forEach(function (row) {
                  conents.push('<tr class="item" rid="'+row.Id+'" style="background: '+(row.JLDate && row.ZbDate?'rgba(0,150,136,1)':row.JLDate?'rgba(0,195,213,1)':row.ZbDate?'rgba(44,157,251,1)':'rgba(225,225,225,1)')+';color:'+(row.ECCheckResult==1||row.ECCheckResult==3?'red':'')+'"><td  style="white-space:normal">'+row.ProcedureName+'</td></tr>')
                })
                conents.push('</tbody></table></div>');
                conents.push('</div>');
                var el = $(conents.join(''))
                popup.setContent(el[0]);
                el.on('click','.item',function (e) {
                  var t = $(this);
                  $state.go('app.szgc.project.view',{bathid:t.attr('rid')});
                })
              });
            }
          });
        }
        scope.$watch('value', ran);
      }
    }
  }
})();
