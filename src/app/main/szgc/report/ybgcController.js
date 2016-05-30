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
        query();
      }
    }
    if($stateParams.pid) {
      vm.project.idTree = $stateParams.pid;
      appCookie.put('projects', JSON.stringify([{project_id: $stateParams.pid, name: $stateParams.pname}]))
    }
    query = function(){
      console.log('vm.project',vm.project)
      var params = {
        regionTreeId: vm.project.idTree?vm.project.idTree:"",
        maximumRows:10000,
        startrowIndex:0
      }
      api.szgc.projectMasterListService.getFileReportData(params).then(function(result){
        //console.log('result',result)
        rows = result.data.Rows;
        if (rows.length > 0) {
          var arr, groupid, promises = [];
          rows.forEach(function (e) {
            groupid =e.RegionTreeId;
            arr = groupid.split('-');

            promises.push(api.szgc.vanke.rooms({
              page_number: 1,
              page_size: 1000,
              building_id: arr[4],
              floor: arr[5]
            }).then(function (res) {
              var rooms = res.data.data;
              //console.log('a',res)
              rows.forEach(function (r) {
                arr = r.RegionTreeId.split('-');
                //console.log('arr',arr[6])
                var room = rooms.find(function (o) { return o.room_id == arr[6] });
                angular.extend(r, room);
              });
            }))
          })
          //console.log('pro',promises)
          $q.all(promises).then(function () {
            vm.rows = rows;
            //console.log('rows',vm.rows)
          }, function () {
            vm.rows = rows;
          })

        }
        else {
          vm.rows = [];
        }
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
        type:item.type
      });
      return;
      //
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
      //if (!vm.project.idTree) {
      //  return;
      //}
      query();
    });

  }
})();
