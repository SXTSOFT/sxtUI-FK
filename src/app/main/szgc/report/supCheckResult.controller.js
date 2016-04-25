/**
 * Created by emma on 2016/4/25.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .controller('supCheckResultController',supCheckResultController);

  /** @ngInject */
  function supCheckResultController($scope,_projects,$filter,api,utils) {
    var vm=this;
    vm.m = { countType: 0 };
    vm.projects = _projects.data.data;
    for (var i = 0; i < vm.projects.length; i++) {
      vm.projects[i].selected = false;
    }
    vm.isChecked = false;
    //vm.selected = vm.projects;
    vm.toggle = function (item) {
      console.log('item',item)
      item.selected = !item.selected;
    };
    vm.toggleAll = function() {
      vm.isChecked = !vm.isChecked;
      if(vm.isChecked){
        for (var i = 0; i < vm.projects.length; i++) {
          vm.projects[i].selected = true;
        }
      }else{
        for (var i = 0; i < vm.projects.length; i++) {
          vm.projects[i].selected = false;
        }
      }
    };
    //初始化日期
    var dateFilter = $filter('date');
    vm.m.eDate = new Date();
    var d = new Date()
    d.setDate(d.getDate() - 7);
    vm.m.sDate = d;
    function trim(str) { //删除左右两端的空格
      return str.replace(/(^\s*)|(\s*$)/g, "");
    }


    $scope.$watch('vm.projects.pid', function (a, b) {
      vm.batchData2 = [];
      vm.CheckData = [];

      if ((!vm.m.sDate) || (!vm.m.eDate)) {
        utils.alert("查询时间不能为空！");
        return;
      }
      else if (vm.m.sDate > vm.m.eDate) {
        utils.alert("开始时间不能大于结束时间！");
        return;
      } else {
        GetSupervisorAccordRatio();
        vm.flag = true;

      }



    });

    $scope.$watch('vm.m', function (newValue, oldValue) {
      vm.batchData2 = [];
      vm.CheckData = [];
      if (newValue != oldValue) {
        if ((!vm.m.sDate) || (!vm.m.eDate)) {
          utils.alert("查询时间不能为空！");
          return;
        }
        else if (vm.m.sDate > vm.m.eDate) {
          utils.alert("开始时间不能大于结束时间！");
          return;
        } else {
          GetSupervisorAccordRatio();
          vm.flag = true;
        }
      }

    }, true);

    var GetSupervisorAccordRatio = function () {

      vm.startDateF = dateFilter(vm.m.sDate, 'yyyy-MM-dd');
      vm.endDateF = dateFilter(vm.m.eDate, 'yyyy-MM-dd');
      // console.log('时间', $scope.startDateF, $scope.endDateF)
      var params = {};
      params.startDate = vm.startDateF; //开始时间 格式：2015-01-10 必填
      params.endDate = vm.endDateF; //结束时间 格式：2015-01-10 必填
      params.regionIdTree = vm.projects.idTree ? vm.projects.idTree : '';//区域树ID 必填

      // console.log('params', params)
      vm.GrpName = [];
      vm.MinPassRatio = [];
      api.szgc.projectMasterListService.GetSupervisorAccordRatio(params).then(function (result) {
        console.log('a',result)
        vm.CheckData = result.data.Rows;

        vm.CheckWorkerNameE = [];
        vm.cAccordRatioE = [];
        vm.CheckData.forEach(function (item) {
          item.pAccordRatio = item.pAccordRatio.toFixed(2) * 100;
          item.sAccordRatio = item.sAccordRatio.toFixed(2) * 100;
          item.cAccordRatio = item.cAccordRatio.toFixed(2) * 100;
          vm.CheckWorkerNameE.push(item.CheckWorkerName);
          vm.cAccordRatioE.push(item.cAccordRatio);

        });
        //最大值显示10条数据
        //if ($scope.CheckWorkerNameE.length > 10) {
        //  $scope.cAccordRatioE.length = 10;
        //
        //}


        showReport();

        //图表显示
        //if ($scope.CheckData.length == 0) {
        //  $scope.flag = false;
        //}
        //showEchertGroup.showEchertGroup('main2', $scope.CheckWorkerNameE, $scope.cAccordRatioE, $scope.project.nameTree + "监理人员合格率排名")

        ////console.log('$scope.CheckData2', $scope.CheckData);




      });

      function showReport(){
        var xAxis_data = [];//x轴数据
        (function init() {

          if (vm.CheckData) {
            var Avg_JLLast, Avg_JLFirst;
            for (var i = 0; i < vm.CheckData.length; i++) {
              xAxis_data.push({
                //value: format(vm.reportData[i].ParentCompanyName),
                //textStyle: {
                //  fontSize: 8,
                //  color: '#858585',
                //  align: 'center'
                //}
                x:vm.CheckData[i].CheckWorkerName,
                y:vm.CheckData[i].cAccordRatio,
                color:'#FF7F50'
              });

            }
          }
        })();



        vm.data= {
          config: {
            showXAxis: true,
            showYAxis: true,
            showLegend: false,
            debug: true,
            stack: false,
            yAxis: {
              type: 'value',
              min: 0,
              max: 100
            },
            dataZoom:[
              {
                type: 'slider',
                show: true,
                start: 94,
                end: 100,
                handleSize: 8
              },
              {
                type: 'inside',
                start: 94,
                end: 100
              },
              {
                type: 'slider',
                show: true,
                yAxisIndex: 0,
                filterMode: 'empty',
                width: 12,
                height: '70%',
                handleSize: 8,
                showDataShadow: false,
                left: '93%'
              }
            ],
            series:{
              barMaxWidth: 20,
              barWidth:20,
              barMinHeight: 20
            },
          }
        };
        var pageload = {
          datapoints: xAxis_data
        };
        vm.data.data = [ pageload ];
      }

    }

  }


})();
