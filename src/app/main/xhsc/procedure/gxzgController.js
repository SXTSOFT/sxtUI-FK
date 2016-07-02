/**
 * Created by emma on 2016/7/1.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxzgController',gxzgController);

  /** @ngInject */
  function gxzgController($state,$rootScope,$scope,remote,$q){
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
      if (!vm.regionSelect){
        return;
      }
      var promises=[
        remote.Procedure.getReginQues(vm.regionSelect.AreaID,AcceptanceItemID),
        remote.Procedure.getPoints(vm.regionSelect.AreaID,AcceptanceItemID)
      ]
      vm.ques=[];
      $q.all(promises).then(function(res){
        var ques=res[0].data;
        vm.points=res[1].data;
            if (ques&&ques.length){
              ques.forEach(function(t){
                if (vm.points&&vm.points.length){
                  vm.points.forEach(function(m){
                    if (t.IndexPointID== m.IndexPointID){
                      if (!t.points){
                        t.points=[];
                      }
                      t.points.push(m);
                    }
                  });
                }
                vm.ques.push(t);
              });
          }
        console.log(vm.ques);
      })
    }

    vm.selectQy = function(item){
      vm.regionSelect = item;
      vm.qyslideShow = false;
      load();
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
