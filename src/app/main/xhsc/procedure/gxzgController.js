/**
 * Created by emma on 2016/7/1.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxzgController',gxzgController);

  /** @ngInject */
  function gxzgController($state,$rootScope,$scope,$mdDialog,remote,$timeout,$q,utils){
    var vm = this;
      vm.ProjectID=$state.params.ProjectID;
      var InspectionID=$state.params.InspectionID;
      vm.AcceptanceItemID=$state.params.AcceptanceItemID;
      var RectificationID=$state.params.RectificationID;
    vm.role = 'zg';

    remote.Procedure.getZGById(RectificationID).then(function (r) {
      vm.Rectification = r.data;
      vm.pareaList = vm.Rectification.Children;
      vm.regionSelect = vm.pareaList[0];
      load();
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
      vm.baseInfor.zwStatus = setChina(r.data.Status);
    })
    function load(){

      if (!vm.regionSelect){
        return;
      }
      var promises=[
        remote.Procedure.getZGReginQues(vm.regionSelect.AreaID,RectificationID)/*,
        remote.Procedure.getZGReginQuesPoint(vm.regionSelect.AreaID,RectificationID)*/
      ]
      vm.ques=[];
      $q.all(promises).then(function(res){
        vm.items = res.data;
        res[0].data.forEach(function (item) {
          var fd = vm.ques.find(function (it) {
            return it.IndexPointID==item.IndexPointID;
          });
          if(!fd){
            fd = item;
            vm.ques.push(fd);
            fd.Points = 1;
          }
          else{
            fd.Points++;
          }
        })

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

    var gxzgChanged = $rootScope.$on('sendGxResult',function(){
      $mdDialog.show({
        controller:['$scope',function($scope){
          $scope.times = [{
            value:6,
            time:'6小时'
          },{
            value:12,
            time:'12小时'
          },{
            value:24,
            time:'1天'
          },{
            value:24*2,
            time:'2天'
          },{
            value:24*3,
            time:'3天'
          },{
            value:24*4,
            time:'4天'
          },{
            value:24*5,
            time:'5天'
          },{
            value:24*6,
            time:'6天'
          },{
            value:24*7,
            time:'7天'
          },{
            value:24*15,
            time:'15天'
          }];
          $scope.cancel = function(){
            $mdDialog.hide();
          }
          $scope.submit = function(){
            $mdDialog.hide();
          }
          remote.Procedure.getZGReginQues(vm.regionSelect.AreaID,RectificationID).then(function (r) {
            $scope.status = {}
          })
        }],
        templateUrl:'app/main/xhsc/procedure/ngTemp.html',
        clickOutsideToClose:true
      })
    });

    $scope.$on('$destroy', function () {
      gxzgChanged();
      gxzgChanged = null;
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
