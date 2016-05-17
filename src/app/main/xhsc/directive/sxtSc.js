/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .directive('sxtSc', sxtSc);

  /** @Inject */
  function sxtSc($timeout,mapPopupSerivce,db,offlineTileLayer,sxt,xhUtils,pack){
    var svgFiles = db('svgFiles');
    function now() {
      return new Date().toISOString();
    }
    return {
      scope:{
        db:'=',
        areaId:'=',
        acceptanceItem:'=',
        measureIndexes:'=',
        imageUrl:'=',
        regionId:'=',
        regionName:'=',
        regionType:'=',
        readonly:'='
      },
      link:link
    }
    function link(scope,element,attr,ctrl){
      var map,tile,fg,toolbar,data,points,pk;
      var install = function(){
        if(!scope.db || !scope.imageUrl || !scope.regionId || !scope.measureIndexes || !scope.measureIndexes.length)return;

        if(!pk)
          pk = pack.sc.up(scope.db);
        if(!data)
          data = pk.sc.db;
        if(!points)
          points = pk.point.db;

        if(!map){
          map = new L.SXT.Project(element[0]);
        }
        if(!tile || tile!=scope.regionId) {
          svgFiles.get('123').then(function (data) {
            map.loadSvgXml(data.svg,{
              filterLine:function (line) {
                //line.attrs.stroke = 'black';
                //line.attrs['stroke-width'] = line.attrs['stroke-width']*4;
              },
              filterText:function (text) {
                return false;
              }
            });
            map.center();
          });
          tile = scope.regionId;
        }

        if(fg)
          map._map.removeLayer(fg);

        if(toolbar)
          map._map.removeControl(toolbar);


        fg = new L.SvFeatureGroup({
          onLoad:function(){
            var layer = this;
            if(layer.loaded)return;
            layer.loaded = true;
            data.findAll(function(o){
              return o.CheckRegionID==scope.regionId
               && o.AcceptanceItemID==scope.acceptanceItem
               && !!scope.measureIndexes.find(function(m){
                  return m.AcceptanceIndexID == o.AcceptanceIndexID
                    ||(m.Children && m.Children.find(function (m1) {
                      return m1.AcceptanceIndexID == o.AcceptanceIndexID
                    }));
                });
            }).then(function(r){
              fg.data = r.rows;
              points.findAll(function(o){
                return r.rows.find(function(i){
                    if(i.MeasurePointID == o._id){
                      o.CreateTime = moment(i.CreateTime).toDate();
                      return true;
                    }
                  return false;
                })!=null;
              }).then(function(p){
                //fg.addLayer(p);
                p.rows.sort(function (p1,p2) {
                  return p1.CreateTime.getTime()-p2.CreateTime.getTime();
                })
                p.rows.forEach(function(geo){
                  layer.addData(geo.geometry);
                })
              })
            });
          },
          onUpdate:function(layer,isNew,group){
            if(layer instanceof L.AreaGroup){
              var b = layer.getBounds(),
                x1 = b._northEast.lat,
                y1 = b._northEast.lng,
                x2 = b._southWest.lat,
                y2 = b._southWest.lng;
              var ps = [],ps1=[];
              var offsetX = Math.abs(x2-x1)/8,
                minX = Math.min(x2,x1),
                offsetY = Math.abs(y2 - y1)/8,
                minY = Math.min(y2,y2);
              for(var i=1;i<=3;i++){
                for(var j=1;j<=3;j++){
                  ps.push([minX+offsetX*(i==1?1:i==2?4:7),minY+offsetY*(j==1?1:j==2?4:7)]);
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

              if(0){
                ps1.splice(7,1);
                ps1.splice(5,1);
                ps1.splice(3,1);
                ps1.splice(1,1);
              }
              //console.log(points);
              ps1.forEach(function (p) {
                fg.addLayer(new L.Stamp(p));
              })
            }
            //return;
            var point = layer.toGeoJSON();
            point = {
              _id:point.properties.$id,
              geometry:point
            };
            points.addOrUpdate(point);
            if(isNew){
              scope.measureIndexes.forEach(function (m) {
                var ms = [];
                if (m.Children && m.Children.length) {
                  m.Children.forEach(function (m1) {
                    ms.push(m1);
                  })
                }
                else {
                  ms.push(m);
                }
                console.log('ms',ms);
                ms.forEach(function (m) {
                  var v = {
                    _id: sxt.uuid(),
                    RecordType: 4,
                    CreateTime:now(),
                    RelationID: scope.db,
                    MeasurePointID: point._id,
                    CheckRegionID: scope.regionId,
                    RegionType: scope.regionType,
                    AcceptanceItemID: scope.acceptanceItem,
                    AcceptanceIndexID: m.AcceptanceIndexID
                  };
                  v.MeasureValueId = v._id;
                  data.addOrUpdate(v);
                  fg.data.push(v);
                });
              })
            }
            if(group){
              var groupId = group.getValue().$id,//添加或移出的groupId
                measureIndexs = xhUtils.findAll(scope.measureIndexes,function (m) {
                  return m.QSKey=='4';
                }),//需要组或区测量的指标
                values = xhUtils.findAll(fg.data,function (d) {
                  return d.MeasurePointID == point._id && !!measureIndexs.find(function (m) {
                      return m.AcceptanceIndexID==d.AcceptanceIndexID;
                    });
                });//相关操作记录值
              if(!point.geometry.properties.$groupId){//清除groupId
                values.forEach(function (v) {
                  v.ParentMeasureValueID = null;
                  data.addOrUpdate(v);
                })
              }
              else{//添加或更改groupId
                values.forEach(function (v) {
                  var parent = fg.data.find(function (m) {
                    return m.AcceptanceIndexID == v.AcceptanceIndexID && m.MeasurePointID==groupId;
                  });
                  v.ParentMeasureValueID = parent._id;
                  data.addOrUpdate(v);
                })
              }
            }
          },
          onPopupClose:function (e) {
            var self = this;
            var edit = mapPopupSerivce.get('mapPopup'),
              scope = edit.scope;
            if(scope.data && scope.isSaveData!==false){
              scope.isSaveData = false;
              self.options.onUpdateData(scope.context,scope.data.updates,scope);
            }
          },
          onUpdateData:function(context,updates,editScope){
            updates.forEach(function(m){
              if(!m.v)return;
              if(!m.v._id){
                m.v = angular.extend({
                  _id:sxt.uuid(),
                  CreateTime:now(),
                  RelationID:scope.db,
                  RecordType:4,
                  MeasurePointID:editScope.context.layer._value.$id,
                  CheckRegionID:scope.regionId,
                  RegionType:scope.regionType,
                  AcceptanceItemID:scope.acceptanceItem,
                  AcceptanceIndexID:m.m.AcceptanceIndexID
                },m.v);
                m.v.MeasureValueId = m.v._id;
              }
              if(m.v.values){ //组测量
                //m.v.MeasureValue = m.v.values[0];
                var childValues = fg.data.filter(function (item) {
                  return item.ParentMeasureValueID == m.v.MeasureValueId;
                }),ix=0;
                for(var k in m.v.values) {
                  if (isNaN(parseInt(k)))return;
                  var dv = m.v.values[k];
                  if (!dv)return;
                  var fd = childValues[ix++];
                  if (!fd) {
                    fd = {
                      _id: sxt.uuid(),
                      ParentMeasureValueID: m.v.MeasureValueId,
                      CreateTime: now(),
                      RelationID: scope.db,
                      RecordType: 4,
                      MeasurePointID: editScope.context.layer._value.$id,
                      CheckRegionID: scope.regionId,
                      RegionType: scope.regionType,
                      AcceptanceItemID: scope.acceptanceItem,
                      AcceptanceIndexID: m.m.AcceptanceIndexID,
                      Hide: true
                    };
                    fd.MeasureValueId = fd._id;
                  }
                  fd.MeasureValue = dv;
                  data.addOrUpdate(fd);
                }
              }
              data.addOrUpdate(m.v);
            });
          },
          onDelete:function (layer) {
            var id = layer.getValue().$id,
              values = xhUtils.findAll(fg.data,function (d) {
              return d.MeasurePointID == id && !!scope.measureIndexes.find(function (m) {
                  return m.AcceptanceIndexID==d.AcceptanceIndexID;
                });
            });
            points.delete(id);
            values.forEach(function (v) {
              data.delete(v._id);
            })
          },
          onPopup:function(e){
            if(e.layer instanceof L.Stamp
              || e.layer instanceof L.AreaGroup
              || e.layer instanceof L.LineGroup)
              var edit = mapPopupSerivce.get('mapPopup');
            if(edit) {
              //e.fg._value.seq =
              edit.scope.context = e;
              edit.scope.data = {
                measureIndexes:scope.measureIndexes,
                regionId:scope.regionId,
                regionType:scope.regionType,
                acceptanceItem:scope.acceptanceItem,
                values:fg.data
              };
              edit.scope.readonly = scope.readonly;
              edit.scope.apply && edit.scope.apply();
              return edit.el[0];
            }
          }
        }).addTo(map._map);
        toolbar = new L.Control.Draw({
          featureGroup:fg,
          group:{
            lineGroup: false,
            areaGroup:!!scope.measureIndexes.find(function (m) {
              return m.QSKey=='4'
            })
          }
        }).addTo(map._map);

      };
      $timeout(function(){
        scope.$watchCollection('measureIndexes',function(){
          install();
        });
        scope.$watch('regionId',function(){
          install();
        });
      },500);
    }
  }


})();
