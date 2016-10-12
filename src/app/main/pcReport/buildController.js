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
    remote.Project.getRegionWithRight($stateParams.projectId).then(function(r){
        vm.builds=[];
         var floors=[];
         r.data.forEach(function(k){
            if (k.RegionType==4){
              vm.builds.push({
                building_id: k.RegionID,
                gx1:0,
                gx2:0,
                name: k.RegionName,
                sellLine:-1000,
                summary:""
              })
            }
            if (k.RegionType==8){
              floors.push({
                regionID: k.RegionID,
                regionName: k.RegionName
              });
            }
         });
        var  arr;
      vm.builds.forEach(function(k){
          arr=[];
          floors.forEach(function(n){
            if (n.regionID.indexOf(k.building_id)>-1){
              arr.push(n);
            }
          })
          k.floors=arr.length;
          k.floorData=arr;
        })

        //vm.area= r&& r.data? r.data:[];
        //vm.area.forEach(function(k){
        //  remote.Project.GetAreaChildenbyID(k.RegionID).then(function(n){
        //    k.children=n&& n.data? n.data:[];
        //  });
        //});
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
;
