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
  function buildController($scope,$stateParams,remote,$mdDialog,$state ,$q){
    var vm=this;
    vm.projectName=$stateParams.projectName;
    $q.all([
      remote.Project.getRegionAndChildren($stateParams.projectId)
    ]).then(function(res){
        var r=res[0];
        vm.areas = [];
        var builds = [];
        var floors = [];

        r.data.forEach(function (k) {
          if (k.RegionType == 2) {
            vm.areas.push(k);
          }
          if (k.RegionType == 4) {
            builds.push({
              building_id: k.RegionID,
              gx1: 5,
              gx2: 0,
              name: k.RegionName,
              //sellLine: -100,
              summary: ""
            })
          }
          if (k.RegionType == 8) {
            floors.push({
              regionID: k.RegionID,
              regionName: k.RegionName
            });
          }
        });
        var arr;
        builds.forEach(function (k) {
          arr = [];
          floors.forEach(function (n) {
            if (n.regionID.indexOf(k.building_id) > -1) {
              arr.push(n);
            }
          })
          k.floors = arr.length;
          k.sellLine=parseInt(k.floors*0.67)
          k.floorData = arr;
        })
        vm.maxLen=0
        vm.areas.forEach(function(k){
          k.builds=[];
          builds.forEach(function(n){
            if (n.building_id.indexOf(k.RegionID)>-1){
              k.builds.push(n);
            }
          });
          k.builds.forEach(function(u){
            if (vm.maxLen< u.floors){
              vm.maxLen=u.floors;
            }
          })
        })
    });

    remote.Project.getRegionAndChildren($stateParams.projectId).then(function(r){

    });



    vm.showECs = function(evt,item) {
      $mdDialog.show({
          controller: ['$scope', '$mdDialog','item', function DialogController(scope, $mdDialog,item) {

            scope.goSC=function(){
              $state.go("app.pcReport_scbdd",{regionID:item.building_id});
              $mdDialog.hide();
            }
            scope.goGX=function(){
              $state.go("app.pcReport_bdd",{regionID:item.building_id});
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
;
