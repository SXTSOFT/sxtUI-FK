/**
 * Created by 陆科桦 on 2016/8/23.
 */


(function(){
  'use strict';
  angular
    .module('app.material')
    .controller('AddAttachmentController',['$scope','$state','sxt','$stateParams','api','utils',function($scope,$state,sxt,$stateParams,api,utils){
      var vm = this;


      vm.Type = [
        {name:'出厂合格证',value:2,groupId:sxt.uuid()},
        {name:'材料验收单',value:4,groupId:sxt.uuid()},
        {name:'实拍照片',value:8,groupId:sxt.uuid()},
        {name:'送检报告',value:16,groupId:sxt.uuid()},
        {name:'其他',value:32,groupId:sxt.uuid()}
      ];

      vm.checkDataId = $stateParams.id;
      if(vm.checkDataId != ''){
        $scope.fjType = 16;
        vm.Type.find(function (t) {
          if(t.value == 16){
            vm.groupId_16 =  t.groupId;
          }
        });
      }else{
        $scope.fjType = 2;
        vm.EnclosureType = $scope.$parent.vm.EnclosureType;

        if(vm.EnclosureType.length != 0){
          vm.Type.forEach(function (item) {
            vm.EnclosureType.find(function (e)
            {
              if(item.value == e.OptionType)
                item.groupId = e.GroupImg;
            });
          });

          $scope.fjType = vm.EnclosureType[vm.EnclosureType.length-1].OptionType; //显示最后一次选中
        }

        vm.Type.find(function (t) {
          if(t.value == 2){
            vm.groupId_2 =  t.groupId;
          }
        });

        vm.Type.find(function (t) {
          if(t.value == 4){
            vm.groupId_4 =  t.groupId;
          }
        });

        vm.Type.find(function (t) {
          if(t.value == 8){
            vm.groupId_8 =  t.groupId;
          }
        });

        vm.Type.find(function (t) {
          if(t.value == 16){
            vm.groupId_16 =  t.groupId;
          }
        });

        vm.Type.find(function (t) {
          if(t.value == 32){
            vm.groupId_32 =  t.groupId;
          }
        });

        $scope.sjReport = $scope.$parent.vm.sjReport;
      }



      vm.ok = function(){
        if(vm.checkDataId != ''){
          api.material.addProcessService.Insert({
            CheckData:{Id:vm.checkDataId,InspectionReport:$scope.sjReport},
            CheckDataOptions:[{OptionType:16,GroupImg:vm.groupId_16}]
          }).then(function (result) {
            if(result){
              utils.alert('提交完成').then(function () {
                $state.go('app.szgc.ys');
              });
            }else{
              utils.alert('提交失败').then(function () {
              });
            }
          });
        }else{
          $scope.$parent.vm.sjReport = $scope.sjReport;
          if(vm.EnclosureType.find(function (e){return e.OptionType == 2}) == null)
            $scope.$parent.vm.EnclosureType.push({OptionType:2,GroupImg:vm.groupId_2});
          if(vm.EnclosureType.find(function (e){return e.OptionType == 4}) == null)
            $scope.$parent.vm.EnclosureType.push({OptionType:4,GroupImg:vm.groupId_4});
          if($scope.data.imgs3.length != 0 && vm.EnclosureType.find(function (e){return e.OptionType == 8}) == null)
            $scope.$parent.vm.EnclosureType.push({OptionType:8,GroupImg:vm.groupId_8});
          if($scope.data.imgs4.length != 0 && vm.EnclosureType.find(function (e){return e.OptionType == 16}) == null)
            $scope.$parent.vm.EnclosureType.push({OptionType:16,GroupImg:vm.groupId_16});
          if($scope.data.imgs5.length != 0 && vm.EnclosureType.find(function (e){return e.OptionType == 32}) == null)
            $scope.$parent.vm.EnclosureType.push({OptionType:32,GroupImg:vm.groupId_32});
          $state.go('app.material.ys');
        }
      }
    }]);
})();
