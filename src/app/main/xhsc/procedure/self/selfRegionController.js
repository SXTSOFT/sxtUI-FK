/**
 * Created by shaoshun on 2017/3/1.
 */
/**
 * Created by shaoshun on 2017/3/1.
 */
/**
 * Created by emma on 2016/7/1.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('selfRegionController',selfRegionController);

  /** @ngInject */
  function selfRegionController($state,$rootScope,$scope,$mdDialog,$stateParams,remote,$q,utils,xhUtils,xhscService){
    var vm = this;
    vm.isOver=true;
    vm.selected=[];
    vm.acceptanceitemIDs=  $stateParams.acceptanceitemIDs;
    var ok = $rootScope.$on('ok',function(){
      if (!vm.selected.length){
        utils.alert("至少应该选择一个区域!");
        return;
      }
      var regionIds=vm.selected.map(function (o) {
        return o.RegionID;
      }).join(",");
      $mdDialog.show({
        controller: ['$scope', 'utils', '$mdDialog', function ($scope, utils, $mdDialog) {
          setTimeout(function () {
            $mdDialog.hide();
            $state.go("app.xhsc.gx.selfMain");
          },2000)
        }],
        template: '<md-dialog aria-label="正在提交"  ng-cloak><md-dialog-content> <md-progress-circular md-diameter="28" md-mode="indeterminate"></md-progress-circular><p style="padding-left: 6px;">正在提交数据...</p></md-dialog-content></md-dialog>',
        parent: angular.element(document.body),
        clickOutsideToClose: false,
        fullscreen: false
      });
    });

    $scope.$on('$destroy', function () {
      ok()
      ok = null;
    })

  }
})();
