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
  function gxysReportController($scope,remote,$mdDialog,$state ){
    var vm = this;
    vm.gxSelected=[];
    vm.secSelected=[]
    vm.regions=[{
      RegionID:'00023',
      RegionName:'星河雅宝项目'
    }]

    load();

    function load(){
     return  remote.Procedure.getInspections(31).then(function(r){
        vm.Inspections=[];
        r.data.forEach(function(o){
          if (o.Sign!=8){
            vm.Inspections.push(o);
          }
        });
        return  vm.Inspections;
      });
    }
    vm.render=false;
    vm.Lookintoys = function(item){
      $state.go('app.xhsc.gx.gxzgreport',{InspectionId:item.InspectionId, acceptanceItemID:item.AcceptanceItemID,acceptanceItemName:item.AcceptanceItemName,projectId:item.ProjectID});
    }
    vm.submit=function(res){
        function callBack(res){
         var fiter= function(k){
           var regionFilter= vm.secSelected.length?vm.secSelected[0]:null;

           return (!regionFilter|| k.ProjectID==regionFilter.RegionID)&&(!vm.gxSelected.length||
              vm.gxSelected.find(function(m){
                return m.AcceptanceItemID== k.AcceptanceItemID
            }))
          }
         if (angular.isArray(res)){
            vm.source=[];
            res.forEach(function(k){
              if (fiter(k)){

                vm.source.push(k);
              }
            });
          }
         $mdDialog.hide();
         vm.render=true;
        }
        if (!vm.Inspections||!vm.Inspections.length){
          $mdDialog.show({
            controller: ['$scope','utils','$mdDialog',function ($scope,utils,$mdDialog) {
            }],
            template: '<md-dialog   ng-cloak><md-dialog-content layout="column"> <md-progress-circular class="md-accent md-hue-1" md-diameter="20" md-mode="indeterminate"></md-progress-circular><p style="padding-left: 6px;">数据加载中...</p></md-dialog-content></md-dialog>',
            parent: angular.element(document.body),
            clickOutsideToClose:false,
            fullscreen: false
          });
          load().then(callBack).catch(function(){
            vm.render=true;
            $mdDialog.cancel();
          });
        }else {
          callBack( vm.Inspections);
        }
    }
  }
})();
