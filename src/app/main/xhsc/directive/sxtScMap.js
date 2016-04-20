/**
 * Created by jiuyuong on 2016/4/12.
 */
(function(){
  'use strict';
  angular
    .module('app.xhsc')
    .directive('sxtScMap',sxtScMap);
  /** @ngInject */
  function sxtScMap($timeout,mapPopupSerivce,remote,$q,sxt,xhUtils){

    return {
      scope:{
        areaId:'=',
        acceptanceItem:'=',
        measureIndexes:'=',
        currentIndex:'=',
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
      var remoteS = {
        buff:[],
        buff2:[],
        uploading:false,
        t:null,
        t1:null,
        t2:null,
        replaceData:function(data){
          var self = this;
          for(var i= 0,l=self.buff.length;i<l;i++) {
            if (self.buff[i].properties.$id == data.properties.$id) {
              self.buff[i] = data;
              return true;
            }
          }
          return false;
        },
        update:function(data){
          var self = this;
          if(!self.replaceData(data))
            self.buff.push(data);

          if(!self.t){
            self.t = $timeout(function(){
              self.t = null;
              var updates = self.buff;
              self.buff=[];
              self.tips('正在保存测量点……');
              remote.ProjectQuality.MeasurePoint.create(updates).then(function(r){
                if(r.data.ErrorCode==0) {
                  self.tips('已保存测量点。');
                }
                else{
                  self.tips(r.data.ErrorMessage);
                }
              })
            },500);
          }
        },
        replaceData2:function(data){
          var self = this;
          for(var i= 0,l=self.buff2.length;i<l;i++) {
            if (self.buff2[i].$id == data.$id) {
              self.buff2[i] = data;
              return true;
            }
          }
          return false;
        },
        updateData:function(data){
          var self = this;
          if(!self.replaceData2(data))
            self.buff2.push(data);

          if(!self.t2){
            self.t2 = $timeout(function(){
              self.t2 = null;
              var updates = self.buff2;
              self.buff2=[];
              self.tips('正在保存测量值……');
              //data.ParentMeasurePointID = data.$groupId;

              remote.ProjectQuality.MeasureValue.create(updates).then(function(r){
                if(r.data.ErrorCode==0) {
                  self.tips('已保存测量值。');
                }
                else{
                  self.tips(r.data.ErrorMessage);
                }
              });
            },500);
          }

          //remoteS.updateData
         // console.log('update value',data);
        },
        delete:function(data){
          var self = this;
          self.tips('正在删除测量点……');
          remote.ProjectQuality.MeasureValue.delete(data.properties.MeasureValueId).then(function(){
            self.tips('已删除测量点。');
          });
          //console.log('delete layer',data);
        },
        tips:function(tp){
          scope.tips = tp;
          if(this.t1)
            $timeout.cancel(this.t1);
          this.t1=$timeout(function(){
            scope.tips = '';
          },1500)
        }
      }
      var points={},
        options = {
        onLoad:function(){
          var layer = this;
          if(layer.loaded)return;
          layer.loaded = true;
          var defer = points[scope.acceptanceItem+scope.regionId],
            defer2 = points[scope.acceptanceItem+scope.regionId+'2'];
          if(!defer)
            defer = points[scope.acceptanceItem+scope.regionId] =
              remote.ProjectQuality.MeasurePoint.query(scope.acceptanceItem,scope.regionId,scope.regionType,0);
          if(!defer2)
            defer2 = points[scope.acceptanceItem+scope.regionId+'2'] =
              remote.ProjectQuality.MeasureValue.query(scope.acceptanceItem,scope.regionId,scope.regionType,0);
          remoteS.tips('正在加载点数据……');
          $q.all([defer,defer2]).then(function(rs){
            var ps = [];
            rs[1].data.forEach(function(value){
              rs[0].data.forEach(function(f){
                if(f.properties.$id==value.MeasurePointID && value.AcceptanceIndexID==scope.measureIndexes[scope.currentIndex].AcceptanceIndexID){
                  value.seq = value.MeasurPointName||value.seq;


                  if(f.geometry.type =='Stamp' && !value.color) {
                    options.setColor(value);
                    f.options && (f.options.color = value.color);
                  }
                  angular.extend(f.properties,value);
                  ps.push(f);
                }
              });
            });

            remoteS.tips('加载完毕');

              var idx = scope.measureIndexes.find(function(m){return m.AcceptanceIndexID==layer.options.acceptanceIndexID;});
              if(idx && idx.QSKey=='5'){
                remoteS.tips('正在加载上层数据……');
                xhUtils.getRegion(scope.areaId,function(r){
                  var find = r.find(scope.regionId);
                  if(find) {
                    var ix = find.$parent.Children.indexOf(find);
                    var prev = find.$parent.prev();
                    if (prev)
                      prev = prev.Children[ix];
                    if(prev) {
                      $q.all([remote.ProjectQuality.MeasurePoint.query(scope.acceptanceItem, prev.RegionID, scope.regionType, 0),
                          remote.ProjectQuality.MeasureValue.query(scope.acceptanceItem, prev.RegionID, scope.regionType, 0)])
                        .then(function (rs) {
                          //var ps2 = [];
                          rs[1].data.forEach(function(value){
                            rs[0].data.forEach(function(f){
                              if(f.properties.$id==value.MeasurePointID && value.AcceptanceIndexID==scope.measureIndexes[scope.currentIndex].AcceptanceIndexID) {
                                value.seq = value.MeasurPointName || value.seq;
                                value.CheckRegionID = prev.RegionID;
                                value.MeasurePointID = f.properties.MeasurePointID;
                                var to = ps.find(function (p) {
                                  return p.properties.$id == f.properties.$id;
                                })
                                if (to) {
                                  to.properties.Prev = value;
                                }
                                else {
                                  angular.extend(f.properties, {
                                    CheckRegionID:scope.regionId,
                                    RegionType:scope.regionType,
                                    MeasureValueId:sxt.uuid(),
                                    Prev: value
                                  });
                                  ps.push(f);
                                }
                              }
                              remoteS.tips('加载上层完毕');
                              layer.addData(ps);
                            });
                          });
                        });
                    }
                  }
                });
              }
            else{
              layer.addData(ps);
            }
          });

        },
        onUpdateData:function(context){
          var value = context.layer.getValue();
          this.onUpdateD(value);
          if(value.Prev &&(( !value.Prev.CalculatedValue && value.CalculatedValue)||value.Prev.NeedUpload)){
            value.Prev.NeedUpload = true;
            value.Prev.CalculatedValue = value.CalculatedValue;
            value.Prev.AcceptanceItemID = value.AcceptanceItemID;
            value.Prev.MeasurPointName = value.MeasurPointName;
            value.Prev.MeasurPointType = value.MeasurPointType;
            value.Prev.RegionType = value.RegionType;
            remoteS.updateData(value.Prev);
          }
          this.setColor(value);
          context.layer.updateValue && context.layer.updateValue(scope.value);
        },
        onUpdateD:function(value){
          value.AcceptanceItemID = scope.acceptanceItem;
          value.CheckRegionID = scope.regionId;
          value.AcceptanceIndexID = scope.measureIndexes[scope.currentIndex].AcceptanceIndexID;
          value.RegionType = scope.regionType;
          value.MeasureValueId = value.MeasureValueId||sxt.uuid();
          //value.ParentMeasureValueID = value.$groupId;
          value.MeasurePointID = value.$id;
          value.MeasurPointName = value.seq;
          value.MeasurPointType = 0;
          remoteS.updateData(value);
        },
        setColor:function(v){
          if(!v || ((!v.MeasureValue) && v.MeasureValue!==0)) {
            v.color = '#9E9E9E';
          }
          else if(v.MeasureStatus==1){
            v.color = '#4CAF50';
          }
          else if(v.MeasureStatus==2){
            v.color = '#FFEB3B';
          }
          else if(v.MeasureStatus==3){
            v.color = '#F44336';
          }
          else if((v.MeasureValue||v.MeasureValue===0)){
            v.color = '#4CAF50';
          }
        },
        onPopup:function(e){
          if(e.layer instanceof L.Stamp
          || e.layer instanceof L.AreaGroup
          || e.layer instanceof L.LineGroup)
          var edit = mapPopupSerivce.get('mapPopup');
          if(edit) {
            //e.layer._value.seq =
            edit.scope.context = e;
            edit.scope.readonly = scope.readonly;
            edit.scope.apply && edit.scope.apply();
            return edit.el[0];
          }
        },
        onUpdate:function(layer,isNew,isGroup){
          var v = layer.getValue();
          this.setColor(v);
          layer.updateValue && layer.updateValue(v);
          remoteS.update(layer.toGeoJSON());
          if(isNew || isGroup){
            if(isGroup) {
              v.ParentMeasureValueID = isGroup === true ? null : isGroup.getValue().MeasureValueId;
            }
            this.onUpdateD(v);
          }
        },
        onDelete:function(layer){
          remoteS.delete(layer.toGeoJSON());
        }
      },project,tile;
      var install = function(){
        if(!scope.measureIndexes || !scope.regionId)return;
        if(!project){
          project = scope.project = new L.SXT.Project (element[0], {
            map: {
              map: {}
            }
          });
        }
        if(tile)
          project._map.removeLayer(tile);
        tile = L.tileLayer(sxt.app.api+'/Api/Picture/Tile/{z}_{x}_{y}?path=/fs/UploadFiles/Framework/'+ scope.imageUrl, {attribution: false,noWrap: true});
        project._map.addLayer(tile);

        var featureGroups= {};
        scope.measureIndexes.forEach(function(m){
          var id = scope.regionId+m.AcceptanceIndexID;
          if(project._featureGroups[id])return;
          var g = featureGroups[id] = angular.copy(m);
          g.options = angular.copy(options);
          g.options.regionId = scope.regionId;
          g.options.acceptanceIndexID = m.AcceptanceIndexID;
          g.options.regionName = scope.regionName;
          g.toolbar = {
            draw:{},
            group:{
              lineGroup: m.QSKey=='3',
              areaGroup:m.QSKey=='4'
            }
          };
          if(scope.readonly==true){
            g.toolbar.draw =false;
            g.toolbar.group =false;
          }
        });

        project.registerGroups(featureGroups);
        project.swipeFeature(scope.regionId+scope.measureIndexes[scope.currentIndex].AcceptanceIndexID);
      }
      $timeout(function() {
        scope.$watchCollection('measureIndexes', function () {
          install();
        });
        scope.$watch('regionId',function(){
          install();
        });
        scope.$watch('currentIndex',function(){
          if(project){
            project.swipeFeature(scope.regionId+scope.measureIndexes[scope.currentIndex].AcceptanceIndexID);
          }
        })
      },500);

    }
  }
})();
