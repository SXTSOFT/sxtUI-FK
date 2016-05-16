/**
 * Created by emma on 2016/5/16.
 */
(function(){
  'use strcit';

  angular
    .module('app.szgc')
    .controller('ybgcyhydController',ybgcyhydController);

  /** @ngInject*/
  function ybgcyhydController($mdDialog,$stateParams,api,appCookie,utils,$rootScope){
    var vm = this;
    vm.project ={};
    vm.data = {
      projectId: $stateParams.regionId,
      projectName:$stateParams.regionName
    };
    vm.project = $stateParams;
    $rootScope.title = vm.data.projectName;
    api.szgc.FilesService.GetPartionId().then(function(r){
      vm.project.partions = r.data.Rows;
    })
    vm.project.n = 2;
    $mdDialog.show ({
        locals: {
          project: vm.project
        },
        controller: 'SzgcyhydDlgController as vm',
        templateUrl: 'app/main/szgc/home/SzgcybgcDlg.html',
        parent: angular.element (document.body),
        clickOutsideToClose: true,
        fullscreen: true
      })
      .then (function (answer) {

      }, function () {

      });
    //appCookie.put('projects',JSON.stringify([{project_id:$stateParams.pid,name:$stateParams.pname}]))
    //vm.playN = function(n){
    //  //console.log('vm',$stateParams)
    //  api.szgc.FilesService.GetPrjFilesByFilter($stateParams.regionId, { imageType: n }).then(function(r){
    //    if(r.data.Rows.length==0){
    //      utils.alert('暂无照片');
    //    }
    //    else {
    //      vm.project.n = n;
    //      $mdDialog.show ({
    //          locals: {
    //            project: vm.project
    //          },
    //          controller: 'SzgcyhydDlgController as vm',
    //          templateUrl: 'app/main/szgc/home/SzgcybgcDlg.html',
    //          parent: angular.element (document.body),
    //          clickOutsideToClose: true,
    //          fullscreen: true
    //        })
    //        .then (function (answer) {
    //
    //        }, function () {
    //
    //        });
    //    }
    //  })
    //}
  }
})();
