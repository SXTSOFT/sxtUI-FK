/**
 * Created by lss on 2016/10/19.
 */
/**
 * Created by emma on 2016/7/1.
 */
(function () {
  'use strict';

  angular
    .module('app.xhsc')
    .controller('safe_civiliz_rectifyController', safe_civiliz_rectifyController);

  /** @ngInject */
  function safe_civiliz_rectifyController($state, $rootScope, $scope, $mdDialog, remote, $timeout, $q, utils, xhUtils, api) {
    var vm = this;
    vm.points=[];
    $rootScope.title = $state.params.Role == 'zb' ? '整改' : '复验';
    vm.ProjectID = $state.params.ProjectID;
    vm.AcceptanceItemID = $state.params.AcceptanceItemID;
    vm.AcceptanceItemName = $state.params.AcceptanceItemName ? $state.params.AcceptanceItemName : "";
    vm.role = $state.params.Role;
    vm.InspectionID = $state.params.InspectionID;
    vm.RectificationID = $state.params.RectificationID;
    api.setNetwork(1).then(function () {
      remote.safe.getRectificationSingle(vm.RectificationID).then(function (r) {
        vm.Rectification = r.data[0];
        vm.pareaList = vm.Rectification.Children;
        vm.regionSelect = vm.pareaList[0];
        vm.warter = vm.regionSelect.RegionName + (vm.AcceptanceItemName ? '(' + vm.AcceptanceItemName + ')' : "");
        vm.regionSelect.hasCheck = true;
      });

      vm.info = {}

      function load() {
        if (!vm.regionSelect) {
          return;
        }
      }

      vm.selectQy = function (item,noValid) {
        if (vm.regionSelect==item){
          vm.qyslideShow = false;
          return;
        }
        if (noValid){
          vm.AcceptanceItemID=item.AcceptanceItemID;
          vm.AcceptanceItemName=item.AcceptanceItemName;
          vm.qyslideShow = false;
          vm.regionSelect = item;
          vm.regionSelect.hasCheck = true;
          vm.warter = vm.regionSelect.RegionName + (vm.AcceptanceItemName ? '(' + vm.AcceptanceItemName + ')' : "");
          return;
        }
        $q(function (resolve,reject) {
          if (vm.points.length){
            switch ($state.params.Role){
              case "zb":
                if (vm.points.find(function (k) {
                    return k.Status!=16;
                  })){
                  utils.confirm("点位尚未全部整改,是否继续下一个区域",null,"继续","取消").then(function () {
                    resolve();
                  })
                }else {
                  resolve();
                }
                break;
              default:
                if (vm.points.find(function (k) {
                    return k.Status!=2;
                  })){
                  utils.confirm("点位尚未全部合格,是否继续提交",null,"继续","取消").then(function () {
                    resolve();
                  })
                }else {
                  resolve();
                }
                break;
            }
          }else {
            resolve();
          }
        }).then(function () {
          vm.AcceptanceItemID=item.AcceptanceItemID;
          vm.regionSelect = item;
          vm.regionSelect.hasCheck = true;
          vm.AcceptanceItemName=item.AcceptanceItemName;
          vm.warter = vm.regionSelect.RegionName + (vm.AcceptanceItemName ? '(' + vm.AcceptanceItemName + ')' : "");
          vm.qyslideShow = false;
        })
      }

      vm.qyslide = function () {
        vm.qyslideShow = !vm.qyslideShow;
      }
      $scope.times = xhUtils.zgDays();
      var gxzgChanged = $rootScope.$on('sendGxResult', function () {
        function valid() {
          function next() {
            return  $q(function (resolve,reject) {
              var msg = [],noChecked=[];
              vm.pareaList.forEach(function (r) {
                if (!r.hasCheck) {
                  msg.push(r.RegionName);
                  noChecked.push(r);
                }
              });
              if (msg.length) {
                utils.confirm(msg.join(",") + '尚未查看,去看看?',null,"确定","取消").then(function () {
                  vm.selectQy(noChecked[0],true);
                }).catch(function () {
                });
              }else {
                resolve();
              }
            })
          }
          return  $q(function (resolve,reject) {
            if (vm.points.length){
              switch ($state.params.Role){
                case "zb":
                  if (vm.points.find(function (k) {
                      return k.Status!=16;
                    })){
                    utils.confirm("点位尚未全部整改,是否继续提交",null,"继续","取消").then(function () {
                      return next();
                    }).then(function () {
                      resolve();
                    })
                  }else {
                    return next().then(function () {
                      resolve();
                    });
                  }
                  break;
                default:
                  if (vm.points.find(function (k) {
                      return k.Status!=2;
                    })){
                    utils.confirm("点位尚未全部合格,是否继续提交",null,"继续","取消").then(function () {
                      return next();
                    }).then(function () {
                      resolve();
                    })
                  }else {
                    return next().then(function () {
                      resolve();
                    });
                  }
                  break;
              }
            }else {
              return next().then(function () {
                resolve();
              });
            }
          }).then(function () {
            $timeout(function () {
              utils.alert('提交成功，请稍后离线上传数据',null,function () {
                $state.go("app.xhsc.sf.sfmain");
              });
            })
          })
        }
        valid();

      });

      $scope.$on('$destroy', function () {
        gxzgChanged();
        gxzgChanged = null;
      })
    });
  }
})();
