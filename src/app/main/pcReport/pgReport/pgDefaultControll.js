/**
 * Created by lss on 2016/9/14.
 */
/**
 * Created by lss on 2016/9/13.
 */
/**
 * Created by lss on 2016/9/8.
 */
/**
 * Created by emma on 2016/6/7.
 */
(function(){
  'use strict';
   angular
    .module('app.pcReport_sl')
    .controller('pgDefaultController',pgDefaultController);

  /**@ngInject*/
  function pgDefaultController($scope,remote,$mdDialog,$state,$rootScope,$timeout){
    var vm = this;
    vm.yearSource=[
      2015,2016,2017,2018,2019,2020
    ];
    vm.show=false;
    $scope.year="";
    $scope.quart="";
    vm.yearQuart=[{
      "id": 1,
      "text": "第一季度"
    }, {
      "id": 2,
      "text": "第二季度"
    }, {
      "id": 3,
      "text": "第三季度"
    }, {
      "id": 4,
      "text": "第四季度"
    }];

    remote.Assessment.GetAsssmentReportLst({
      Curpage:0,
      PageSize:1000,
      Year:$scope.year?$scope.year:0,
      Quarter:$scope.quart?$scope.quart:0
    }).then(function(r){
      if (r&& r.data){
        vm.source= r.data;
      }
      vm.show=true;
      $mdDialog.hide();
    }).catch(function(){
      vm.show=true;
      $mdDialog.cancel();
    });

    vm.gohz=function(item){
      $state.go("app.xhsc.pkresult",{
        year:item.Year,
        projectID:item.ProjectID,
        quarter:item.Quarter
      })
    }
    vm.gosc=function(item){

    }
    vm.goBack=function(){
      window.history.go(-1);
    }
  }
})();
/**
 * Created by lss on 2016/9/14.
 */
