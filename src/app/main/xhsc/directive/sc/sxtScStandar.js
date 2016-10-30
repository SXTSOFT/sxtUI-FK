/**
 * Created by lss on 2016/10/30.
 */
/**
 * Created by lss on 2016/7/25.
 */
/**
 * Created by jiuyuong on 2016/3/30.
 */
(function () {
  'use strict';

  angular
    .module('app.xhsc')
    .directive('sxtScStandar', sxtScStandar);

  /** @Inject */
  function sxtScStandar($timeout, mapPopupSerivce, db, sxt, xhUtils, pack, remote, utils, $q, api, $rootScope) {
    function now() {
      return new Date().toISOString();
    }

    return {
      scope: {
        acceptanceItem: '=',//实测项
        measureIndexes: '=', //实测指标
        drawing: '=',//图纸id
        readonly: '=',//只读
        tooltip: '='
      },
      link: link
    }

    function link(scope, element, attr, ctrl) {
      var map,  fg, toolbar;
      var install = function () {

        if (!scope.measureIndexes || !scope.measureIndexes.length)return;
        if (!map) {
          map = new L.SXT.Project(element[0]);
        }
        if(fg)
          map._map.removeLayer(fg);
        if(toolbar)
          map._map.removeControl(toolbar);
        var arr=[];

        $q.all(arr).then(function (res) {
          //图纸
          $timeout(function () {
            if (scope.drawing) {
              map.loadSvgXml(scope.Drawing.DrawingContent, {
                filterLine: function (line) {
                  line.attrs.stroke = 'black';
                  line.options = line.options || {};
                  line.attrs['stroke-width'] = line.attrs['stroke-width'] * 6;
                }
              });
              map.center();
              scope.tooltip = '';
            }
            else {
                utils.alert('未找到图纸,请与管理员联系!');
                scope.ct && (scope.ct.loading = false);
            }
          });
          //渲染几何点
          fg = new L.SvFeatureGroup({
            onLoad:function(){
              //function addData(layData,index,color){
              //  if(!layData.geometry && layData.Geometry){
              //    layData.geometry = JSON.parse(layData.Geometry.Geometry);
              //  }
              //  if(!layData.geometry) return;
              //  layData.geometry.options.color = color;
              //  layData.geometry.options.v = index;
              //  layData.geometry.options.seq = layData.geometry.properties.seq;
              //  layData.geometry.options.customSeq = true;
              //  layData.geometry.options.move = false;
              //  layData.CreateTime = moment(layData.CreateTime).toDate();
              //  layer.addData(layData.geometry);
              //}
            },
            onUpdate: function (layer, isNew, group) {
              //这里是修正用户点的位置,尽可能在最近点的同一水平或竖直线上
              if (layer instanceof L.Stamp) {
                var neaser = null,
                  p0 = layer.getLatLng();
                layer._fg.eachLayer(function (ly) {
                  if (ly != layer && ly instanceof L.Stamp) {
                    if (!neaser ||
                      Math.pow(neaser._latlng.lat - p0.lat, 2) + Math.pow(neaser._latlng.lng - p0.lng, 2) >
                      Math.pow(ly._latlng.lat - p0.lat, 2) + Math.pow(ly._latlng.lat - p0.lat, 2)) {
                      neaser = ly;
                    }
                  }
                });
                if (neaser) {
                  var p1 = neaser.getLatLng(),
                    point0 = neaser._map.latLngToLayerPoint(p0),
                    point1 = neaser._map.latLngToLayerPoint(p1),
                    radius = neaser._radius,
                    dx = Math.abs(point0.x - point1.x),
                    dy = Math.abs(point0.y - point1.y),
                    min = Math.min(dx, dy);
                  if (min < radius) {
                    if (dx < dy) {
                      p0.lng = p1.lng;
                    }
                    else {
                      p0.lat = p1.lat;
                    }
                    layer.setLatLng(p0);
                  }
                }
              }
              var point = layer.toGeoJSON();
              point = {
                _id: point.properties.$id,
                geometry: point
              };
              //points.addOrUpdate(point);
              if (group) {
                var groupId = group.getValue().$id,//添加或移出的groupId
                  measureIndexs = xhUtils.findAll(scope.measureIndexes, function (m) {
                    return m.QSKey == '4';
                  }),//需要区测量的指标
                  values = xhUtils.findAll(fg.data, function (d) {
                    return d.MeasurePointID == point._id && !!measureIndexs.find(function (m) {
                        return m.AcceptanceIndexID == d.AcceptanceIndexID;
                      });
                  });//相关操作记录值
                if (!point.geometry.properties.$groupId) {//清除groupId
                  values.forEach(function (v) {
                    v.ParentMeasureValueID = null;
                    data.addOrUpdate(v);
                  })
                }
                else {//添加或更改groupId
                  values.forEach(function (v) {
                    var parent = fg.data.find(function (m) {
                      return m.AcceptanceIndexID == v.AcceptanceIndexID && m.MeasurePointID == groupId;
                    });
                    v.ParentMeasureValueID = parent._id;
                    data.addOrUpdate(v);
                  });
                }
              }
              //如果是画区域,而区域内没有点的话,默认生成9点或5个点
              if (isNew && layer instanceof L.AreaGroup) {
                var p = null, b = layer.getBounds();
                fg.eachLayer(function (ly) {
                  if (p === null && ly instanceof L.Stamp) {
                    if (L.SvFeatureGroup.isMiddleNumber(b._southWest.lat, b._northEast.lat, ly._latlng.lat)
                      && L.SvFeatureGroup.isMiddleNumber(b._southWest.lng, b._northEast.lng, ly._latlng.lng)) {
                      p = ly;
                    }
                  }
                });
                if (p == null) {
                  var b = layer.getBounds(),
                    x1 = b._northEast.lat,
                    y1 = b._northEast.lng,
                    x2 = b._southWest.lat,
                    y2 = b._southWest.lng;
                  var ps = [], ps1 = [];
                  var offsetX = Math.abs(x2 - x1) / 8,
                    minX = Math.min(x2, x1),
                    offsetY = Math.abs(y2 - y1) / 8,
                    minY = Math.min(y2, y2);
                  for (var i = 1; i <= 3; i++) {
                    for (var j = 1; j <= 3; j++) {
                      ps.push([minX + offsetX * (i == 1 ? 1 : i == 2 ? 4 : 7), minY + offsetY * (j == 1 ? 1 : j == 2 ? 4 : 7)]);
                    }
                  }
                  ps1[0] = ps[0];
                  ps1[1] = ps[1];
                  ps1[2] = ps[2];
                  ps1[3] = ps[5];
                  ps1[4] = ps[8];
                  ps1[5] = ps[7];
                  ps1[6] = ps[6];
                  ps1[7] = ps[3];
                  ps1[8] = ps[4];
                  if (!scope.measureIndexes.find(function (m) {
                      return m.QSKey == '4' && m.QSOtherValue == '9'
                    }) && scope.measureIndexes.find(function (m) {
                      return m.QSKey == '4' && m.QSOtherValue == '5';
                    })) {
                    ps1.splice(7, 1);
                    ps1.splice(5, 1);
                    ps1.splice(3, 1);
                    ps1.splice(1, 1);
                  }
                  ps1.forEach(function (p) {
                    fg.addLayer(new L.Stamp(p), false);
                  });
                }
              }

            },
            onPopupClose: function (e) {

            },
            onUpdateData: function (context, updates, editScope) {

            },
            onDelete: function (layer) {
            },
            onPopup: function (e) {
              if (e.layer instanceof L.Stamp
                || e.layer instanceof L.AreaGroup
                || e.layer instanceof L.LineGroup)
                var edit = mapPopupSerivce.get('mapPopup');
              if (edit) {
                if (e.layer instanceof L.Stamp) {
                  $timeout(function () {
                    var center = fg._map.getCenter();
                    fg._map.setView([center.lat, e.layer._latlng.lng]);
                  }, 300);
                }
                ;
                edit.scope.context = e;

                edit.scope.data = {
                  measureIndexes: scope.measureIndexes,
                  regionId: scope.regionId,
                  regionType: scope.regionType,
                  acceptanceItem: scope.acceptanceItem,
                  values: fg.data?fg.data:[]
                };

                edit.scope.readonly = scope.readonly;
                edit.scope.apply && edit.scope.apply();
                return edit.el[0];
              }
            }
          }).addTo(map._map);
          toolbar = new L.Control.Draw({
            featureGroup: fg,
            group: {
              lineGroup: false,
              areaGroup: scope.measureIndexes.length && !!scope.measureIndexes.find(function (m) {
                return m.QSKey == '4'
              })
            }
          }).addTo(map._map);
        }).catch(function(r){

        });
      };
      $timeout(function () {
        scope.$watchCollection('measureIndexes', function () {
          install();
        });
      }, 500);
    }
  }
})();
