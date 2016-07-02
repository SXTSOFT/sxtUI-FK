/**
 * Created by emma on 2016/7/1.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxzgController',gxzgController);

  /** @ngInject */
  function gxzgController($state,$rootScope,$scope,$mdDialog,remote,$timeout){
    var vm = this,
    ProjectID=$state.params.ProjectID,
      InspectionID=$state.params.InspectionID,
      AcceptanceItemID=$state.params.AcceptanceItemID,
      RectificationID=$state.params.RectificationID;
    vm.role = 'zg';
    remote.Procedure.getRegionByInspectionID(InspectionID).then(function(r){
      vm.pareaList = r.data;
      if (angular.isArray(vm.pareaList)&&vm.pareaList.length){
        vm.regionSelect= r.data[0];
        load();
      }
      console.log('vm',vm.pareaList)
      vm.mapInfo = {
        projectId:ProjectID,
        acceptanceItemId:AcceptanceItemID,
        areaId:vm.pareaList[0].AreaID
      }
    });

    function load(){
      //if(){
      //
      //}
    }
    vm.showTop = function(){
      vm.slideShow = true;
    }
    //vm.pareaList =[{
    //  name:'一区'
    //},{
    //  name:'二区'
    //}];
    vm.selectQy = function(item){
      vm.regionSelect = item;
      vm.qyslideShow = false;
      vm.mapInfo.areaId = item.AreaID;
    }
    vm.showBaseInfor = function(){
      $mdDialog.show({
        controller:['$scope',function($scope){
          $scope.submit = function(){
            $mdDialog.hide();
          }
        }],
        templateUrl:'app/main/xhsc/procedure/baseInforTemp.html',
        clickOutsideClose:true
      })
    }

    vm.qyslide = function(){
      if(vm.pareaList.length>1){
        vm.qyslideShow = !vm.qyslideShow;
      }
    }

    var gxzgChanged = $rootScope.$on('sendGxResult',function(){
      console.log('changed')
          $mdDialog.show({
            controller:['$scope',function($scope){
              $scope.times = [{
                time:'6小时'
              },{
                time:'12小时'
              },{
                time:'一天'
              },{
                time:'二天'
              },{
                time:'三天'
              },{
                time:'四天'
              },{
                time:'五天'
              },{
                time:'六天'
              },{
                time:'一周'
              },{
                time:'二周'
              },{
                time:'三周'
              },{
                time:'一个月'
              },{
                time:'二个月'
              },{
                time:'三个月'
              }]
              $scope.submit = function(){
                $mdDialog.hide();
              }
            }],
            templateUrl:'app/main/xhsc/procedure/ngTemp.html',
            clickOutsideClose:true
          })
    });

    $scope.$on('$destroy', function () {
      gxzgChanged();
      //console.log('destroy')
      gxzgChanged = null;
    })
  }
})();
