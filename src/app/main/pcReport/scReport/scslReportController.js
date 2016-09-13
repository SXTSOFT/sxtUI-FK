/**
 * Created by lss on 2016/9/13.
 */
/**
 * Created by lss on 2016/9/12.
 */
/**
 * Created by lss on 2016/9/8.
 */
/**
 * Created by emma on 2016/6/7.
 */
(function(){
  'use strict';

  angular
    .module('app.pcReport_ys')
    .controller('scslReportController',scslReportController);

  /**@ngInject*/
  function scslReportController($scope,remote,$mdDialog,$state,$rootScope ,$q){
    var vm = this;
    var params=$rootScope.scParams;
    vm.scSelected=params&&params.scSelected? params.scSelected:[];
    vm.secSelected=params&&params.secSelected? params.secSelected:[];
    vm.show=false;



    function load(){
      $mdDialog.show({
        controller: ['$scope','utils','$mdDialog',function ($scope,utils,$mdDialog) {
        }],
        template: '<md-dialog   ng-cloak><md-dialog-content layout="column"> <md-progress-circular class="md-accent md-hue-1" md-diameter="20" md-mode="indeterminate"></md-progress-circular><p style="padding-left: 6px;">数据加载中...</p></md-dialog-content></md-dialog>',
        parent: angular.element(document.body),
        clickOutsideToClose:false,
        fullscreen: false
      });
      $q(function(resolve,reject){
          var source=[{
            CompanyID:"深圳公司",
            CompanyName:"深圳公司",
            ProjectName:"深圳雅宝项目",
            ProjectID:"",
            AreaID:"",
            AreaName:"星河雅宝-5号地块-3栋-1层"
          },{
            CompanyID:"深圳公司",
            CompanyName:"深圳公司",
            ProjectName:"深圳雅宝项目",
            ProjectID:"",
            AreaID:"",
            AreaName:"星河雅宝-5号地块-3栋-2层"
          },{
          CompanyID:"深圳公司",
            CompanyName:"深圳公司",
            ProjectName:"深圳雅宝项目",
            ProjectID:"",
            AreaID:"",
            AreaName:"星河雅宝-5号地块-3栋-3层"
        }];
        resolve(vm.source)
      }).then(function(r){
        vm.show=r;
        vm.show=true;
        $mdDialog.hide();
      }).catch(function(){
        vm.show=true;
        $mdDialog.cancel();
      })
    }
    load();
    vm.goBack=function(){
      window.history.go(-1);
    }
    vm.Lookintoys = function(item){
      $state.go('app.xhsc.gx.gxzgreport',{InspectionId:item.InspectionId, acceptanceItemID:item.AcceptanceItemID,acceptanceItemName:item.AcceptanceItemName,projectId:item.ProjectID});
    }
  }
})();
