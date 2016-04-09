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
    vm.data={
      id:'5667277272f69e5c23094929',
      isShow:1,
      roomType:'A',
      imageType:project.n
    }
    console.log('project',project);

    vm.answer = function () {
      //cb ();
      $mdDialog.cancel ();
      //$state.go ('app.szgc.tzg', {pid: options.pid})
    };
  }
})();
