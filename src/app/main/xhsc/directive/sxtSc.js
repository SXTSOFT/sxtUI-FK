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
          map = L.map(element[0],{
            crs: L.SXT.SXTCRS,
            center: [.3, .2],
            zoom: 2,
            minZoom: 0,
            maxZoom: 3,
            scrollWheelZoom: true,
            annotationBar: false,
            attributionControl: false
          });
        }
        if(!tile || tile.regionId!=scope.regionId) {
          if(tile)
            map.removeLayer(tile);
          tile = offlineTileLayer.offlineTile(scope.db +'/' + scope.imageUrl);
          //tile = L.tileLayer(sxt.app.api+'/Api/Picture/Tile/{z}_{x}_{y}?path=/fs/UploadFiles/Framework/'+ scope.imageUrl, {attribution: false,noWrap: true});
          tile.regionId = scope.regionId;
        }

        if(fg)
          map.removeLayer(fg);

        if(toolbar)
          map.removeControl(toolbar);

        map.addLayer(tile);

        fg = new L.SvFeatureGroup({
          onLoad:function(){
            var layer = this;
            if(layer.loaded)return;
            layer.loaded = true;
            data.findAll(function(o){
              return o.CheckRegionID==scope.regionId
               && o.AcceptanceItemID==scope.acceptanceItem
               && !!scope.measureIndexes.find(function(m){
                  return m.AcceptanceIndexID == o.AcceptanceIndexID;
                });
            }).then(function(r){
              fg.data = r.rows;
              points.findAll(function(o){
                return r.rows.find(function(i){
                  return i.MeasurePointID == o._id;
                })!=null;
              }).then(function(p){
                //fg.addLayer(p);
                p.rows.forEach(function(geo){
                  layer.addData(geo.geometry);
                })
              })
            });
          },
          onUpdate:function(layer,isNew,group){
            var point = layer.toGeoJSON();
            point = {
              _id:point.properties.$id,
              geometry:point
            };
            points.addOrUpdate(point);
            if(isNew){
              scope.measureIndexes.forEach(function (m) {
                var v = {
                  _id:sxt.uuid(),
                  RecordType:4,
                  RelationID:scope.db,
                  MeasurePointID:point._id,
                  CheckRegionID:scope.regionId,
                  RegionType:scope.regionType,
                  AcceptanceItemID:scope.acceptanceItem,
                  AcceptanceIndexID:m.AcceptanceIndexID
                };
                v.MeasureValueId = v._id;
                data.addOrUpdate(v);
                fg.data.push(v);
              })
            }
            if(group){
              var groupId = group.getValue().$id,//添加或移出的groupId
                measureIndexs = xhUtils.findAll(scope.measureIndexes,function (m) {
                  return m.QSKey=='3'||m.QSKey=='4';
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
          onUpdateData:function(context,updates,scope){
            updates.forEach(function(m){
              if(!m.v)return;
              if(!m.v._id){
                m.v = angular.extend({
                  _id:sxt.uuid(),
                  RelationID:scope.db,
                  RecordType:4,
                  MeasurePointID:scope.context.layer._value.$id,
                  CheckRegionID:scope.regionId,
                  RegionType:scope.regionType,
                  AcceptanceItemID:scope.acceptanceItem,
                  AcceptanceIndexID:m.AcceptanceIndexID
                },m.v);
                m.v.MeasureValueId = m.v._id;
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
        }).addTo(map);
        toolbar = new L.Control.Draw({
          featureGroup:fg,
          group:{
            lineGroup: !!scope.measureIndexes.find(function (m) {
              return m.QSKey=='3'
            }),
            areaGroup:!!scope.measureIndexes.find(function (m) {
              return m.QSKey=='4'
            })
          }
        }).addTo(map);
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
