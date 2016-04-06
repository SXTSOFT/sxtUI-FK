/**
 * Created by zhangzhaoyong on 16/2/3.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .controller('SzgcyhydController', SzgcyhydController);

  /** @ngInject */
  function SzgcyhydController(api,$mdDialog,$rootScope,$scope,utils)
  {

    var vm = this;
    vm.project ={};

    $scope.$watch('vm.project.nameTree',function(){
      $rootScope.title = vm.project.nameTree;
    })

    var whenBack = function(e,data){
      if(vm.showPlayer || vm.searBarHide ){
        data.cancel = true;
        if(vm.showPlayer){
          vm.showPlayer =false;
        }
        else if(vm.searBarHide){
          vm.searBarHide = false;
        }
      }
    }
    $scope.$on('goBack',whenBack);
    vm.play = function(n){
      $mdDialog.show({
          locals:{
            project:vm.project
          },
          controller: 'SzgcyhydDlgController as vm',
          templateUrl: 'app/main/szgc/home/SzgcyhydDlg.html',
          parent: angular.element(document.body),
          clickOutsideToClose:true,
          fullscreen: true
        })
        .then(function(answer) {

        }, function() {

        });
    }
    vm.play();

  }

})();
