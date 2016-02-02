/**
 * Created by zhangzhaoyong on 16/2/3.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .controller('SzgcyhydController', SzgcyhydController);

  /** @ngInject */
  function SzgcyhydController()
  {

    var vm = this;
    vm.link = 'http://vkde.sxtsoft.com/yhyd/';
    vm.back = function(){
      history.back();
    }

  }

})();
