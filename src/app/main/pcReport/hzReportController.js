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
  function hzReportController(remote,$state,$q,utils,api,$mdDialog){
    var vm=this;
    vm.rendered=false;
    $mdDialog.show({
      controller: ['$scope','utils','$mdDialog',function ($scope,utils,$mdDialog) {
      }],
      template: '<md-dialog   ng-cloak><md-dialog-content layout="column"> <md-progress-circular class="md-accent md-hue-1" md-diameter="20" md-mode="indeterminate"></md-progress-circular><p style="padding-left: 6px;">数据加载中...</p></md-dialog-content></md-dialog>',
      parent: angular.element(document.body),
      clickOutsideToClose:false,
      fullscreen: false
    });

    remote.Report.Summary().then(function(r){
      vm.report= r.data? r.data:[];
      vm.rendered=true;
      $mdDialog.hide();
    }).catch(function(){
      vm.rendered=true;
      vm.report=[];
      $mdDialog.cancel();
    });
  }
})();
