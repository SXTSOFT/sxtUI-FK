/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .directive('sxtSc', sxtSc);

  /** @Inject */
  function sxtSc($timeout,mapPopupSerivce,db,$q,sxt,xhUtils){

    return {
      scope:{
        areaId:'=',
        acceptanceItem:'=',
        measureIndexes:'=',
        imageUrl:'=',
        regionId:'=',
        regionName:'=',
        tips:'=',
        project:'=',
        regionType:'=',
        readonly:'='
      },
      link:link
    }
    function link(scope,element,attr,ctrl){
      var map,tile,layer,toolbar,data = db('db_00001_sc'),points = db('db_00001_point');
      var install = function(){
        if(!scope.imageUrl || !scope.regionId || !scope.measureIndexes || !scope.measureIndexes.length)return;
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
          tile = L.tileLayer(sxt.app.api+'/Api/Picture/Tile/{z}_{x}_{y}?path=/fs/UploadFiles/Framework/'+ scope.imageUrl, {attribution: false,noWrap: true});
          tile.regionId = scope.regionId;
        }

        if(layer)
          map.removeLayer(layer);


        if(toolbar)
          map.removeControl(toolbar);


        map.addLayer(tile);

        layer = new L.SvFeatureGroup({
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
              layer.data = r.rows;
              points.findAll(function(o){
                return r.rows.find(function(i){
                  return i.MeasurePointID == o._id;
                })!=null;
              }).then(function(p){
                //layer.addLayer(p);
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
            console.log('layer',point);
          },
          onUpdateData:function(context,updates,scope){
            updates.forEach(function(m){
              data.addOrUpdate(m.v);
            });
            console.log('onUpdate',context,updates);
          },
          onPopup:function(e){
            if(e.layer instanceof L.Stamp
              || e.layer instanceof L.AreaGroup
              || e.layer instanceof L.LineGroup)
              var edit = mapPopupSerivce.get('mapPopup');
            if(edit) {
              //e.layer._value.seq =
              edit.scope.context = e;
              edit.scope.data = {
                measureIndexes:scope.measureIndexes,
                regionId:scope.regionId,
                project:scope.project,
                regionType:scope.regionType,
                acceptanceItem:scope.acceptanceItem,
                values:layer.data
              };
              edit.scope.readonly = scope.readonly;
              edit.scope.apply && edit.scope.apply();
              return edit.el[0];
            }
          }
        }).addTo(map);
        toolbar = new L.Control.Draw({
          featureGroup:layer
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
