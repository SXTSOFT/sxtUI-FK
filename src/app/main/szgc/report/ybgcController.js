/**
 * Created by emma on 2016/5/16.
 */
(function(){
  'use strcit';

  angular
    .module('app.szgc')
    .controller('ybgcController',ybgcController);

  /** @ngInject*/
  function ybgcController($scope,api,$stateParams,$q,$timeout,$mdDialog,appCookie,$state){
    var vm = this,query;

    vm.project ={
      onQueryed:function () {
        vm.searBarHide = false;
        //query();
      }
    }
    if($stateParams.pid) {
      vm.project.idTree = $stateParams.pid;
      appCookie.put('projects', JSON.stringify([{project_id: $stateParams.pid, name: $stateParams.pname}]))
    }
    query = function(){
      var params = {
        regionTreeId: vm.project.idTree?vm.project.idTree:"",
        maximumRows:10000,
        startrowIndex:0
      }
      api.szgc.projectMasterListService.getFileReportData(params).then(function(result){
        var rows = result.data.Rows;
        vm.rows = rows;
      })
    }
    $timeout(function(){
      //query();
    },500)
    vm.viewItem = function(item){
      console.log('item',item);
      $state.go('app.szgc.yhyd',{
        pid:item.regionId,
        pname:item.regionName,
        idTree:item.idTree,
        type:item.type,
        seq:2
      });
      return;

      //vm.project.n = n;
      item.n=2;

      $mdDialog.show ({
          locals: {
            project: item
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
    }
    $scope.$watch('vm.project.idTree', function() {
      if (!vm.project.idTree) {
        return;
      }
      query();
    });

  }
})();
