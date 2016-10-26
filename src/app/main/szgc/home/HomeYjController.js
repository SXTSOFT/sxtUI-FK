(function(angular){
  'use strict';

  angular
    .module('app.szgc')
    .controller('HomeYjController', HomeYjController);

  /** @ngInject */
  function HomeYjController(yj)
  {
    var vm = this;
    vm.yj = yj;
  }

})(angular);
