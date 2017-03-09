/**
 * Created by shaoshun on 2017/3/1.
 */
/**
 * Created by shaoshun on 2017/3/1.
 */
/**
 * Created by emma on 2016/7/1.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('selfRegionController',selfRegionController);

  /** @ngInject */
  function selfRegionController($state,$rootScope,$scope,$mdDialog,$stateParams,remote,$q,utils,xhUtils,xhscService,sxt,$timeout){
    var vm = this;
    vm.isOver=true;
    vm.selected=[];
    vm.acceptanceitemIDs=  $stateParams.acceptanceitemIDs;
    var ok = $rootScope.$on('ok',function(){
      function submit(before) {
        if (!vm.selected.length){
          utils.alert("至少应该选择一个区域!");
          return;
        }
        var regionIds=vm.selected.map(function (o) {
          return o.RegionID;
        }).join(",");

        var date=new Date();
        var day=date.getDay();
        var year=date.getFullYear();
        var month=date.getMonth()+1;
        var hour=date.getHours();
        hour=hour.toString().length==1?("0"+hour):hour;
        var min=date.getMinutes();
        var defaultDes=year+"年"+month+"月"+day+"日"+hour+":"+min+"总包自检";
        before(defaultDes).then(function (res) {
          $mdDialog.show({
            controller: ['$scope', 'utils', '$mdDialog', function ($scope, utils, $mdDialog) {
              res=res?res:defaultDes;
              remote.self.insertInspection({
                ProjectID :vm.selected[0].RegionID.substr(0,5),
                Describe :res,
                Status: 1,
                Extends:{
                  RegionID:regionIds,
                  AcceptanceItemID:vm.acceptanceitemIDs
                }
              },"Inspection").then(function () {
                $mdDialog.hide();
                $state.go("app.xhsc.gx.selfMain");
              })
            }],
            template: '<md-dialog aria-label="正在提交"  ng-cloak><md-dialog-content> <md-progress-circular md-diameter="28" md-mode="indeterminate"></md-progress-circular><p style="padding-left: 6px;">正在提交数据...</p></md-dialog-content></md-dialog>',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            fullscreen: false
          });
        });
      }
      submit(function (defaultDes) {
        return $q(function (resolve,reject) {
          utils.confirm("您需要为本次自检输入一些描述信息吗?").then(function () {
            $timeout(function () {
              $mdDialog.show({
                controller: ['$scope', 'utils', '$mdDialog', function ($scope, utils, $mdDialog) {
                  $scope.describe=defaultDes;
                  $scope.ok=function () {
                    $mdDialog.hide();
                    resolve( $scope.describe);
                  }
                  $scope.cancel=function () {
                    $mdDialog.cancel();
                    reject();
                  }
                }],
                templateUrl: 'app/main/xhsc/procedure/self/selfRegionTemp.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: false
              })
            })
          }).catch(function () {
            resolve();
          })
        })
      });
    });

    $scope.$on('$destroy', function () {
      ok()
      ok = null;
    })

  }
})();
