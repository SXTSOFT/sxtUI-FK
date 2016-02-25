/**
 * Created by zhangzhaoyong on 16/2/3.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .controller('SzgcyhydController', SzgcyhydController);

  /** @ngInject */
  function SzgcyhydController(api,$stateParams,$rootScope)
  {

    var vm = this;

    vm.back = function(){
      history.back();
    }
    vm.showImg = function () {
      $rootScope.$emit('sxtImageViewAll');
    }
    vm.data = {
      projectId: $stateParams.pid,
      projectName:$stateParams.pname
    };
    //vm.$parent.data.pname = vm.data.projectName;
    $rootScope.title = vm.data.projectName;

    vm.sellLine = 0.6;

    vm.project = {
      onQueryed: function(data) {
        if (!vm.project.pid) {
          vm.project.data = data;
          //queryTable();
        }
      }
    };
  }

})();
