/**
 * Created by leshuangshuang on 16/6/4.
 */
(function(){
  'use strcit';

  angular
    .module('app.szgc')
    .controller('yhydController',yhydController);

  /** @ngInject*/
  function yhydController($scope,api,$stateParams,$q,$timeout,$mdDialog,appCookie,$state){
    var vm = this,query
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
      if (vm.project.type != '8')return;
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

    var getNumName = function (str) {
      str = str.replace('十', '10')
        .replace('九', '9')
        .replace('八', '8')
        .replace('七', '7')
        .replace('六', '6')
        .replace('五', '5')
        .replace('四', '4')
        .replace('三', '3')
        .replace('二', '2')
        .replace('一', '1')
        .replace('十一', '11')
        .replace('十二', '12')
        .replace('十三', '13')
        .replace('十四', '14')
        .replace('十五', '15')
        .replace('十六', '16')
        .replace('十七', '17')
        .replace('十八', '18')
        .replace('十九', '19')
        .replace('二十', '20');
      var n = parseInt(/[-]?\d+/.exec(str));
      return n;
    };
    $scope.$watch('vm.project.type', function () {
      $timeout(function () {


        if (vm.project.type == '8') {
          vm.project.loading = true;
          $q.all([
            api.szgc.vanke.rooms({
              building_id: vm.project.idTree.split('>')[2],
              page_size: 0,
              page_number: 1
            }, false),
            api.szgc.GetFileReportNum.getFileReportData({
              startrowIndex: 0,
              maximumRows: 100000,
              regionTreeId: vm.project.idTree
            }),
            api.szgc.ProcProBatchRelationService.getReport(vm.project.idTree)
          ]).then(function (result) {
            vm.project.loading = false;
            result[0].data.data.sort(function (i1, i2) {
              var f1 = getNumName(i1.floor),
                f2 = getNumName(i2.floor);

              if (i1.floor == i2.floor || (isNaN(f1) && isNaN(f2)) || f1 == f2) {

                var n1 = getNumName(i1.name),
                  n2 = getNumName(i2.name);
                if (!isNaN(n1) && !isNaN(n2))
                  return n1 - n2;
                else if ((isNaN(n1) && !isNaN(n2)))
                  return 1;
                else if ((!isNaN(n1) && isNaN(n2)))
                  return -1;
                else
                  return i1.name.localeCompare(i2.name);
              }
              else {
                if (!isNaN(f1) && !isNaN(f2))
                  return f1 - f2;
                else if ((isNaN(f1) && !isNaN(f2)))
                  return 1;
                else if ((!isNaN(f1) && isNaN(f2)))
                  return -1;
                else
                  return f1.name.localeCompare(f2.name);
              }
            });
            var rows = [];
            result[0].data.data.forEach(function (row) {
              var yb = result[1].data.Rows.find(function (d) {
                return d.RegionTreeId.indexOf(row.room_id) != -1;
              });
              var ys = result[2].data.Rows.find(function (d) {
                return d.RegionIdTree.indexOf(row.room_id) != -1;
              });
              row.ybNum = yb ? yb.FileNum : 0;
              row.ysNum = ys ? ys.YsNum : 0;
              row.hg = ys ? ys.MainResult == 0 ? false : true : true;
              row.RegionIdTree = yb ? yb.RegionTreeId : ys ? ys.RegionTreeId : ''
              //if (row.ybNum != 0 || row.ysNum != 0) {
               rows.push(row);
              //}
            });
            vm.project.rows = rows;
            console.log('a',vm.project);

          });
        }
      },10)
    });

  }
})();

