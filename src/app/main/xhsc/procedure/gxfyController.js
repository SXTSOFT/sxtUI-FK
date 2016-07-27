/**
 * Created by emma on 2016/7/1.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxfyController',gxfyController);

  /** @ngInject */
  function gxfyController($state,$rootScope,$scope,$mdDialog,$stateParams,remote,$q,utils,xhUtils){
    var vm = this;
    vm.ProjectID=$state.params.ProjectID;
    var InspectionID=$state.params.InspectionID;
    vm.AcceptanceItemID=$state.params.AcceptanceItemID;
    var RectificationID=$state.params.RectificationID;
      vm.role = 'fy';

    remote.Procedure.getRegionByInspectionID(InspectionID).then(function(r){
      vm.pareaList = r.data;
      if (angular.isArray(vm.pareaList)&&vm.pareaList.length){
        vm.regionSelect= r.data[0];
        load();
      }
    });

    function setChina(r) {
      switch (r) {
        case 0:
          return '合格';
          break;
        case 1:
          return '未整改';
          break;
      }
    }
    remote.Procedure.getRectification(RectificationID).then(function(r){
      vm.baseInfor = r.data;
      console.log('base',r)
      vm.baseInfor.zwStatus = setChina(r.data.Status);
    })
    function load(){

      if (!vm.regionSelect){
        return;
      }
      var promises=[
        remote.Procedure.getReginQues(vm.regionSelect.AreaID,vm.AcceptanceItemID),
        remote.Procedure.getPoints(vm.regionSelect.AreaID,vm.AcceptanceItemID)
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
    vm.showTop = function(){
      vm.slideShow = true;
    }
    vm.selectQy = function(item){
      vm.regionSelect = item;
      vm.qyslideShow = false;
      load();
    }
    vm.showBaseInfor = function(){
      $mdDialog.show({
        controller:['$scope',function($scope){
          $scope.baseInfo = vm.baseInfor;
          $scope.area = vm.regionSelect;
          $scope.submit = function(){
            $mdDialog.hide();
          }
        }],
        templateUrl:'app/main/xhsc/procedure/baseInforTemp.html',
        clickOutsideToClose:true
      })
    }

    vm.qyslide = function(){
      vm.qyslideShow = !vm.qyslideShow;
    }

    var gxfyChanged = $rootScope.$on('sendGxResult',function(){
      $mdDialog.show({
        controller:['$scope',function($scope){
          $scope.times = xhUtils.zgDays();
          $scope.submit = function(){
            $mdDialog.hide();
          }
        }],
        templateUrl:'app/main/xhsc/procedure/ngTemp.html',
        clickOutsideClose:true
      })
    });


    $scope.$on('$destroy', function () {
      gxfyChanged();
      gxfyChanged = null;
    })

    vm.nextRegion = function(prev){
      if (angular.isArray(vm.pareaList)&&vm.pareaList.length>0){
        var  index=vm.pareaList.indexOf(vm.regionSelect);
        if (prev){
          if ((index-1)>=0){
            vm.regionSelect=vm.pareaList[index-1];
            load();
            return;
          }
        }else {
          if ((index+1)<vm.pareaList.length){
            vm.regionSelect=vm.pareaList[index+1];
            load();
            return;
          }
        }
        utils.alert("查无数据!");
      }
    };
  }
})();
