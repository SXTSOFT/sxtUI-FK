/**
 * Created by lss on 2016/9/18.
 */
/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.pcReport')
    .controller('buildController',buildController);

  /** @ngInject */
  function buildController($scope,$stateParams,remote,$mdDialog,$state ){
    var vm=this;
    vm.projectName=$stateParams.projectName;
    remote.Project.GetAreaChildenbyID($stateParams.projectId).then(function(r){
        vm.area= r&& r.data? r.data:[];
        vm.area.forEach(function(k){
          remote.Project.GetAreaChildenbyID(k.RegionID).then(function(n){
            k.children=n&& n.data? n.data:[];
          });
        });
    });
    vm.showECs = function(evt,item) {
      $mdDialog.show({
          controller: ['$scope', '$mdDialog','item', function DialogController(scope, $mdDialog,item) {

            scope.goSC=function(){
              $state.go("app.pcReport_scbdd",{regionID:item.RegionID});
              $mdDialog.hide();
            }
            scope.goGX=function(){
              $state.go("app.pcReport_bdd",{regionID:item.RegionID});
              $mdDialog.hide();
            }
          }],
          templateUrl: 'app/main/pcReport/htmlTemplate/actiongxOrsc.html',
          parent: angular.element(document.body),
          targetEvent: evt,
          focusOnOpen:false,
          locals:{
            item:item
          },
          clickOutsideToClose: true
        })
        .then(function(answer) {
        });
    };
  }
})();
/**
 * Created by lss on 2016/10/7.
 */
