/**
 * Created by leshuangshuang on 16/4/1.
 */
(function () {
  'use strict';
  angular
    .module('app.core')
    .factory('xhscService', xhscService);
  /** @ngInject */
  function xhscService($rootScope, remote, api, sxtlocaStorage, $q) {
    return {
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
      clear_Root_uglyVal: function () {
        $rootScope.pgReportFilter_load = null;
        $rootScope.pgDefault_load = null;
        $rootScope.scslFilter = null;
        $rootScope.scslReport_load = null;
        $rootScope.gxysFilter_load = null;
      },
      getProfile: function () {
        return $q(function (resolve, reject) {
          api.setNetwork(0).then(function () {
            // var profile = sxtlocaStorage.getObj("profile");
            // if (profile) {
            //   resolve(profile);
            // } else {
            //   remote.profile().then(function (r) {
            //     profile = {
            //       role: r.data.Role.MemberType === 0 || r.data.Role.MemberType ? r.data.Role.MemberType : null,
            //       ouType: r.data.Role.OUType === 0 || r.data.Role.OUType ? r.data.Role.OUType : null,
            //       user: r.data,
            //       duties:r.data.Role.Duties
            //     }
            //     sxtlocaStorage.setObj("profile", profile)
            //     resolve(profile);
            //   }).catch(function () {
            //     reject(profile)
            //   });
            // }
            remote.profile().then(function (r) {
              var profile = {
                role: r.data.Role.MemberType === 0 || r.data.Role.MemberType ? r.data.Role.MemberType : null,
                ouType: r.data.Role.OUType === 0 || r.data.Role.OUType ? r.data.Role.OUType : null,
                user: r.data,
                duties:r.data.Role.Duties
              }
              resolve(profile);
            }).catch(function () {
              reject(profile)
            });

          })
        });
      },
      getRegionTreesOnline: function (rootId, regionSize, rootType) {
        var self = this;
        return $q(function (resove, reject) {
          return remote.Project.getAllRegionWithRight_no_db(rootId, regionSize).then(function (r) {
            if (r && r.data.length > 0) {
              rootType = rootType ? rootType : 1;
              var data = self.buildMutilRegionTree(r.data, 1);
              resove(data);
              return;
            }
            resove(null);
          }).catch(function (r) {
            reject(null);
          });
        });
      },
      getRegionTreeOffline:function (rootId, regionSize, rootType) {
        var self = this;
        return $q(function (resove, reject) {
          return remote.Project.getRegionWithRight_wrap(rootId, regionSize).then(function (r) {
            var data=r&&r.data&&r.data.data?r.data.data:[]
            if (data.length > 0) {
              rootType = rootType ? rootType : 1;
              var res = self.buildMutilRegionTree(data, rootType);
              resove(res);
              return;
            }
            resove(null);
          }).catch(function (r) {
            reject(null);
          });
        });
      },
      downloadPics: function (regionID, db, filter,relates) {
        return $q(function (resolve, reject) {
          var tasks = [];
          if (!filter) {
            filter = function (item) {
              return true;
            }
          }
          if (!relates){
            relates=remote.Project.getDrawingRelations(regionID, db);
          }
          relates.then(function (result) {
            var pics = [];

            function isDownload(drawingID) { //图片是否已经下载
              var _pics = sxtlocaStorage.getObj("pics");
              if (!_pics) {
                _pics = [];
              }
              if (_pics.indexOf(drawingID) > -1) {
                return true;
              }
              return false;
            }

            function isRepeat(DrawingID) { //是否重复的图片
              return pics.some(function (t) {
                return t == DrawingID
              })
            }

            result.data.forEach(function (item) {
              if (item.RegionId.indexOf(regionID) > -1 && !isRepeat(item.DrawingID) && !isDownload(item.DrawingID) && filter(item)) {
                pics.push(item.DrawingID);
              }
            });
            pics.forEach(function (drawingID) {
              tasks.push(function () {
                return remote.Project.getDrawing(drawingID).then(function () {
                  var _pics = sxtlocaStorage.getObj("pics");
                  if (!_pics) {
                    _pics = [];
                  }
                  _pics.push(drawingID);
                  sxtlocaStorage.setObj("pics", _pics);
                });
              })
            });
            resolve(tasks);
          }).catch(function () {
            reject(tasks);
          });
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
          return k.RegionID.indexOf(r.RegionID) > -1
        }), rootType));
      });
      return res;
    }


    function buildRegionTree(regions, rootType) {
      function buildRegion(region,parenName) {
        if (region && region.RegionType < 16) {
          region.Children = [];
          regions.forEach(function (k) {
            if (k.RegionType == region.RegionType * 2 && k.RegionID.indexOf(region.RegionID) > -1) {
              if (!region.Children.find(function (o) {
                  return o.RegionID == k.RegionID
                })) {
                if (region.RegionType>2){
                  if (parenName){
                    region.fullName=parenName+region.RegionName;
                  }else {
                    region.fullName=region.RegionName;
                  }
                }
                var re=buildRegion(k,region.fullName?region.fullName:null);
                if (re){
                  re.fullName=!re.fullName?(region.fullName+re.RegionName):re.fullName;
                }
                region.Children.push(re)
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
      return buildRegion(root,null);

    }
  }
})();
