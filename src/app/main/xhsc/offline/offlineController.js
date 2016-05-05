/**
 * Created by lss on 2016/5/3.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('offlineController',offlineController)
  /** @ngInject */
  function offlineController($scope,remote,xhUtils,$stateParams,utils,$mdDialog,$state,$rootScope,db) {
    var vm = this;
    var areID="0000700000";
    var r = db("db_"+areID,{auto_compaction:true});
    vm.download= function(){
      r.deleteAll().then(function(data){
        //加载区域项
        remote.region.query(areID).then(function(result){
          var retVal = result.data;
          if (!angular.isArray(retVal)){
            retVal=[retVal];
          }
          retVal.forEach(function(o){
            o.id="region_"+o.RegionID;
            o.tate="加载中...";
          })
          $scope.regions=retVal;
          r.create(retVal).then(function(data){
            retVal.forEach(function(o){
              o.tate="完成";
            });
          });
        })
        //加载实测项
        remote.Measure.query(areID).then(function(result){
          var retVal = result.data;
          if (!angular.isArray(retVal)){
            retVal=[retVal];
          }
          retVal.forEach(function(o){
            o.id="accItem_"+o.AcceptanceItemID;
            o.state="加载中...";
          });
          $scope.AcceptanceItems=retVal;
          r.create(retVal).then(function(data){
            retVal.forEach(function(o){
              o.state="完成";
            });
          });
        })
        //加载指标项
        remote.Measure.MeasureIndex.query().then(function(result){
          var retVal = result.data;
          if (!angular.isArray(retVal)){
            retVal=[retVal];
          }
          retVal.forEach(function(o){
            o.id="accIndex_"+o.AcceptanceIndexID;
            o.state="加载中...";
          })
          $scope.AcceptanceIndexs=retVal;
          r.create(retVal).then(function(data){
            retVal.forEach(function(o){
              o.state="完成";
            })
          });
        })
      });
    }
  }
})();
