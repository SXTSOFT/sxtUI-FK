/**
 * Created by lss on 2016/9/12.
 */
/**
 * Created by lss on 2016/8/16.
 */
(function(){
  'use strict';

  angular
    .module('app.pcReport')
    .controller('hzReportController',hzReportController);

  /** @ngInject */
  function hzReportController(remote,$state,$q,utils,$mdDialog,$mdSidenav,$rootScope){
    var vm=this;
    vm.rendered=false;
    //$mdDialog.show({
    //  controller: ['$scope','utils','$mdDialog',function ($scope,utils,$mdDialog) {
    //  }],
    //  template: '<md-dialog   ng-cloak><md-dialog-content layout="column"> <md-progress-circular class="md-accent md-hue-1" md-diameter="20" md-mode="indeterminate"></md-progress-circular><p style="padding-left: 6px;">数据加载中...</p></md-dialog-content></md-dialog>',
    //  parent: angular.element(document.body),
    //  clickOutsideToClose:false,
    //  fullscreen: false
    //});
    vm.selecte=function(item){
      vm.current=item;
      $mdSidenav("reportDT")
        .toggle()
    }
    vm.pageAction=function(info, page, pageSize, total){
        console.log(info+'-'+page);
    }
    vm.goDetail=function(flag){
        switch (flag){
          case 0:
            $rootScope.gxParams={
              secSelected:[{
                RegionID:vm.current.ProjectID,
                RegionName: vm.current.ProjectName
              }],
              gxSelected:[]
            };
            $state.go("app.pcReport_ys_rp");
                break;
          case 1:
            $state.go("app.pcReport_sl_rp",{
              scSelected:"",
              secSelected:vm.current.ProjectID
            });
            break;
        }
    }
    remote.Report.Summary().then(function(r){
      vm.report= r.data? r.data:[];
      vm.rendered=true;
      //$mdDialog.hide();
    }).catch(function(){
      vm.rendered=true;
      vm.report=[];
      //$mdDialog.cancel();
    });
  }
})();
