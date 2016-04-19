/**
 * Created by jiuyuong on 2016/4/12.
 */
(function(){
  'use strict';
  angular
    .module('app.xhsc')
    .directive('sxtScMap',sxtScMap);
  /** @ngInject */
  function sxtScMap($timeout,mapPopupSerivce,remote,$q,sxt){

    return {
      scope:{
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
        uploading:false,
        t:null,
        t1:null,
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
        updateData:function(data){
          var self = this;
          self.tips('正在保存测量值……');
          data.ParentMeasurePointID = data.$groupId;
          data.MeasurePointID = data.$id;
          remote.ProjectQuality.MeasureValue.create([data]).then(function(r){
            if(r.data.ErrorCode==0) {
              self.tips('已保存测量值。');
            }
            else{
              self.tips(r.data.ErrorMessage);
            }
          })
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
          $q.all([defer,defer2]).then(function(rs){
            var ps = [];
            rs[1].data.forEach(function(value){
              rs[0].data.forEach(function(f){
                if(f.properties.$id==value.MeasurePointID && value.AcceptanceIndexID==scope.measureIndexes[scope.currentIndex].AcceptanceIndexID){
                  value.seq = value.MeasurPointName;


                  if(f.geometry.type =='Stamp' && !value.color) {
                    options.setColor(value);
                    f.options && (f.options.color = value.color);
                  }
                  angular.extend(f.properties,value);
                  ps.push(f);
                }
              });
            });
            layer.addData(ps);
          });

        },
        onUpdateData:function(context){
          var value = context.layer.getValue();
          this.onUpdateD(value);
          this.setColor(value);
          context.layer.updateValue && context.layer.updateValue(scope.value);
        },
        onUpdateD:function(value){
          value.AcceptanceItemID = scope.acceptanceItem;
          value.CheckRegionID = scope.regionId;
          value.AcceptanceIndexID = scope.measureIndexes[scope.currentIndex].AcceptanceIndexID;
          value.RegionType = scope.regionType;
          value.MeasureValueId = value.MeasureValueId||sxt.uuid();
          value.ParentMeasurePointID = value.$groupId;
          value.MeasurePointID = value.$id;
          value.MeasurPointName = value.seq;
          value.MeasurPointType = 0;
          remoteS.updateData(value);
        },
        setColor:function(v){
          if(!v || ((!v.CalculatedValue) && v.CalculatedValue!==0)) {
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
          else if((v.CalculatedValue||v.CalculatedValue===0)){
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
        onUpdate:function(layer,isNew){
          var v = layer.getValue();
          this.setColor(v);
          layer.updateValue && layer.updateValue(v);
          remoteS.update(layer.toGeoJSON());
          if(isNew){
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
