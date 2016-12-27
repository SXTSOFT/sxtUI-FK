/**
 * Created by 陆科桦 on 2016/8/23.
 */


(function(){
  'use strict';
  angular
    .module('app.material')
    .controller('CheckDataDetailController',['$scope','api','$stateParams','$state','$mdDialog',function($scope,api,$stateParams,$state, $mdDialog){
      api.material.MaterialService.GetInfoById($stateParams.id).then(function(result){
        $scope.dataInfo = result.data.Rows[0];
        api.material.TargetRelationService.getByCheckDataId({projectId:$scope.dataInfo.ProjectId,materialId:$scope.dataInfo.MaterialId,checkDataId:$stateParams.id}).then(function(r){
          $scope.targets = r.data.Rows;
          console.log($scope.targets);
        })
      });

      api.material.MaterialService.GetMLFilesById($stateParams.id).then(function(result){
        $scope.files = result.data.Rows;
      });

      $scope.showAlert = function(ev) {
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
