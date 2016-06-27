/**
 * Created by zhangzhaoyong on 16/2/1.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .controller('SzgcSettingsController',SzgcSettingsController);

  /** @ngInject */
  function SzgcSettingsController(profile,auth,$http, $cordovaAppVersion,api){

    var vm = this;
    vm.profile = profile.data.data;
    vm.logout = function(){
      auth.logout();
    }
    //服务器上保存版本信息
    $http.get('http://vkde.sxtsoft.com/api/vkapi/Version')
      .then(function (data) {
        vm.serverAppVersion = data.data.verInfo;//服务器 版本

      })

  //  $cordovaAppVersion.getVersionNumber().then(function (version) {
  //    vm.serverAppVersion = version;
  //  });
  }

})();
