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
    .controller('sfWeekRectifyController', sfWeekRectifyController);

  /** @ngInject */
  function sfWeekRectifyController($state, $rootScope, $scope, $mdDialog, remote, $timeout, $q, utils, xhUtils, api) {
    var vm = this;
    $rootScope.title = $state.params.Role == 'zb' ? '整改' : '复查';
    vm.role = $state.params.Role;
    vm.InspectionID = $state.params.InspectionID;

    remote.safe.getRectificationsWrap.cfgSet({
      offline:true,
      filter:function (item) {
        return item.InspectionExtendID==vm.InspectionID;
      }
    })("WeekInspects").then(function (r) {
      var bacth=angular.isArray(r.data)?r.data[0]:null;
      vm.pareaList=[];
      if (bacth){
        bacth.Rectifications.forEach(function (k) {
            if (k.Children){
              k.Children.forEach(function (m) {
                if (!vm.pareaList.some(function (z) {
                    return z.AreaID==m.AreaID;
                  }))
                vm.pareaList.push(m);
              })
            }
        });
        if (vm.pareaList.length>0){
          vm.regionSelect = vm.pareaList[0];
          vm.regionSelect.hasCheck = true;
          vm.AcceptanceItemName=vm.regionSelect.AcceptanceItemName;
          vm.warter = vm.regionSelect.RegionName + bacth.Describe;;
        }
      }
    });

    api.setNetwork(1).then(function () {
      vm.info = {}
      vm.selectQy = function (item) {
        if (vm.regionSelect==item){
          vm.qyslideShow = false;
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
                }
                break;
              default:
                if (vm.points.find(function (k) {
                    return k.Status!=2;
                  })){
                  utils.confirm("点位尚未全部合格,是否继续提交",null,"继续","取消").then(function () {
                    resolve();
                  })
                }
                break;
            }
          }else {
           resolve();
          }
        }).then(function () {
          vm.regionSelect = item;
          vm.regionSelect.hasCheck = true;
          vm.AcceptanceItemID=item.AcceptanceItemID;
          vm.AcceptanceItemName=item.AcceptanceItemName;
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
                  vm.selectQy(noChecked[0]);
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
               $state.go("app.xhsc.week.sfWeekMain");
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
