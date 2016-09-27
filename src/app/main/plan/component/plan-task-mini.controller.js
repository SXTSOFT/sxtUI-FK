/**
 * Created by emma on 2016/8/22.
 */
(function(angular,undefined){
  'use strict';

  angular
    .module('app.plan')
    .controller('planTaskMiniController',planTaskMiniController)

  /** @ngInject */
  function planTaskMiniController($scope,api, $mdDialog,parentTask){
    $scope.data = {
      Level:parentTask.Level+1
    }
    $scope.hide = function () {
      api.plan.TaskLibrary.create($scope.data).then(function (r) {
        $mdDialog.hide(r.data);
      });
    }
    $scope.cancel = function () {
      $mdDialog.cancel();
    }
  }
})(angular,undefined);
