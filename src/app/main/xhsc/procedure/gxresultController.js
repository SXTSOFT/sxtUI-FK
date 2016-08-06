/**
 * Created by emma on 2016/5/31.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxresultController',gxresultController);

  /** @ngInject*/
  function gxresultController($mdDialog,$stateParams,$state,$scope,remote,utils,xhUtils){
    var vm = this;
    vm.params = $stateParams;
    vm.gxname = $stateParams.acceptanceItemName;
    vm.bwname = $stateParams.name;
    var  InspectionId=$stateParams.InspectionId;

    vm.times = xhUtils.zgDays();

    remote.Project.queryAllBulidings($stateParams.projectId).then(function(result){
      vm.allRelations = [];
      var areaId = $stateParams.areaId;
      var tmp=[];
      result.data[0].Sections.forEach(function(t){
        tmp= t.SectionRegionIDs.split(',');
        var  d;
        if (angular.isArray(tmp)){
          d= tmp.find(function(x){
            return areaId.indexOf(x)>-1;
          });
          if (d){
            vm.allRelations.push(t);
          }
        }
      })
    });


    vm.params={
          InspectionID:InspectionId,
          Remarks:"",
          Day:12
    }

    vm.Isfail=true;
    vm.submitResult = function(){
      $mdDialog.show({
        controller: ['$scope','utils','$mdDialog',function ($scope,utils,$mdDialog) {
          vm.data ={
            InspectionID:vm.params.InspectionID,
            Remarks:vm.params.Remarks,
            Day:vm.time,
        }
          remote.Procedure.createZGReceipt(vm.data).then(function(r){
            $mdDialog.hide();
            if (r){
              utils.alert("提交成功",null,function(){
                $state.go("app.xhsc.gx.gxmain",{index:0});
              });
            }
          },function(){
            $mdDialog.cancel();
          })
        }],
        template: '<md-dialog aria-label="正在提交"  ng-cloak><md-dialog-content> <md-progress-circular md-mode="indeterminate"></md-progress-circular><p style="padding-left: 6px;">正在上传提交数据.....,</p></md-dialog-content></md-dialog>',
        parent: angular.element(document.body),
        clickOutsideToClose:false,
        fullscreen: false
      });
    }
  }
})();
