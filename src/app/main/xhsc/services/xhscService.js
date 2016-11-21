/**
 * Created by leshuangshuang on 16/4/1.
 */
(function () {
  'use strict';
  angular
    .module('app.core')
    .factory('xhscService', xhscService);
  /** @ngInject */
  function xhscService($rootScope,remote,api,sxtlocaStorage,$q) {
    return {
      //
      qualified: qualified,
      buildRegionTree: buildRegionTree,
      buildMutilRegionTree: buildMutilRegionTree,
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
      },
      clear_Root_uglyVal:function () {
        $rootScope.pgReportFilter_load=null;
        $rootScope.pgDefault_load=null;
        $rootScope.scslFilter=null;
        $rootScope.scslReport_load=null;
        $rootScope.gxysFilter_load=null;
      },
      getProfile:function () {
       return $q(function (resolve,reject) {
         api.setNetwork(0).then(function () {
           var  profile=sxtlocaStorage.getObj("profile");
           if (profile){
             resolve(profile);
           }else {
             remote.profile().then(function (r) {
               profile={
                 role:r.data.Role.MemberType === 0 || r.data.Role.MemberType ? r.data.Role.MemberType : null,
                 ouType:r.data.Role.OUType === 0 || r.data.Role.OUType ? r.data.Role.OUType : null,
                 user:r.data
               }
               sxtlocaStorage.setObj("profile",profile)
               resolve(profile);
             }).catch(function () {
               reject(profile)
             });
           }
         })
       });
      }
    };
    //单个测量点的
    function qualified(items) {
      items.qualified >= 80 && items.zdpc < items.yxpc;
      return items.qualified


    }

    function buildMutilRegionTree(regions, rootType) {
      var res = [];
      var roots = $.grep(regions, function (r) {
        return rootType == r.RegionType;
      });
      roots.forEach(function (r) {
        res.push(buildRegionTree($.grep(regions, function (k) {
          return k.RegionID.indexOf(r.RegionID)>-1
        }), rootType));
      });
      return res;
    }


    function buildRegionTree(regions, rootType) {
      function buildRegion(region) {
        if (region && region.RegionType < 16) {
          region.Children = [];
          regions.forEach(function (k) {
            if (k.RegionType == region.RegionType * 2 && k.RegionID.indexOf(region.RegionID) > -1) {
              if (!region.Children.find(function (o) {
                  return o.RegionID == k.RegionID
                })) {
                region.Children.push(buildRegion(k))
              }
            }
          });
        }
        return region;
      }

      var root = regions.find(function (k) {
        return k.RegionType == rootType;
      })
      if (!root) {
        return null;
      }
      return buildRegion(root);

    }
  }
})();
