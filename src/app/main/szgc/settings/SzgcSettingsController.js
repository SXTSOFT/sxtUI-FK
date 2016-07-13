/**
 * Created by zhangzhaoyong on 16/2/1.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .controller('SzgcSettingsController',SzgcSettingsController);

  /** @ngInject */
  function SzgcSettingsController(profile,auth,api,$scope,utils,$rootScope,appCookie){

    var vm = this;
    vm.profile = profile.data.data;
    vm.logout = function(){
      api.uploadTask(function (cfg,item) {
        return true
      }).then(function (result) {
        if(result.rows.length){
          utils.confirm('您有'+result.rows.length+'条数据未上传，确定清除所有缓存数据并退出吗？').then(function (result) {
            vm.trueClear([]);
          })
        }
        else {
          utils.confirm('退出将清除当前人所有缓存数据，确定退出吗?').then(function (result) {
            vm.trueClear([]);
          });
        }
      });
    }
    //服务器上保存版本信息
    api.szgc.version().then(function (r) {
      vm.serverAppVersion = r.data.verInfo;
    });
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
    vm.clearCache = function () {
      api.uploadTask(function (cfg,item) {
        return true
      }).then(function (result) {
        if(result.rows.length){
          utils.confirm('您有'+result.rows.length+'条数据未上传，确定清除所有缓存数据吗？').then(function (result) {
            //console.log('r', result);
            vm.trueClear(['v_profile']);
          })
        }
      else {
          utils.confirm('确定清除所有缓存数据吗?').then(function (result) {
            vm.trueClear(['v_profile']);
          });
        }
      });
    }
  }

})();
