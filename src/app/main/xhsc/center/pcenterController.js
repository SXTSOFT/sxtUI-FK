/**
 * Created by emma on 2016/6/12.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('pcenterController',pcenterController);

  /**@ngInject*/
  function pcenterController($scope,$mdDialog,db,auth,$rootScope,api){
    var vm = this;
    vm.tel=13112345678;
    vm.changeTel = function(tel){
      $mdDialog.show({
        controller:['$scope',function($scope){
            $scope.tel = vm.tel;
            $scope.cancel = function(){
              $mdDialog.hide();
            }
          $scope.submit = function(tel){
            $mdDialog.hide(tel);
            vm.tel = tel;
          }
        }],
        templateUrl: 'app/main/xhsc/center/changeTel.html',
        parent: angular.element(document.body),
        focusOnOpen:false,
        clickOutsideToClose: true
      }

      )
    }

    $rootScope.$on('$cordovaNetwork:online', function(event, state){
      vm.networkState = api.getNetwork();
    });
    $rootScope.$on('$cordovaNetwork:offline', function(event, state){
      vm.networkState = api.getNetwork();
    });
    vm.networkState = api.getNetwork();
    $scope.$watch(function () {
      return vm.networkState
    },function () {
      api.setNetwork(vm.networkState);
    });
    vm.logout = function(){
      utils.confirm('确定清除所有缓存数据吗?').then(function (result) {
        vm.trueClear(['v_profile']);
        db('xcpk').destroy();
        auth.logout();
      });
    }

    vm.trueClear = function (exclude) {
      api.clearDb(function (persent) {
        vm.cacheInfo = parseInt(persent * 100) + '%';
      }, function () {
        vm.cacheInfo = null;
        utils.alert('清除成功');
      }, function () {
        vm.cacheInfo = null;
        utils.alert('清除失败');
      }, {
        exclude: exclude,
        timeout: 3000
      })
    }
  }
})();
