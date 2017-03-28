/**
 * Created by jiuyuong on 2016/4/6.
 */
(function(){
  'use strict';
  angular
    .module('app.szgc')
    .controller('SzgcyhydDlgController',SzgcyhydDlgController);

  /** @ngInject */
  function SzgcyhydDlgController(project,$mdDialog){
    var vm = this;
    vm.project = project;
    if(vm.project.nameTree){
      vm.rtlName = vm.project.nameTree.length>16?
        '..'+vm.project.nameTree.substr(vm.project.nameTree.length-16,16):
        vm.project.nameTree;
    }
    vm.show = false;

    vm.answer = function () {
      //cb ();
      $mdDialog.cancel ();
      //$state.go ('app.szgc.tzg', {pid: options.pid})
    };
  }
})();
