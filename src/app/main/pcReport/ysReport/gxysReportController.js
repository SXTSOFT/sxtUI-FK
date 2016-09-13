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
    .controller('gxysReportController',gxysReportController);

  /**@ngInject*/
  function gxysReportController($scope,remote,$mdDialog,$state,$rootScope ){
    var vm = this;
    var params=$rootScope.gxParams;
    vm.gxSelected=params&&params.gxSelected? params.gxSelected:[];
    vm.secSelected=params&&params.secSelected? params.secSelected:[];
    vm.show=false;

    function convertStatus(status){
      var zt=''
      switch (status){
        case 1:
          zt="待验收";
          break;
        case 2:
          zt="合格";
          break;
        case 4:
          zt="不合格";
          break;
        case 8:
          zt="未整改";
          break;
        case 16:
          zt="已整改";
          break;
        default:
          zt="未知";
          break;
      }
      return zt;
    }

    function load(){
      $mdDialog.show({
        controller: ['$scope','utils','$mdDialog',function ($scope,utils,$mdDialog) {
        }],
        template: '<md-dialog   ng-cloak><md-dialog-content layout="column"> <md-progress-circular class="md-accent md-hue-1" md-diameter="20" md-mode="indeterminate"></md-progress-circular><p style="padding-left: 6px;">数据加载中...</p></md-dialog-content></md-dialog>',
        parent: angular.element(document.body),
        clickOutsideToClose:false,
        fullscreen: false
      });
      vm.secSelected.length?vm.secSelected[0]:null;
      var tmp=[];
      vm.secSelected.forEach(function(k){
        tmp.push(k.AcceptanceItemID);
      });

      //remote.Procedure.GetInspectionInfoListEx({
      //  PageSize:5000,
      //  CurPage:0,
      //  status:31,
      //  ProjectId: vm.secSelected.length?vm.secSelected[0].RegionID:"",
      //  AcceptanceItemIDs:tmp
      //}).then(function(r){
      //  console.log(r);
      //});

      remote.Procedure.getInspections(31).then(function(r){
        var inspections=[];
        r.data.forEach(function(o){
          //非自检单并根据工序过滤
          if (o.Sign!=8&&(!vm.gxSelected.length||vm.gxSelected.find(function(k){
              return o.AcceptanceItemID== k.AcceptanceItemID
            }))){
            inspections.push(o);
          }
        });
        return inspections;
      }).then(function(res){
        var fiter= function(k){
          //根据选择的项目过滤
          var regionFilter= vm.secSelected.length?vm.secSelected[0]:null;
          return (!regionFilter|| k.ProjectID==regionFilter.RegionID)
        }
        if (angular.isArray(res)){
          vm.source=[];
          res.forEach(function(k){
            if (fiter(k)){
              k.statusName=convertStatus(k.Status)
              vm.source.push(k);
            }
          });
        }
        vm.show=true;
        $mdDialog.hide();
      }).catch(function(){
        vm.show=true;
        $mdDialog.cancel();
      });
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
