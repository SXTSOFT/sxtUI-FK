/**
 * Created by lss on 2016/10/20.
 */
/**
 * Created by emma on 2016/6/12.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('pcenter_mainController',pcenter_mainController);

  /**@ngInject*/
  function pcenter_mainController($scope,xhscService,$mdDialog,db,auth,$rootScope,api,utils,$q,remote,versionUpdate,$state,$timeout,$mdBottomSheet){
    var vm = this;
    vm.projects=[];
    api.setNetwork(0).then(function () {
      var arr=[
        remote.profile(),
        remote.Project.getAllRegionWithRight("", 1)
      ];
      $q.all(arr).then(function (res) {
        var r=res[0];
        if (r.data && r.data.Role) {
          vm.role = r.data.Role.MemberType === 0 || r.data.Role.MemberType ? r.data.Role.MemberType : -100;
          vm.OUType=r.data.Role.OUType===0||r.data.Role.OUType?r.data.Role.OUType:-100;
        }
        var k=res[1];
        if (k&&k.data){
          vm.projects=k.data;
        }
      }).catch(function () {
        vm.show=true;
        utils.alert("当前网络异常！");
      });
      vm.serverAppVersion = versionUpdate.version;
      vm.clearCache=function(){
        utils.confirm('确定清除所有缓存数据吗?').then(function (result) {
          vm.trueClear = function (exclude) {
            $mdDialog.show({
              controller: ['$scope','utils','$mdDialog',function ($scope,utils,$mdDialog) {
                api.clearDb(function (persent) {
                  $scope.cacheInfo = parseInt(persent * 100) + '%';
                }, function () {
                  $scope.cacheInfo = null;
                  //$rootScope.$emit('clearDbSuccess');
                  $mdDialog.hide();
                  //utils.alert('清除成功');
                }, function () {
                  $scope.cacheInfo = null;
                  $mdDialog.cancel();
                  utils.alert('清除失败');

                }, {
                  exclude: exclude,
                  timeout: 3000
                })
              }],
              template: '<md-dialog aria-label="正在清除"  ng-cloak><md-dialog-content> <md-progress-circular md-mode="indeterminate"></md-progress-circular> 正在清除数据，请稍候……({{cacheInfo}})</md-dialog-content></md-dialog>',
              parent: angular.element(document.body),
              clickOutsideToClose:false,
              fullscreen: false
            })
              .then(function(answer) {
              }, function() {
                window.localStorage.removeItem("dbs");
                utils.alert('清除成功');
              });
            return;
          }
          xhscService.clear_Root_uglyVal();
          vm.trueClear(['v_profile']);
        });
      }
      vm.logout = function(){
        utils.confirm('确定清除所有缓存数据吗?').then(function (result) {
          vm.trueClear = function (exclude) {
            $mdDialog.show({
              controller: ['$scope','utils','$mdDialog',function ($scope,utils,$mdDialog) {
                api.clearDb(function (persent) {
                  $scope.cacheInfo = parseInt(persent * 100) + '%';
                }, function () {
                  $scope.cacheInfo = null;
                  //$rootScope.$emit('clearDbSuccess');
                  $mdDialog.hide();
                  //utils.alert('清除成功');
                }, function () {
                  $scope.cacheInfo = null;
                  $mdDialog.cancel();
                  utils.alert('清除失败');

                }, {
                  exclude: exclude,
                  timeout: 3000
                })
              }],
              template: '<md-dialog aria-label="正在清除"  ng-cloak><md-dialog-content> <md-progress-circular md-mode="indeterminate"></md-progress-circular> 正在清除数据，请稍候……({{cacheInfo}})</md-dialog-content></md-dialog>',
              parent: angular.element(document.body),
              clickOutsideToClose:false,
              fullscreen: false
            })
              .then(function(answer) {
                window.localStorage.removeItem("dbs");
                auth.logout();
              }, function() {

              });
            return;
          }
          vm.trueClear(['v_profile']);
        });
      }
      //消息中心
      vm.scStandar=function(){
        if (!vm.projects.length){
          utils.alert("您当前无任何项目权限!");
          return;
        }
        if (vm.projects.length>1){
          $mdDialog.show({
            controller: ['$scope','utils','$mdDialog',function ($scope,utils,$mdDialog) {
              $scope.projects=vm.projects;
              $scope.go=function (item) {
                $state.go("app.xhsc.scPiclst",{projectID:item.RegionID});
                $mdDialog.hide();
              }
            }],
            templateUrl:"app/main/xhsc/center/projectlst.html" ,
            parent: angular.element(document.body),
            clickOutsideToClose:true,
            fullscreen: false
          });

        }else {
          $state.go("app.xhsc.scPiclst",{projectID:vm.projects[0].RegionID});
        }
      }
    })
  }
})();
