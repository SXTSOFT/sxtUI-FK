/**
 * Created by shaoshunliu on 2016/12/19.
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
    .module('app.pcReport_week')
    .controller('week_defaultController',week_defaultController);

  /**@ngInject*/
  function week_defaultController($state,remote,$scope,$rootScope,sxtlocaStorage){
    var vm=this;
    vm.selectSize=10;

    function load() {
      var params= sxtlocaStorage.getObj("week_params");
      params=params?params:{};
      $scope.pageIndex=params.pageIndex?params.pageIndex:1;
      $scope.PageSize=params.pageSize?params.pageSize:10;
      var queryParams={};
      queryParams.CurPage=$scope.pageIndex-1;
      queryParams.PageSize=$scope.PageSize;

      if (params.minDate&&!angular.isObject(params.minDate)){
        queryParams.StartTime=params.minDate.toLocaleString();
      }

      if (params.maxDate&&!angular.isObject(params.maxDate)){
        queryParams.EndTime=params.maxDate.toLocaleString();
      }

      if (params.currentArea&&params.currentArea.RegionID){
        queryParams.AreaId=params.currentArea.RegionID;
      }

      if (params.currentProject&&params.currentProject.RegionID){
        queryParams.ProjectID=params.currentProject.RegionID;
      }


      remote.report.getWrapList('WeekInspects',queryParams).then(function (r) {
        vm.total=r.data.TotalCount;
        vm.source=r.data.Data
      })
    }

    //初始化
    var filter=$rootScope.$on("filter",function (event,data) {
      $scope.display=true;
      load();
    });


    vm.pageAction=function(bar, page, pageSize, total){
      var params= sxtlocaStorage.getObj("week_params");
      params=params?params:{};
      params.PageSize=pageSize;
      params.pageIndex=page;
      sxtlocaStorage.setObj(params);
      load();
    }

    $scope.$watch("vm.selectSize",function (v) {
      if(v){
        var params= sxtlocaStorage.getObj("week_params");
        params=params?params:{};
        params.PageSize=v;
        sxtlocaStorage.setObj(params);
        if ($scope.display){
          load();
        }
      }
    })


    //隐藏列表
    var showDetail =$rootScope.$on("show",function (event,data) {
      $scope.display=true;
    });
    //展示列表
    var hideDetail =$rootScope.$on("hide",function (event,data) {
      $scope.display=false;
    });

    //明细
    vm.go=function (item) {
      $state.go("app.pcReport_week_detail",{regionId:item.AreaID,inspectionId:item.InspectionID});
    }

    $scope.$on("$destroy",function () {
      showDetail();
      filter();
      hideDetail();
    })
  }
})();
/**
 * Created by shaoshunliu on 2016/12/19.
 */
