/**
 * Created by lss on 2016/10/7.
 */
(function(){
  'use strict';

  angular
    .module('app.pcReport')
    .controller('buildDetailController', buildDetailController);

  /** @ngInject */
  function buildDetailController($scope,$stateParams,$mdSidenav,api,$q,utils,remote,$timeout)
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
      remote.Procedure.queryProcedure()
    ]
    $q.all(pro).then(function(res){
      vm.build.regions=res[0].data;
      var b=vm.build.regions.find(function(k){
          return k.RegionType==4;
      })
      vm.build.name=b? b.RegionName:"";
      vm.build.status=res[1].data;
      var r=res[2];
      if (r.data&&angular.isArray(r.data)){
        $scope.procedures= r.data;
      }
      vm.loading=false;
      $timeout(function(){
        vm.openGx();
      });
    }).catch(function(){
      vm.openGx();
    });

    $scope.choosego=function(item){
      var p=$scope.gxSelected.find(function(o){
        return o.AcceptanceItemID==item.AcceptanceItemID;
      });
      if (!p&&!item.checked){
        $scope.gxSelected.push(item)
      }
      if (p&&item.checked){
        var index=$scope.gxSelected.indexOf(p);
        $scope.gxSelected.splice(index,1);
      }
    }


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
          utils.alert('最多只能选择4个工序').then(function () {
            vm.openGx();
          })
          return;
        }
        vm.query();
      }
    })

    $scope.selectSpecialtyLow=function(item,parent){
      parent.WPAcceptanceList=item.WPAcceptanceList;
    }
    $scope.remove=function(item){
      $timeout(function(){
        var index=$scope.gxSelected.indexOf(item);
        if (index>-1){
          $scope.gxSelected.splice(index,1);
        }
      })
    }
    vm.openGx = buildToggler('procedure_right');
  }
})();
