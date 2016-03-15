/**
 * Created by zhangzhaoyong on 16/2/3.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .controller('SzgcyhydController', SzgcyhydController);

  /** @ngInject */
  function SzgcyhydController(api,$stateParams,$rootScope,$scope,utils)
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
    api.szgc.FilesService.GetPartionId().then(function(r){
      vm.project.partions = r.data.Rows;
    })
    var play = function(){
      api.szgc.FilesService.GetPrjFilesByFilter(vm.project.pid, vm.project.procedureId, vm.project.partion ? vm.project.partion.Id : null).then(function (r) {

        if (r.data.Rows.length == 0) {
          utils.alert('暂无照片');
        }
        else{
          vm.showPlayer = true;
          vm.images = r.data.Rows;
        }
      })
    }
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
    $scope.$on('$destroy',function(){
    })
    vm.play = function(index){
      vm.project.procedureId = null;
      vm.project.partion = null;
      play();
    }
    $scope.$watch('vm.project.procedureId',function(){
      if(vm.project.procedureId)
        play();
    });
    $scope.$watch('vm.project.partion',function(){
      if(vm.project.partion)
        play();
    })
  }

})();
