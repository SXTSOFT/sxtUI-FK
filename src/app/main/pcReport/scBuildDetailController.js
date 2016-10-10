/**
 * Created by lss on 2016/10/10.
 */
/**
 * Created by lss on 2016/10/7.
 */
(function(){
  'use strict';

  angular
    .module('app.pcReport')
    .controller('scBuildDetailController', scBuildDetailController);

  /** @ngInject */
  function scBuildDetailController($scope,$stateParams,$mdSidenav,api,$q,utils,remote,$timeout)
  {
    function buildToggler(navID) {
      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
          });
      }
    }
    var vm = this;
    vm.loading=true;
    $scope.gxSelected=[];
    vm.build={};
    var  regionID=$stateParams.regionID;
    var pro=[
      remote.Project.getRegionAndChildren(regionID),
      remote.Procedure.getRegionStatus(regionID),
      remote.Assessment.GetMeasureItemInfoByAreaID(regionID)
    ]
    $q.all(pro).then(function(res){
      vm.build.regions=res[0].data;
      var b=vm.build.regions.find(function(k){
        return k.RegionType==4;
      })
      vm.build.name=b? b.RegionName:"";
      vm.build.status=res[1].data;
      var r=res[2];
      if (r.data&&angular.isArray(r.data.data)){
        $scope.procedures= r.data.data;
      }
      vm.loading=false;
    }).catch(function(){
    });
    $timeout(function(){
      vm.openGx();
    });


    vm.query = function () {
      vm.build.query();
    };

    $scope.$watch('vm.build.isOpen',function () {
      if (!vm.build.isOpen&&vm.build.isOpen!==false){
        return;
      }
      if (!vm.build.isOpen){
        if (!$scope.gxSelected.length){
          utils.alert('请选择要显示的工序').then(function () {
            vm.openGx();
          });
          return;
        }
        if ($scope.gxSelected.length>4){
          utils.alert('最多只能选择4个实测项').then(function () {
            vm.openGx();
          })
          return;
        }
        vm.query();
      }
    })

    $scope.remove=function(item){
      $timeout(function(){
        if (item.checked){
          $scope.gxSelected.push(item)
        }else {
          var index=$scope.gxSelected.indexOf(item);
          if (index>-1){
            $scope.gxSelected.splice(index,1);
          }
        }
      })
    }
    vm.openGx = buildToggler('procedure_right');
  }
})();
