/**
 * Created by emma on 2016/6/12.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('pcenterController',pcenterController);

  /**@ngInject*/
  function pcenterController($scope,$mdDialog,db,auth,$rootScope,api,utils,$q,remote,versionUpdate ){
    var vm = this;

    vm.serverAppVersion = versionUpdate.version;
    var pro=[
      remote.profile()
    ];
    $q.all(pro).then(function(r){
      var role=r[0];
      vm.user={};
      vm.u={};
      if (role&&role.data&&role.data){
          vm.user.name= role.data.Name,
          vm.user.userName= role.data.UserName
          switch (role.data.Role.MemberType){
            case 0:
              vm.user.role='总包';
                  break
            case 2:
              vm.user.role='监理';
                  break;
            case 4:
              vm.user.role="项目部";
          }
      }
    });


    //auth.getUser().then(function(r){
    //  if (r){
    //    vm.user={
    //      Name: r.Name,
    //      UserName: r.UserName
    //    };
    //  }
    //  vm.user={};
    //   console.log(r)
    //});

    $rootScope.$on('sxt:online', function(event, state){
      vm.networkState = api.getNetwork();
    });
    $rootScope.$on('sxt:offline', function(event, state){
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
              auth.logout();
            }, function() {

            });
          return;
        }
        vm.trueClear(['v_profile']);
      });
    }
  }
})();
