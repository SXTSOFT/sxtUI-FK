/**
 * Created by emma on 2016/7/1.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxzgController',gxzgController);

  /** @ngInject */
  function gxzgController($state,$rootScope,$scope,remote){
    var vm = this,
      ProjectID=$state.params.ProjectID,
      InspectionID=$state.params.InspectionID,
      AcceptanceItemID=$state.params.AcceptanceItemID,
      RectificationID=$state.params.RectificationID;

    vm.showTop = function(){
      vm.slideShow = true;
    }

    remote.Procedure.getRegionByInspectionID(InspectionID).then(function(r){
      vm.pareaList = r.data;
      if (angular.isArray(vm.pareaList)&&vm.pareaList.length){
          vm.regionSelect= r.data[0];
          load();
      }
    });

    function load(){
      //if(){
      //
      //}
    }

    vm.selectQy = function(item){
      vm.regionSelect = item;
      vm.qyslideShow = false;
    }
    vm.qyslide = function(){
      vm.qyslideShow = !vm.qyslideShow;
    }
    var gxChanged = function(){
      console.log('changed')
    }
    $rootScope.$on('sendGxResult',gxChanged);

    $scope.$on('$destroy', function () {
      gxChanged();
      gxChanged = null;
    })
  }


})();
