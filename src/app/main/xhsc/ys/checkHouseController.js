/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('checkHouseController',checkHouseController);

  /** @ngInject */
  function checkHouseController($rootScope){
    var vm=this;
    var tabs = [
        { title: '长度', content: "Tabs will become paginated if there isn't enough room for them."},
        { title: '宽度', content: "You can swipe left and right on a mobile device to change tabs."},
        { title: '高度', content: "You can bind the selected tab via the selected attribute on the md-tabs element."}
      ],
      selected = null,
      previous = null;
    vm.tabs = tabs;
    vm.rooms=[101,102,103];
    vm.roomIndex = 0;
    $rootScope.subtitle = vm.rooms[vm.roomIndex];
    function Left(){
      vm.roomIndex --;
      if(vm.roomIndex <=0) vm.roomIndex = 0;
      $rootScope.subtitle = vm.rooms[vm.roomIndex];
    }
    function Right(){
      vm.roomIndex ++;
      if(vm.roomIndex >= vm.rooms.length){
        vm.roomIndex = vm.rooms.length-1;
        return;
      }
      $rootScope.subtitle = vm.rooms[vm.roomIndex];
    }

    $rootScope.$on('leftEvent',Left);
    $rootScope.$on('rightEvent',Right);
  }
})();
