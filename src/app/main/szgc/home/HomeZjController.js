(function(angular){
  'use strict';

  angular
    .module('app.szgc')
    .controller('HomeZjController', HomeYjController);

  /** @ngInject */
  function HomeYjController(zj)
  {
    var vm = this;
    vm.zj = zj;
  }

})(angular);
