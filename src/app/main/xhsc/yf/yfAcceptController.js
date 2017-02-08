/**
 * Created by lss on 2016/10/19.
 */
/**
 * Created by emma on 2016/6/6.
 */
(function () {
  'use strict';

  angular
    .module('app.xhsc')
    .controller('yfAcceptController', yfAcceptController);

  /**@ngInject*/
  function yfAcceptController($scope, $stateParams, remote, xhUtils, $rootScope, $state, $q, utils, api, xhscService) {
    var vm = this;
    var projectId = $stateParams.projectId,
      areaId=vm.areaId = $stateParams.areaId ? $stateParams.areaId : $stateParams.regionId;
    vm.InspectionId = $stateParams.InspectionId;

    vm.info = {
      current: null,
      projectId: projectId,
      regionId: areaId,
      cancelMode: function () {
        vm.cancelCurrent(null);
      }
    };

    var sendResult = $rootScope.$on('sendGxResult', function () {
      utils.alert("提交成功，请稍后离线上传数据！", null, function () {
        $state.go('app.xhsc.yf.Main')
      });
    })
    $scope.$on("$destroy", function () {
      sendResult();
      sendResult = null;
    });
    api.setNetwork(1).then(function () {
      vm.cancelCurrent = function ($event) {
        vm.info.current = null;
      }
      $scope.areas = xhscService.getRegionTreeOffline("", 31, 1).then(function (r) {
        if (!angular.isArray(r)) {
          return r;
        }
        var area = r.filter(function (k) {
          if (angular.isArray(k.Children)) {
            k.Children = k.Children.filter(function (m) {
              return m.RegionID == areaId;
            })
          }
          return k.RegionID == projectId;
        });
        return area;
      });

      function convertData(source) {
        var ret = [];
        var accAcceptances = [];
        if (angular.isArray(source)) {
          source.forEach(function (t) {
            if (angular.isArray(t.WPAcceptanceList)){
              accAcceptances= accAcceptances.concat(t.WPAcceptanceList);
            }
            var k = t.SpecialtyChildren;
            if (angular.isArray(k)) {
              k.forEach(function (m) {
                if (angular.isArray(m.WPAcceptanceList)) {
                  accAcceptances = accAcceptances.concat(m.WPAcceptanceList);
                }
              })
            }
          })
        }

        if (accAcceptances.length) {
          accAcceptances.forEach(function (k) {
            k.ProblemClassifyList.forEach(function (o) {
              if (angular.isArray( o.ProblemLibraryList)&& o.ProblemLibraryList.length){
                o.ProblemLibraryList.sort(function (a,b) {
                  return a.ProblemSortName.localeCompare(b.ProblemSortName)
                })
              }
            });

            build(k);
          })
        }
        return ret;

        function build(ac) {
          var name = ac.AcceptanceItemName;
          if (name) {
            var nameArr = name.split("-");
            if (nameArr.length == 3) {
              var first = nameArr[0], second = nameArr[1], third = nameArr[2];
              ac.AcceptanceItemName = third;
              var type = ret.find(function (o) {
                return o.SpecialtyName.trim() == first.trim();
              })
              if (!type) {
                var entiy = {
                  SpecialtyName: first,
                  SpecialtyChildren: [{
                    SpecialtyName: second,
                    WPAcceptanceList: [ac]
                  }
                  ]
                }
                ret.push(entiy)
              }else {
                var subtype=type.SpecialtyChildren.find(function (o) {
                  return o.SpecialtyName.trim()==second.trim();
                })
                if (!subtype){
                  type.SpecialtyChildren.push({
                    SpecialtyName: second,
                    WPAcceptanceList: [ac]
                  });
                }else {
                   var gx=subtype.WPAcceptanceList.find(function (o) {
                     return o.AcceptanceItemName.trim()==third.trim();
                   })
                  if (!gx){
                    subtype.WPAcceptanceList.push(ac)
                  }
                }
              }
            }
          }
        }
      }

      $scope.procedure = remote.safe.getSecurityItem.cfgSet({
        offline: true
      })("house").then(function (r) {
        r.data=convertData(r.data);

        return r;
      });
      $scope.current = {};


      $scope.$watch("current.region", function (v, o) {
        if (v && $scope.current.procedure) {
          vm.info.show = true;
        } else {
          vm.info.show = false;
        }
      })
      $scope.$watch("current.procedure", function (v, o) {
        if (v) {
          if ($scope.current.region) {
            vm.info.show = true;
          } else {
            vm.info.show = false;
          }
          vm.procedureData = [v];
          vm.procedureData.forEach(function (t) {
            t.SpecialtyChildren = t.ProblemClassifyList;
            t.ProblemClassifyList.forEach(function (_t) {
              _t.WPAcceptanceList = _t.ProblemLibraryList;
              _t.SpecialtyName = _t.ProblemClassifyName;
              _t.ProblemLibraryList.forEach(function (_tt) {
                _tt.AcceptanceItemName = _tt.ProblemSortName + '.' + _tt.ProblemDescription;
              })
            })
          })
        }
      })
    });
  }
})();
