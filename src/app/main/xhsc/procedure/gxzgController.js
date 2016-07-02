/**
 * Created by emma on 2016/7/1.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxzgController',gxzgController);

  /** @ngInject */
  function gxzgController($state,$rootScope,$scope,$mdDialog,remote,$timeout,$q){
    var vm = this,
      ProjectID=$state.params.ProjectID,
      InspectionID=$state.params.InspectionID,
      AcceptanceItemID=$state.params.AcceptanceItemID,
      RectificationID=$state.params.RectificationID;
    vm.role = 'zg';

    vm.info={
      projectId:ProjectID,
      procedure:"",
      regionId:"",
      regionName:""
    };
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
          $scope.submit = function(){
            $mdDialog.hide();
          }
        }],
        templateUrl:'app/main/xhsc/procedure/baseInforTemp.html',
        clickOutsideClose:true
      })
    }

    vm.qyslide = function(){
      vm.qyslideShow = !vm.qyslideShow;
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
      gxzgChanged = null;
    })

    vm.nextRegion = function(prev){
      function setNext(regions){
        var region=regions.find(function(o){
          return vm.info.regionId== o.RegionID;
        });
        var index=regions.indexOf(region);
        if (prev){
          if ((index-1)>=0){
            vm.setRegion(regions[index-1]);
            return;
          }
        }else {
          if ((index+1)<regions.length){
            vm.setRegion(regions[index+1]);
            return;
          }
        }
        utils.alert("查无数据!");
      }

      if(vm.pareaList){
        setNext(vm.pareaList);
      }else {
        remote.Procedure.getRegionByInspectionID(InspectionID).then(function(r){
          vm.pareaList = r.data;
          setNext(vm.pareaList);
        });
      }
    };
  }
})();
