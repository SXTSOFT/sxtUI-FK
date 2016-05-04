/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .directive('sxtSc', sxtSc);

  /** @Inject */
  function sxtSc($timeout,mapPopupSerivce,remote,$q,sxt,xhUtils){

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
      var map,tile,layer,toolbar;
      var install = function(){
        if(!scope.imageUrl)return;
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
        if(tile)
          map.removeLayer(tile);

        if(layer)
          map.removeLayer(layer);


        if(toolbar)
          map.removeControl(toolbar);

        tile = L.tileLayer(sxt.app.api+'/Api/Picture/Tile/{z}_{x}_{y}?path=/fs/UploadFiles/Framework/'+ scope.imageUrl, {attribution: false,noWrap: true});
        map.addLayer(tile);

        layer = new L.SvFeatureGroup({
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
                acceptanceItem:scope.acceptanceItem
              }
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
        scope.$watch('measureIndexes',function(){
          install();
        });
        scope.$watch('regionId',function(){
          install();
        });
      },500);
    }
  }


})();
