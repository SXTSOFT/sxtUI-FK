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
    .directive('sxtScNew', sxtScNew);

  /** @Inject */
  function sxtScNew($timeout, mapPopupSerivce, db, sxt, xhUtils, scPack, remote, utils, $q, api, $rootScope) {
    var pack = scPack;

    function now() {
      return new Date().toISOString();
    }

    return {
      scope: {
        db: '=', //现场评估id
        areaId: '=', //分期
        acceptanceItem: '=',//实测项
        measureIndexes: '=', //实测指标
        imageUrl: '=',//图纸id
        regionId: '=',//区域
        regionName: '=',//区域名称
        regionType: '=',//区域类型
        readonly: '=',//只读
        tooltip: '='
      },
      link: link
    }

    function link(scope, element, attr, ctrl) {
      var map, tile, fg, toolbar, data, points, pk, scStandar;
      var parentIds = {};//标准批后,用于存放区域测量的父ID
      if (!pk)
        pk = pack.sc.up(scope.db);
      if (!data)
        data = pk.sc.db;
      if (!points)
        points = pk.point.db;

      var install = function () {

        if (!scope.db || !scope.regionId || !scope.measureIndexes || !scope.measureIndexes.length)return;
        if (!map) {
          map = new L.SXT.Project(element[0]);
        }
        if (fg)
          map._map.removeLayer(fg);
        if (toolbar)
          map._map.removeControl(toolbar);
        var ProjectID = scope.regionId.substr(0, 5);
        var areaId = scope.regionId.substr(0, 10);
        var arr = [
          remote.Project.getDrawingRelations(areaId, "scDrawingRelation")
        ];
        parentIds = {};//重置为空
        $q.all(arr).then(function (res) {
          var picRelate = res[0]
          //渲染图纸
          function findImg(source) {
            var result = source;
            var img = result.data.find(function (item) {
              return item.AcceptanceItemID == scope.acceptanceItem && item.RegionId == scope.regionId;
            });
            if (!img) {
              img = result.data.find(function (item) {
                return item.AcceptanceItemID == scope.acceptanceItem && scope.regionId.indexOf(item.RegionId) > -1;
              });
            }
            if (!img) {
              var img = result.data.find(function (item) {
                return item.RegionId == scope.regionId;
              });
            }
            return img;
          }
          var img = findImg(picRelate);
          function loadPic(img) {
            if (!tile || tile != scope.regionId) {
              $timeout(function () {
                if (img) {
                  remote.Project.getDrawing(img.DrawingID).then(function (result2) {
                    if (!result2.data || !result2.data.DrawingContent) {
                      scope.ct && (scope.ct.loading = false);
                      utils.alert('未找到图纸,请与管理员联系!(2)');
                      return;
                    }
                    map.loadSvgXml(result2.data.DrawingContent, {
                      filterLine: function (line) {
                        line.attrs.stroke = 'black';
                        line.options = line.options || {};
                        //line.options.color = 'black';

                        line.attrs['stroke-width'] = line.attrs['stroke-width'] * 6;
                      }
                    });
                    map.center();
                    scope.tooltip = '';
                  })
                }
                else {
                  if (!result.data.DrawingContent) {
                    utils.alert('未找到图纸,请与管理员联系!(1)');
                    scope.ct && (scope.ct.loading = false);
                  }
                }
              });
            }
            tile = scope.regionId;
          }
          //渲染几何点
          function historydata(layer, index) {
            var layer = layer;
            if (layer.loaded)return;
            layer.loaded = true;

            var reqArr = [
              remote.PQMeasureStandard.GetListByExtend(areaId.substr(0, 5), "standard"),
              data.findAll()
            ]
            $q.all(reqArr).then(function (req) {
              var t = req[0].data && req[0].data.data ? req[0].data.data : [];
              var points = [];
              // t.forEach(function (o) {
              //   if (!points.find(function (k) {
              //       return k.MeasurePointID == o.MeasurePointID;
              //     })) {
              //     points.push(o)
              //   }
              // });

              var msg = [];
              scope.measureIndexes.forEach(function (o) {
                if (!t.find(function (k) {
                    return o.AcceptanceIndexID == k.AcceptanceIndexID && k.DrawingID == img.DrawingID
                      && k.Status == 1;
                  })) {
                  msg.push(o.IndexName)
                }
              });
              if (msg.length) {
                $timeout(function () {
                  utils.alert("指标：" + msg.join(",") + "尚未标准化，请先做标准化处理!");
                })
                return;
              }


              loadPic(img);
              var u = req[1].rows;

              var po;

              function addData(layData, index, color) {
                if (!layData.geometry && layData.Geometry) {
                  layData.geometry = JSON.parse(layData.Geometry);
                }

                if (!layData.geometry) return;
                layData.geometry.options.color = color;
                layData.geometry.options.fill = true;
                layData.geometry.options.v = index;
                layData.geometry.options.seq = layData.geometry.properties.seq;
                layData.geometry.options.customSeq = true;
                layData.geometry.options.move = false;
                layData.CreateTime = moment(layData.CreateTime).toDate();
                layer.addData(layData.geometry);
              }

              if (t && t.length) {
                var g;
                t.forEach(function (m) {
                  if (m.DrawingID == img.DrawingID && scope.measureIndexes.find(function (n) {
                      return n.AcceptanceIndexID == m.AcceptanceIndexID
                    })&&!points.find(function (n) {
                    return n.MeasurePointID==m.MeasurePointID;
                  })) {
                    points.push(m);
                    var values = u.filter(function (v) {
                      return v.MeasureValue && m.MeasurePointID == v.MeasurePointID && v.CheckRegionID == scope.regionId &&
                        scope.measureIndexes.find(function (n) {
                          return n.AcceptanceIndexID == v.AcceptanceIndexID
                        })
                    });
                    var color = values.length == scope.measureIndexes.length ? 'blue' : 'red';
                    addData(m, index, color);
                    index++;
                  }
                });
              }
            });
          }

          function currentdata(layer, index) {
            var _r = function (o) {  //过滤值
              if (o.AcceptanceItemID == scope.acceptanceItem && scope.measureIndexes.length
                && !!scope.measureIndexes.find(function (m) {
                  return m.AcceptanceIndexID == o.AcceptanceIndexID
                    || (m.Children && m.Children.find(function (m1) {
                      return m1.AcceptanceIndexID == o.AcceptanceIndexID
                    }));
                })) {
                if (o.CheckRegionID == scope.regionId) {
                  return true;
                }
              }
              return false;
            }
            data.findAll(function (o) {
              return _r(o);
            }).then(function (r) {
              points.findAll(function (o) {
                return r.rows.find(function (i) {
                    if (i.MeasurePointID == o._id || i.MeasurePointID == o.MeasurePointID) {
                      if (r.rows.find(function (i) {
                          return ((i.MeasurePointID == o._id || i.MeasurePointID == o.MeasurePointID) && i.MeasureValue || i.MeasureValue === 0)
                        })) {
                        o.geometry.options.color = 'blue';
                      }
                      else {
                        o.geometry.options.color = 'red';
                      }
                      o.geometry.options.v = index;
                      o.geometry.options.seq = o.geometry.properties.seq;
                      o.geometry.options.customSeq = true;
                      o.CreateTime = moment(o.CreateTime).toDate();
                      index++;
                      return true;
                    }
                    return false;
                  }) != null;
              }).then(function (p) {
                fg.data = r.rows.filter(function (row) {
                  return row.CheckRegionID == scope.regionId;
                });
                p.rows.sort(function (p1, p2) {
                  return p1.CreateTime.getTime() - p2.CreateTime.getTime();
                });
                p.rows.forEach(function (geo) {
                  layer.addData(geo.geometry);
                });
              })
            }).catch(function (r) {
            });
          }

          fg = new L.SvFeatureGroup({
            onLoad: function () {
              var index = 0;
              historydata(this, index);
              currentdata(this, index);
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
              // points.addOrUpdate(point);
              if (isNew || !fg.data.find(function (d) {
                  return d.MeasurePointID == point._id;
                })) {
                scope.measureIndexes.forEach(function (m) {
                  var ms = [];
                  if (m.Children && m.Children.length) {
                    m.Children.forEach(function (m1) {
                      ms.push(m1);
                    });
                  }
                  else {
                    ms.push(m);
                  }
                  ms.forEach(function (m) {
                    var v = {
                      _id: sxt.uuid(),
                      RecordType: 1,
                      CreateTime: now(),
                      RelationID: scope.db,
                      MeasurePointID: point._id,
                      DrawingID: scope.imageUrl,
                      CheckRegionID: scope.regionId,
                      RegionType: scope.regionType,
                      AcceptanceItemID: scope.acceptanceItem,
                      AcceptanceIndexID: m.AcceptanceIndexID
                    };
                    v.MeasureValueId = v._id;
                    data.addOrUpdate(v);
                    fg.data = fg.data ? fg.data : [];
                    fg.data.push(v);
                    //实测标准化
                  });
                })
              }

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
              var self = this;
              var edit = mapPopupSerivce.get('mapPopup'),
                scope = edit.scope;
              if (scope.data && scope.isSaveData !== false) {
                scope.isSaveData = false;
                self.options.onUpdateData(scope.context, scope.data.updates, scope);
                if (scope.data.updates.find(function (m) {
                    return m.v && (m.v.MeasureValue || m.v.MeasureValue === 0);
                  })) {
                  scope.context.layer.setStyle({
                    color: 'blue'
                  });
                }
                else {
                  scope.context.layer.setStyle({
                    color: 'red'
                  });
                }
              }
            },
            onUpdateData: function (context, updates, editScope) {

              //如果有
              updates.forEach(function (m) {

                if (!m.v)return;
                var pid;
                if(editScope.context.layer._value.$groupId) {
                  var pidKey = m.m.AcceptanceIndexID + editScope.context.layer._value.$groupId;
                  pid = parentIds[pidKey];
                  var p1 = fg.data.find(function (t) {
                    return t.MeasurePointID == editScope.context.layer._value.$groupId
                    && t.AcceptanceIndexID == m.m.AcceptanceIndexID;
                  });
                  if(p1)
                    pid = parentIds[pidKey] = p1._id;

                  if(!pid){ //如果原来有值,使用原来的值,原来没有,生成新的parentId,不能用$groupId,因为它是模板化,会很多

                    pid = parentIds[pidKey] = m.v.ParentMeasureValueID ||sxt.uuid();
                    var pt = {
                      _id: pid,
                      MeasureValueId:pid,
                      CreateTime: now(),
                      RelationID: scope.db,
                      RecordType: 1,
                      DrawingID: scope.imageUrl,
                      MeasurePointID: editScope.context.layer._value.$groupId,
                      CheckRegionID: scope.regionId,
                      RegionType: scope.regionType,
                      AcceptanceItemID: scope.acceptanceItem,
                      AcceptanceIndexID: m.m.AcceptanceIndexID
                    };
                    fg.data.push(pt);
                    data.addOrUpdate(pt);//添加组的值
                  }
                }
                if (!m.v._id) {
                  m.v = angular.extend({
                    _id: sxt.uuid(),
                    CreateTime: now(),
                    RelationID: scope.db,
                    RecordType: 1,
                    DrawingID: scope.imageUrl,
                    MeasurePointID: editScope.context.layer._value.$id,
                    CheckRegionID: scope.regionId,
                    RegionType: scope.regionType,
                    AcceptanceItemID: scope.acceptanceItem,
                    AcceptanceIndexID: m.m.AcceptanceIndexID,
                    ParentMeasureValueID:pid
                  }, m.v);
                  m.v.MeasureValueId = m.v._id;
                  fg.data.push(m.v);
                }
                if (m.v.values) {
                  var minV = 1000000, maxV = -1000000, vs = [];
                  for (var k in m.v.values) {
                    var v = m.v.values[k];
                    if (m.v.values.hasOwnProperty(k) && v) {
                      minV = Math.min(minV, v);
                      maxV = Math.max(maxV, v);
                      vs.push(v);
                    }
                  }
                  ;
                  m.v.CreateTime = now();
                  m.v.MeasureValue = maxV;
                  m.v.DesignValue = minV;
                  m.v.ExtendedField1 = vs.join(',');
                }
                console.log('data.addOrUpdate', m.v);
                data.addOrUpdate(m.v);

              });
            },
            onDelete: function (layer) {
              var id = layer.getValue().$id,
                values = xhUtils.findAll(fg.data, function (d) {
                  return d.MeasurePointID == id && !!scope.measureIndexes.find(function (m) {
                      return m.AcceptanceIndexID == d.AcceptanceIndexID;
                    });
                });
              points.delete(id);
              values.forEach(function (v) {
                data.delete(v._id);
              })
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
                  values: fg.data ? fg.data : []
                };

                edit.scope.readonly = scope.readonly;
                edit.scope.apply && edit.scope.apply();
                return edit.el[0];
              }
            }
          }).addTo(map._map);
        }).catch(function (r) {

        });
      };
      $timeout(function () {
        scope.$watchCollection('measureIndexes', function () {
          install();
        });
        scope.$watch('regionId', function () {
          install();
        });
      }, 500);
    }
  }
})();
