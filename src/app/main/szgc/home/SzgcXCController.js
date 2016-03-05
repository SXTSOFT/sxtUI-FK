/**
 * Created by jiuyuong on 2016/3/4.
 */
(function ()
{
  'use strict';

  angular
    .module('app.szgc')
    .controller('SzgcXCController', SzgcXCController);

  /** @ngInject */
  function SzgcXCController($scope,$stateParams)
  {
    $scope.pid = $stateParams.pid;
  }
})();
