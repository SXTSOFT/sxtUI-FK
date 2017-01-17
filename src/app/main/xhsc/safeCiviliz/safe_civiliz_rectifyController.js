/**
 * Created by lss on 2016/10/19.
 */
/**
 * Created by emma on 2016/7/1.
 */
(function () {
  'use strict';

  angular
    .module('app.xhsc')
    .controller('safe_civiliz_rectifyController', safe_civiliz_rectifyController);

  /** @ngInject */
  function safe_civiliz_rectifyController($state, $rootScope, $scope, $mdDialog, remote, $timeout, $q, utils, xhUtils, api) {
    var vm = this;
    $rootScope.title = $state.params.Role == 'zb' ? '整改' : '复验';
    vm.ProjectID = $state.params.ProjectID;
    vm.AcceptanceItemID = $state.params.AcceptanceItemID;
    vm.AcceptanceItemName = $state.params.AcceptanceItemName ? $state.params.AcceptanceItemName : "";
    vm.role = $state.params.Role;
    vm.InspectionID = $state.params.InspectionID;
    vm.RectificationID = $state.params.RectificationID;
    api.setNetwork(1).then(function () {
      remote.safe.getRectificationSingle(vm.RectificationID).then(function (r) {
        vm.Rectification = r.data[0];
        vm.pareaList = vm.Rectification.Children;
        vm.regionSelect = vm.pareaList[0];
        vm.warter = vm.regionSelect.RegionName + (vm.AcceptanceItemName ? '(' + vm.AcceptanceItemName + ')' : "");
        vm.regionSelect.hasCheck = true;
        // load();
      });

      vm.info = {}

      // function setChina(r) {
      //   switch (r) {
      //     case 0:
      //       return '合格';
      //       break;
      //     case 1:
      //       return '待验';
      //       break;
      //     case 2:
      //       return '合格';
      //       break;
      //     case 4:
      //       return '不合格';
      //       break;
      //     case 8:
      //       return '未整改';
      //       break;
      //     case 16:
      //       return '已整改';
      //       break;
      //   }
      // }

      // remote.Procedure.getRectification(vm.RectificationID).then(function(r){
      //   vm.baseInfor = r.data;
      //   vm.baseInfor.zwStatus = setChina(r.data.Status);
      // })
      function load() {
        if (!vm.regionSelect) {
          return;
        }
        // var promises=[
        //   remote.Procedure.getZGReginQues(vm.regionSelect.AreaID,vm.RectificationID),
        // ]
        // vm.ques=[];
        // $q.all(promises).then(function(res){
        //   vm.items = res.data;
        //   res[0].data.forEach(function (item) {
        //     var fd = vm.ques.find(function (it) {
        //       return it.IndexPointID==item.IndexPointID;
        //     });
        //     if(!fd){
        //       fd = item;
        //       vm.ques.push(fd);
        //       fd.Points = 1;
        //     }
        //     else{
        //       fd.Points++;
        //     }
        //   })
        //
        // })
      }

      // vm.showTop = function(){
      //   vm.slideShow = true;
      // }
      // vm.showQuesList = function(){
      //   vm.showUp = true;
      // }
      vm.selectQy = function (item) {
        vm.regionSelect = item;
        vm.regionSelect.hasCheck = true;
        vm.warter = vm.regionSelect.RegionName + (vm.AcceptanceItemName ? '(' + vm.AcceptanceItemName + ')' : "");
        vm.qyslideShow = false;
      }

      vm.qyslide = function () {
        vm.qyslideShow = !vm.qyslideShow;
      }
      $scope.times = xhUtils.zgDays();
      var gxzgChanged = $rootScope.$on('sendGxResult', function () {
        var msg = [],noChecked=[];
        vm.pareaList.forEach(function (r) {
          if (!r.hasCheck) {
            msg.push(r.RegionName);
            noChecked.push(r);
          }
        });
        if (msg.length) {
          utils.confirm(msg.join(",") + '尚未查看,去看看?',null,function () {
            vm.selectQy(noChecked[0]);
          },function () {
          });
          return;
        }
        utils.alert('提交成功，请稍后离线上传数据',null,function () {
          $state.go("app.xhsc.sf.sfmain");
        });
      });

      $scope.$on('$destroy', function () {
        gxzgChanged();
        gxzgChanged = null;
      })
    });
  }
})();
