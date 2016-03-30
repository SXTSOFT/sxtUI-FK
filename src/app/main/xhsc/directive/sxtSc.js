/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .directive('sxtSc', sxtSc);

  /** @Inject */
  function sxtSc($timeout){
    return {
      link:link
    }

    function link(scope,element,attr,ctrl){
      $timeout(function(){

        var map = L.map(element[0],{
            crs: L.extend({}, L.CRS, {
              projection: L.Projection.LonLat,
              transformation: new L.Transformation(1, 0, 1, 0),
              scale: function (e) {
                return 512 * Math.pow(2, e);
              }
            }),
            center: [.3, .2],
            zoom: 2,
            minZoom: 0,
            maxZoom: 3,
            scrollWheelZoom: true,
            annotationBar: false,
            attributionControl: false
          }
        );
        L.tileLayer(
          'http://vkde.sxtsoft.com/api/picMap/load/{z}_{x}_{y}.png?path=/upload/hx.jpg',
          {
            attribution: false
          }).addTo(map);
        var drawControl = new L.Control.Draw().addTo(map);
      },1000)
    }
  }


})();
