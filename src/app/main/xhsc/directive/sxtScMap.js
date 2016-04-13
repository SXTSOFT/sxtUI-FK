/**
 * Created by jiuyuong on 2016/4/12.
 */
(function(){
  'use strict';
  angular
    .module('app.xhsc')
    .directive('sxtScMap',sxtScMap);
  /** @ngInject */
  function sxtScMap($timeout,mapPopupSerivce){
    return {
      scope:{
        measureIndexs:'=',
        currentIndex:'=',
        mapUrl:'='
      },
      link:link
    }
    function link(scope,element,attr,ctrl){
      var options = {
        onPopup:function(e){
          var edit = mapPopupSerivce.get('mapPopup');
          if(edit) {
            edit.scope.context = e;
            edit.scope.apply && edit.scope.apply();
            return edit.el[0];
          }
        },
        onUpdate:function(layer,isNew){
          console.log('current',layer._fg.options.properties);
          if(isNew){
            console.log('add layer',isNew,layer.toGeoJSON());
          }
          else {
            console.log ('update layer', isNew, layer.toGeoJSON ());
          }
        },
        onDelete:function(layer){
          console.log('delete layer',layer.toGeoJSON());
        }
      },project;
      $timeout(function() {
        scope.$watchCollection ('measureIndexs', function () {
          if(!scope.measureIndexs)return;
          if (project)
            project.map.remove ();

          var featureGroups= {};
          scope.measureIndexs.forEach(function(m){
            var g = featureGroups[m.AcceptanceIndexID] = angular.copy(m);
            g.options = options;
            g.toolbar = {
              group:{

              }
            };
          });
          project = new L.SXT.Project (element[0], {
            map: {
              map: {}
            },
            tileLayers: {
              base: {
                url: 'http://vkde.sxtsoft.com/upload/hx_tile_{z}_{x}_{y}.png'
              }
            },
            featureGroups: featureGroups
          });

        });

        scope.$watch('currentIndex',function(){
          if(project){
            project.swipeFeature(scope.measureIndexs[scope.currentIndex].AcceptanceIndexID);
          }
        })
      },1000);

    }
  }
})();
