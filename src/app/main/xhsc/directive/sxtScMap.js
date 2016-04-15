/**
 * Created by jiuyuong on 2016/4/12.
 */
(function(){
  'use strict';
  angular
    .module('app.xhsc')
    .directive('sxtScMap',sxtScMap);
  /** @ngInject */
  function sxtScMap($timeout,mapPopupSerivce,remote){
    return {
      scope:{
        measureIndexes:'=',
        currentIndex:'=',
        mapUrl:'=',
        regionId:'='
      },
      link:link
    }
    function link(scope,element,attr,ctrl){
      var remoteS = {
        buff:[],
        uploading:false,
        t:null,
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
              remote.ProjectQuality.MeasurePoint.create(updates).then(function(){
                console.log('update',updates);
              })
            },500);
          }
        },
        updateData:function(data){
          console.log('update value',data);
        },
        delete:function(data){
          console.log('delete layer',data);
        }
      }
      var options = {
        onUpdateData:function(value,measureIndex,popupScope){
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
          project = new L.SXT.Project (element[0], {
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
          g.options = options;
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
