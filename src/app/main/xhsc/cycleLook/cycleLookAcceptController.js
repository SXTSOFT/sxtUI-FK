/**
 * Created by shaoshun on 2016/11/29.
 */
/**
 * Created by lss on 2016/10/19.
 */
/**
 * Created by emma on 2016/6/6.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('cycleLookAcceptController',cycleLookAcceptController);

  /**@ngInject*/
  function cycleLookAcceptController($scope,$stateParams,remote,xhUtils,$rootScope,$state,$q,utils,api,xhscService){
    var vm = this;
    var projectId = $stateParams.projectId,
      areaId = $stateParams.areaId?$stateParams.areaId:$stateParams.regionId;
    vm.areaId=areaId;
    vm.InspectionId=$stateParams.InspectionId;

    vm.info = {
      current:null,
      projectId:projectId,
      regionId:areaId,
      cancelMode:function () {
        vm.cancelCurrent(null);
      }
    };

    api.setNetwork(1).then(function(){
      vm.cancelCurrent = function ($event) {
        vm.info.current = null;
      }
      $scope.areas= xhscService.getRegionTreeOffline("", 31, 1).then(function (r) {
        if (!angular.isArray(r)){
          return r;
        }
        var area=r.filter(function (k) {
          if (angular.isArray(k.Children)){
            k.Children=k.Children.filter(function (m) {
              return m.RegionID==areaId;
            })
          }
          return k.RegionID==projectId;
        });
        return area;
      });
      $scope.procedure=remote.safe.getSecurityItem.cfgSet({
        offline: true
      })("cycle");
      $scope.current={};

      var sendResult = $rootScope.$on('sendGxResult',function(){
        utils.alert("提交成功，请稍后离线上传数据！",null,function () {
          $state.go('app.xhsc.xj.main')
        });
      })
      $scope.$on("$destroy",function(){
        sendResult();
        sendResult = null;
      });

      function initImgId(regionId,gx) {
        var imgId="";
        if(regionId){
          var areaID=regionId.substr(0,10);
          remote.safe.getDrawingRelate.cfgSet({
            offline: true
          })("cycle",areaID).then(function (result) {
            imgId = result.data.find(function (item) {
              if (gx&&gx.isGj){
                return item.AcceptanceItemID==gx.AcceptanceItemID && item.RegionId ==regionId;
              }
              return item.Type==7 && item.RegionId ==regionId;
            });
            if(!imgId){
              imgId = result.data.find(function (item) {
                return item.RegionId == regionId;
              });
            }
            if (imgId){
              vm.imgId=imgId.DrawingID;
            }
          })
        }
      }

      $scope.$watch("current.region",function (v,o) {
        if (v&&$scope.current.procedure){
          if (v.SpecialtyID=="0000200008"){
            v.isGj=true;
          }
          initImgId(v.RegionID,$scope.current.procedure);
          vm.info.show=true;
        }else {
          vm.info.show=false;
        }
      })
      $scope.$watch("current.procedure",function (v,o) {
        if (v){
          if (v.SpecialtyID=="0000200008"){
            v.isGj=true;
          }
          if ($scope.current.region){
            initImgId($scope.current.region.RegionID,v);
            vm.info.show=true;
          }else {
            vm.info.show=false;
          }
          vm.procedureData=[v];
          vm.procedureData.forEach(function(t){
            t.SpecialtyChildren = t.ProblemClassifyList;
            t.ProblemClassifyList.forEach(function(_t){
              _t.WPAcceptanceList = _t.ProblemLibraryList;
              _t.SpecialtyName = _t.ProblemClassifyName;
              _t.ProblemLibraryList.forEach(function(_tt){
                _tt.AcceptanceItemName = _tt.ProblemSortName +'.'+ _tt.ProblemDescription;
              })
            })
          })
        }
      })
    });
  }
})();
