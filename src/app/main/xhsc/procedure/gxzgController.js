/**
 * Created by emma on 2016/7/1.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxzgController',gxzgController);

  /** @ngInject */
  function gxzgController($state,$rootScope,$scope){
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
