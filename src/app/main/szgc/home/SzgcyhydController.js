/**
 * Created by zhangzhaoyong on 16/2/3.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .controller('SzgcyhydController', SzgcyhydController);

  /** @ngInject */
  function SzgcyhydController(api,$mdDialog,$rootScope,$scope,utils,$stateParams,appCookie,viewImage)
  {
    //viewImage.view('http://szdp.vanke.com:8088/upload/2016/03/980012f8-e903-4b54-9222-bd53edee391c.jpg')
    var vm = this;
    vm.showImg = function () {
      $rootScope.$emit('sxtImageViewAll',{data:true});
    }
    vm.data = {
      projectId: $stateParams.pid,
      projectName:$stateParams.pname
    };
    //appCookie.put('projects',JSON.stringify([{project_id:$stateParams.pid,name:$stateParams.pname}]))
    //vm.$parent.data.pname = vm.data.projectName;
    $rootScope.title = vm.data.projectName;

    vm.sellLine = 0.6;

    vm.project = {
      item:{
        type:$stateParams.type
      },
      idTree:$stateParams.idTree,
      pid: $stateParams.pid,
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
        console.log('r.data.Rows.length',r.data.Rows.length)
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
    vm.playN = function(n){
      console.log('vm.project',vm.project)
      api.szgc.FilesService.GetPrjFilesByFilter(vm.project.pid, { imageType: n }).then(function(r){
        if(r.data.Rows.length==0){
          utils.alert('暂无照片');
        }
        else {
          vm.project.n = n;
          $mdDialog.show ({
              locals: {
                project: vm.project
              },
              controller: 'SzgcyhydDlgController as vm',
              templateUrl: 'app/main/szgc/home/SzgcyhydDlg.html',
              parent: angular.element (document.body),
              clickOutsideToClose: true,
              fullscreen: true
            })
            .then (function (answer) {

            }, function () {

            });
        }
      })

    }

    if($stateParams.seq=='2'){
      vm.playN(2);
    }
    //vm.playN();

  }

})();
