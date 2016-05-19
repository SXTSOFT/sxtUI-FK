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
    console.log('project',project);

    vm.answer = function () {
      //cb ();
      $mdDialog.cancel ();
      //$state.go ('app.szgc.tzg', {pid: options.pid})
    };
  }
})();
