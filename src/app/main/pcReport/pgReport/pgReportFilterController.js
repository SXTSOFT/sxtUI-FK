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
    .controller('pgReportFilterController',pgReportFilterController);

  /**@ngInject*/
  function pgReportFilterController($scope,remote,$mdDialog,$state,$rootScope,$timeout){
    var vm = this;
    $scope.year="";
    $scope.quart="";
    vm.yearSource=[
      2015,2016,2017,2018,2019,2020
    ];
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
    vm.click=function(){
      $state.go("app.pcReport_pg_default",{
        year: $scope.year,
        quart: $scope.quart
      })
    }
  }
})();
