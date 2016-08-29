/**
 * Created by 陆科桦 on 2016/8/23.
 */


(function(){
  'use strict';
  angular
    .module('app.material')
    .controller('CheckDataDetailController',['$scope','api','$stateParams','$state',function($scope,api,$stateParams,$state){
      api.material.MaterialService.GetInfoById($stateParams.id).then(function(result){
        $scope.dataInfo = result.data;
      });

      api.material.MaterialService.GetMLFilesById($stateParams.id).then(function(result){
        $scope.files = result.data.Rows;
      });
    }]);
})();
