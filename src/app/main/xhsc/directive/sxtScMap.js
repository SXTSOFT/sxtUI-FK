/**
 * Created by jiuyuong on 2016/4/12.
 */
(function(){
  'use strict';
  angular
    .module('app.xhsc')
    .directive('sxtScMap',sxtScMap);
  /** @ngInject */
  function sxtScMap($timeout,mapPopupSerivce,remote,$q){
    function uuidfn(){
      var d = new Date().getTime();
      if(window.performance && typeof window.performance.now === "function"){
        d += performance.now();
      }
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
      });
      return uuid;
    }
    return {
      scope:{
        acceptanceItem:'=',
        measureIndexes:'=',
        currentIndex:'=',
        mapUrl:'=',
        regionId:'=',
        regionName:'=',
        tips:'=',
        project:'='
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
          remote.MeasurePoint.delete(data.$id).then(function(){
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
          var defer = points[scope.acceptanceItem+scope.regionId],
            defer2 = points[scope.acceptanceItem+scope.regionId+'2'];
          if(!defer)
            defer = points[scope.acceptanceItem+scope.regionId] =
              remote.ProjectQuality.MeasurePoint.query(scope.acceptanceItem,scope.regionId,0);
          if(!defer2)
            defer2 = points[scope.acceptanceItem+scope.regionId] =
              remote.ProjectQuality.MeasureValue.query(scope.acceptanceItem,scope.regionId,0);
          $q.all([defer,defer2]).then(function(rs){
            rs[1].data.forEach(function(value){
              rs[0].data.forEach(function(f){
                if(f.properties.$id==value.MeasurePointID){
                  angular.extend(f.properties,value);
                }
              });
            });

            layer.addData(rs[0].data);
          });

        },
        onUpdateData:function(value,measureIndex,popupScope){
          value.AcceptanceItemID = scope.acceptanceItem;
          value.CheckRegionID = scope.regionId;
          value.RegionType = 8;
          value.MeasureValueId = value.MeasureValueId||uuidfn();
          value.ParentMeasurePointID = value.$groupId;
          value.MeasurePointID = value.$id;
          remoteS.updateData(value);
        },
        onPopup:function(e){
          if(e.layer instanceof L.Stamp
          || e.layer instanceof L.AreaGroup
          || e.layer instanceof L.LineGroup)
          var edit = mapPopupSerivce.get('mapPopup');
          if(edit) {
            edit.scope.context = e;
            edit.scope.apply && edit.scope.apply();
            return edit.el[0];
          }
        },
        onUpdate:function(layer,isNew){
          remoteS.update(layer.toGeoJSON());
/*          console.log('current',layer._fg.options.properties);
          if(isNew){
            console.log('add layer',isNew,layer.toGeoJSON());
          }
          else {
            console.log ('update layer', isNew, layer.toGeoJSON ());
          }*/
        },
        onDelete:function(layer){
          //console.log('delete layer',layer.toGeoJSON());
          remoteS.delete(layer.toGeoJSON());
        }
      },project;
      var install = function(){
        if(!scope.measureIndexes || !scope.regionId)return;
        if(!project){
          project = scope.project = new L.SXT.Project (element[0], {
            map: {
              map: {}
            },
            tileLayers: {
              base: {
                url: 'http://vkde.sxtsoft.com/upload/hx_tile_{z}_{x}_{y}.png'
              }
            }
          });
        }
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
              lineGroup: m.PassYieldComputeMode=='3',
              areaGroup:m.PassYieldComputeMode=='4'
            }
          };
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
