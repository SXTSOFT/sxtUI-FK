/**
 * Created by emma on 2016/11/15.
 */
(function(){
  'use strict';

  angular
    .module('app.inspection')
    .component('inspectionCheck',{
      templateUrl:'app/main/inspection/component/inspection-check.html',
      controller:inspectionCheckController,
      controllerAs:'vm'
    });

  /**@ngInject*/
  function inspectionCheckController($scope,$rootScope,utils,$state,$mdPanel){
    var vm = this;
    //$rootScope.shell.title='A201';
    vm.showPopup = false;
    //vm.add = function(){
    //  vm.showPopup = true;
    //}
    //vm.showCjwt = function(){
    //  var position = $mdPanel.newPanelPosition()
    //    .relativeTo('md-toolbar')
    //    .addPanelPosition($mdPanel.xPosition.ALIGN_START, $mdPanel.yPosition.BELOW)
    //    .bottom(0)
    //    .right(0)
    //
    //  $mdPanel.open({
    //    controller: function () {
    //
    //    },
    //    template: '<inspection-cjwt layout="column" flex></inspection-cjwt>',
    //    hasBackdrop: false,
    //    position: position,
    //    trapFocus: true,
    //    panelClass: 'is-cjwt',
    //    zIndex: 5000,
    //    clickOutsideToClose: true,
    //    escapeToClose: true,
    //    focusOnOpen: true,
    //    attachTo:angular.element('#content')
    //  });
    //}
    utils.onCmd($scope,['cjwt','csb','prev'],function(cmd,e){
      switch (cmd){
        case 'csb':
              $state.go('app.meterreading.page')
              break;
        case 'cjwt':
          $state.go('app.inspection.cjwt');
              //vm.showCjwt();
              break;
      }
    })
  }
})();
