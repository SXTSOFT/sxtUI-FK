/**
 * Created by zhangzhaoyong on 16/2/3.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .controller('SzgcyhydController', SzgcyhydController);

  /** @ngInject */
  function SzgcyhydController($scope,api,$stateParams,$rootScope,$cookies,$timeout)
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
    vm.setProject=function(){
      $cookies.put('projects', JSON.stringify([{
        project_id: vm.data.projectId,
        name: vm.data.projectName
      }]));
    }

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
