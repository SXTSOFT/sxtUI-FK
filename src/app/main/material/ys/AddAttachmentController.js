/**
 * Created by 陆科桦 on 2016/8/23.
 */


(function(){
  'use strict';
  angular
    .module('app.material')
    .controller('AddAttachmentController',['$scope','$state','sxt',function($scope,$state,sxt){
      var vm = this;
      // $scope.fjType = $scope.$parent.vm.fjType == null?2:$scope.$parent.vm.fjType;
      $scope.sjReport = $scope.$parent.vm.sjReport;

      vm.EnclosureType = $scope.$parent.vm.checkData.EnclosureType;
      if(vm.EnclosureType.find(function (e) { return e.Type == 2 }) == null){
        $scope.data.groupId_2 = sxt.uuid();
      }



      vm.ok = function(){
        // $scope.$parent.vm.fjType = $scope.fjType;
        // $scope.$parent.vm.sjReport = $scope.sjReport;
        $scope.data.groupId_2 = sxt.uuid();
        if($scope.data.imgs1.length != 0)
          $scope.$parent.vm.checkData.EnclosureType.push({'Type':2,groupId:$scope.data.groupId_2});
        if($scope.data.imgs2.length != 0)
          $scope.$parent.vm.checkData.EnclosureType.push({'Type':4,groupId:$scope.data.groupId_4});
        if($scope.data.imgs3.length != 0)
          $scope.$parent.vm.checkData.EnclosureType.push({'Type':8,groupId:$scope.data.groupId_8});
        if($scope.data.imgs4.length != 0)
          $scope.$parent.vm.checkData.EnclosureType.push({'Type':16,groupId:$scope.data.groupId_16});
        if($scope.data.imgs5.length != 0)
          $scope.$parent.vm.checkData.EnclosureType.push({'Type':32,groupId:$scope.data.groupId_32});
        $state.go('app.material.ys');
      }
    }]);
})();
