/**
 * Created by leshuangshuang on 16/4/1.
 */
(function(){
  'use strict';
  angular
    .module('app.core')
    .factory('xhscService',xhscService);
  /** @ngInject */
  function xhscService(){
    return {
      //
      qualified:qualified,
      buildRegionTree:buildRegionTree,
      getZ: function (totalW, totalH, m, w, h) {
        var x;
        var y;
        var z;
        z = Math.sqrt((totalH * totalW) / (h * w * m));
        x = Math.ceil(totalW / (z * w));
        y = Math.ceil(totalH / (z * h));
        z = Math.sqrt((totalH * totalW) / (h * x * y * w));
        //console.log('result', x, y, z);
        return {
          x: x,
          y: y,
          z: z
        }
      }
    };
   //单个测量点的
    function qualified(items){
       items.qualified>=80 && items.zdpc<items.yxpc;
       return items.qualified


    }

    function buildRegionTree(regions,rootType){
        function buildRegion(region){
          if (region&&region.RegionType<16){
            region.Children=[];
            regions.forEach(function(k){
              if (k.RegionType==region.RegionType*2&&k.RegionID.indexOf(region.RegionID)>-1){
                if (!region.Children.find(function(o){
                    return o.RegionID== k.RegionID
                  })){
                  region.Children.push(buildRegion(k))
                }
              }
            });
          }
          return region;
        }
        var  root=regions.find(function(k){
            return k.RegionType==rootType;
        })
        if (!root){
            return null;
        }
       return buildRegion(root);

    }
  }
})();
