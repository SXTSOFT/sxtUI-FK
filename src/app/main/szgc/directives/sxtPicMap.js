/**
 * Created by zhangzhaoyong on 16/2/16.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .directive('sxtPicMap',sxtPicMap);

  /** @ngInject */
  function sxtPicMap($timeout,sxt){
    return {
      scope:{
        picUrl:'@'
      },
      link:link
    }

    function link(scope,element,attr,ctrl){

      $timeout(function(){
        console.log('picUrl',scope.picUrl)
        //var crs = ;

        var map = L.map(element[0],{
          crs:L.extend({}, L.CRS, {
            projection    :L.Projection.LonLat,
            transformation:new L.Transformation(1, 0, 1, 0),
            scale         :function(e) {
              return 512 * Math.pow(2, e);
            }
          }),
          center:[.38531902026005, .5],
          zoom:0,
          minZoom:0,
          maxZoom:3,
          scrollWheelZoom:true,
          annotationBar:false,
          attributionControl:false
        }),
          //layer = L.tileLayer(sxt.app.api + '/api/file/load?x={x}&y={y}&z={z}', {
          layer = L.tileLayer('http://localhost:46844/api/picMap/load/{z}_{x}_{y}.png?path='+scope.picUrl, {
            noWrap:true,
            continuousWorld:false,
            tileSize:512
          });

        layer.addTo(map);

      },500)
    }
  }
})();
