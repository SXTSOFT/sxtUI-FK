/**
 * Created by zhangzhaoyong on 16/2/16.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .directive('sxtMaps',sxtMapsDirective);

  /** @ngInject */
  function sxtMapsDirective($timeout){
    return {
      scope:{
        markers:'=',
        markerClick:'&'
      },
      link:link
    }

    function  link(scope,element,attr,ctrl){

      $timeout(function(){
        var map = L.map(element[0],{
          center:[22.631026,114.111701],
          zoom:10,
          attributionControl:false
        }),
          layer = L.tileLayer('http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
            subdomains: "1234"
          });

        layer.addTo(map);

        scope.$watchCollection('makers',function(){
          if(scope.markers){
            angular.forEach(scope.markers,function(o,k){
              L
                .marker([o.lat, o.lng],o)
                .on('click',markerClick)
                .addTo(map);
            })
          }
        });

      },1000)

      function markerClick(e){
        scope.markerClick( {$current : e.target.options});

      }

    }
  }


})();
