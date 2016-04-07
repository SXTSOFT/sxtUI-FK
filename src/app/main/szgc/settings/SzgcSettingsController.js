/**
 * Created by zhangzhaoyong on 16/2/1.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .controller('SzgcSettingsController',SzgcSettingsController);

  /** @ngInject */
  function SzgcSettingsController(profile,auth){

    var vm = this;
    vm.profile = profile.data.data;
    vm.logout = function(){
      auth.logout();
    }
    console.log('profile',profile);
  }
})();
