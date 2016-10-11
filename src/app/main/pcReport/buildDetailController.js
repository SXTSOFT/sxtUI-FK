/**
 * Created by lss on 2016/10/7.
 */
(function(){
  'use strict';

  angular
    .module('app.pcReport')
    .controller('buildDetailController', buildDetailController)
    .constant('cookie', {})
  /** @ngInject */
  function buildDetailController($scope,$stateParams,$mdSidenav,api,$q,utils,remote,$timeout,cookie)
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
    vm.showTab=function(item){
      if (!item.SpecialtyChildren||!item.SpecialtyChildren.length){
          return false;
      }
      var gx= item.SpecialtyChildren;
      for (var  i=0;i<gx.length;i++){
        if (gx[i].WPAcceptanceList&&gx[i].WPAcceptanceList.length){
          return true;
        }
      }
      return false;
    }
    var  regionID=$stateParams.regionID;

    function  setgxSelectedValue(procedures){
      if (!angular.isArray(cookie.gx)||!cookie.gx.length){
        cookie.gx=[];
        return;
      }
      var arr=[];
      procedures.forEach(function(m){
        m.SpecialtyChildren.forEach(function(n){
          n.WPAcceptanceList.forEach(function(k){
            arr.push(k);
          });
        })
      });
      var t;
      cookie.gx.forEach(function(k){
        t= arr.find(function(m){
          return m.AcceptanceItemID== k.AcceptanceItemID;
        })
        if (t){
          t.checked=true;
          $scope.gxSelected.push(t);
        }
      });
    }
    var pro=[
      remote.Project.getRegionAndChildren(regionID),
      remote.Procedure.getRegionStatusEx(regionID),
      remote.Procedure.queryProcedure()
    ]
    function render(){
      $timeout(function(){
        if (!cookie.gx||!cookie.gx.length){
          vm.openGx();
          return;
        }
        vm.query();
      });
    }

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
        setgxSelectedValue($scope.procedures);
      }
      render();
      vm.loading=false;
    }).catch(function(){
      vm.loading=false;
      render();
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
      cookie.gx=$scope.gxSelected;
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

    $scope.remove=function(item){
      $timeout(function(){
        var index=$scope.gxSelected.indexOf(item);
        if (index>-1){
          $scope.gxSelected.splice(index,1);
        }
        cookie.gx=$scope.gxSelected;
      })
    }
    vm.openGx = buildToggler('procedure_right');
  }
})();
