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

        L.marker([22.631026,114.111701],{
          project:'124344'
        }).on('click',function(e) {
          console.log('e', e.target.options.project)
        }).addTo(map)

        L.marker([22.631026,114.311701]).addTo(map)

      },1000)



    }
  }


})();
