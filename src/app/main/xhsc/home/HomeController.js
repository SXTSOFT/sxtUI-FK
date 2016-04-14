/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('HomeController',HomeController);

  /** @ngInject */
  function HomeController(){
    var vm = this;
    vm.OK = function(){
      vm.okValue = ' okValue ';
    }
    vm.bass = Math.floor(Math.random() * 100);
    vm.bassa = Math.floor(Math.random() * 100);
    vm.showFlag = false;
    vm.showMDBar = function(){
      vm.showFlag = !vm.showFlag;
    }
    vm.images=[{'url':'app/main/xhsc/images/camera.png'},
      {'url':'app/main/xhsc/images/camera.png'},
      {'url':'app/main/xhsc/images/camera.png'},
      {'url':'app/main/xhsc/images/camera.png'},
      {'url':'app/main/xhsc/images/camera.png'},
      {'url':'app/main/xhsc/images/camera.png'}
    ];
  }

})();
