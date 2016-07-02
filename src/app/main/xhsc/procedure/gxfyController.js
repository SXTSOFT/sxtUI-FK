/**
 * Created by emma on 2016/7/1.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxfyController',gxfyController);

  /** @ngInject */
  function gxfyController($state,$rootScope,$scope,$mdDialog){
    var vm = this;

    vm.showTop = function(){
      vm.slideShow = true;
    }
    vm.pareaList =[{
      name:'一区'
    },{
      name:'二区'
    }];
    vm.selectQy = function(item){
      vm.RegionFullName = item.name;
      vm.qyslideShow = false;
    }
    vm.qyslide = function(){
      vm.qyslideShow = !vm.qyslideShow;
    }
    vm.role = 'fy';
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
    var gxfyChanged = $rootScope.$on('sendGxResult',function(){
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
      gxfyChanged();
      console.log('destroy')
      gxfyChanged = null;
    })
  }
})();
