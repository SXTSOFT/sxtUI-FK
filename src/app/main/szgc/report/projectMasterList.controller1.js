/**
 * Created by guowei on 2016/2/1.
 */
(function(){
  'use strict';
  angular
    .module('app.szgc')
    .controller('projectMasterListController1',projectMasterListController1);

  /** @ngInject */
  function  projectMasterListController1($scope,api,showEcherts){
    var vm=this;
    vm.project = {};
    $scope.$watch('vm.project.idTree', function() {
      vm.init();
      GetCountBatchByProject();
      GetBatchDetails();

    });

    //项目总览
    var GetCountBatchByProject = function() {
      var params = {};
      params.regionIdTree = vm.project.idTree ? vm.project.idTree : '0';
      params.roleId = 'jl';
      api.szgc.projectMasterListService.GetCountBatchByProject(params).then(function(result) {
        vm.CountBatchByProject = result.data.Rows;

        vm.CountBatchByProject.forEach(function(item) {
          vm.percent = item.OKCount / (item.OKCount + item.NCount);
          item.percentE = (vm.percent.toFixed(2))*100
        });
      });
    };
    //工序总览
    var GetBatchDetails = function() {
      var params = {};
      params.regionIdTree = vm.project.idTree ? vm.project.idTree : '0';
      params.roleId = 'jl';
      api.szgc.projectMasterListService.GetBatchDetails(params).then(function(result) {
        vm.GetBatchDetails = result.data.Rows;

        vm.GetBatchDetails.forEach(function(item) {
          if (item.CheckResult == '复验合格') {
            item.isColor = 'aColor';
          } else if (item.CheckResult == '初验合格') {
            item.isColor = 'bColor';
          } else if (item.CheckResult == '初验不合格') {
            item.isColor = 'cColor';
          } else if (item.CheckResult == '复验不合格') {
            item.isColor = 'dColor';
          }
        });
      });
    };



    // 返回
    $scope.goback = function() {
      history.go(-1);
    }
    vm.init = function() {
      vm.GrpNameE = []; //项目总览
      vm.NCountE = []; //不合格
      vm.OKCountE = []; //合格
      var params = {};
      params.regionIdTree = vm.project.idTree ? vm.project.idTree : '0';
      params.roleId = 'jl';
      api.szgc.projectMasterListService.GetCountBatchByGroup(params).then(function(result) {
        vm.resultEcharts = result.data.Rows;

        vm.resultEcharts.forEach(function(item) {
          vm.GrpNameE.push(item.GrpName);
          vm.NCountE.push(item.NCount);
          vm.OKCountE.push(item.OKCount);
        });
        //最大值显示20条数据
        if (vm.GrpNameE.length > 20) {
          vm.GrpNameE.length = 20;
          vm.NCountE.length = 20;
          vm.OKCountE.length = 20;
        }
        vm.config = {
          title: vm.project.projectName + '班组施工情况',
          //subtitle: 'Line Chart Subtitle',
          showXAxis: true,
          showYAxis: true,
          showLegend: true,
          stack: false,
        };
        vm.data = [vm.NCountE,vm.OKCountE];
        //引用echarts 显示图形界面。
        //showEcherts.showEchert('main1', vm.project.projectName + '班组施工情况', vm.GrpNameE, vm.NCountE, vm.OKCountE)

      });

    };


  }
})();
