/**
 * Created by 陆科桦 on 2016/8/23.
 */


(function(){
  'use strict';
  angular
    .module('app.material')
    .controller('CheckDataDetailController',['$scope','api','$stateParams','$state','$mdDialog',function($scope,api,$stateParams,$state, $mdDialog){
      api.material.MaterialService.GetInfoById($stateParams.id).then(function(result){
        $scope.dataInfo = result.data;
      });

      api.material.MaterialService.GetMLFilesById($stateParams.id).then(function(result){
        $scope.files = result.data.Rows;
      });

      $scope.showAlert = function(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        // Modal dialogs should fully cover application
        // to prevent interaction outside of dialog
        $mdDialog.show(
          $mdDialog.alert()
            .clickOutsideToClose(true)
            .title('处理意见')
            .textContent($scope.dataInfo.HandleOption)
            .ok('取消')
            .targetEvent(ev)
        );
      };
    }]);
})();
