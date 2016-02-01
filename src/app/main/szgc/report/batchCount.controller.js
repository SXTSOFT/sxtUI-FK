/**
 * Created by zhangzhaoyong on 16/1/28.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .controller('batchCountController',batchCountController);

  /** @ngInject */
  function batchCountController($scope,$filter,api){
    var vm = this;
    vm.m = { countType: 0 };
    vm.projectBatchCount = [];
    var tb = "";
    vm.printBatchCount = function () {
      if (vm.m.countType == 0) {
        $('#export').val($("#dvBatchCount").html());
      } else {
        $('#export').val($("#dvBatchCount2").html());
      }

    }

    var dateFilter = $filter('date');
    vm.project = {};
    vm.m.eDate = new Date();
    var d = new Date()
    d.setDate(d.getDate() - 7);
    vm.m.sDate = d;

    vm.search = function() {
      if ((!vm.m.sDate) || (!vm.m.eDate)) {
        utils.alert("查询时间不能为空！");
        return;
      } else if (vm.m.sDate > vm.m.eDate) {
        utils.alert("开始时间不能大于结束时间！");
        return;
      }

      var startDate = dateFilter(vm.m.sDate, 'yyyy-MM-dd');
      var endDate = dateFilter(vm.m.eDate, 'yyyy-MM-dd');
      vm.batchData2 = [];
      var lastProjectId = "";
      var colp = 0;
      api.szgc.projectMasterListService.GetBatchCount({
          starDate: startDate,
          endDate: endDate,
          projectId: vm.project.pid
        })
        .then(function (r) {
          vm.batchData2 = [];
          vm.projectBatchCount = [];
          //小计字段
          var tjCount = 0;
          var jdCount = 0;
          var zxCount = 0;
          var dayCount = 0;
          //总计字段
          var tjLastCount = 0;
          var jdLastCount = 0;
          var zxLastCount = 0;
          var dayLastCount = 0;
          var jlLastNumberCount = 0;
          var latProjectName = "";
          var i = 0;
          var row = 0;
          //  console.log("r.data", r.data);
          r.data.Rows.forEach(function(item) {
            if (item.projectId == lastProjectId) {
              //同一个项目数据
              tjCount = tjCount + item.tjNumber;
              jdCount = jdCount + item.jdNumber;
              zxCount = zxCount + item.zxNumber;
              dayCount = dayCount + item.dayCountNumber;

              vm.batchData2.push({
                projectName: item.projectName,
                CreatedTime: item.CreatedTime,
                dayCountNumber: item.dayCountNumber,
                jlNumber: item.jlNumber,
                jdNumber: item.jdNumber,
                tjNumber: item.tjNumber,
                zxNumber: item.zxNumber,
                minCunt:item.jlNumberCount,//小计，监理人数
                colp: 0,
                myCol: '#ffffff',
              });
              i += 1;
              row += 1;

            } else {
              //不同项目
              lastProjectId = item.projectId;
              if (i > 0) {
                jlLastNumberCount = jlLastNumberCount + vm.batchData2[vm.batchData2.length - 1].minCunt;
                //存储所有小计数据
                vm.projectBatchCount.push({
                  projectName: vm.batchData2[vm.batchData2.length - 1].projectName,
                  //CreatedTime: "小计",
                  dayCountNumber: dayCount,
                  jlNumber: vm.batchData2[vm.batchData2.length - 1].minCunt,
                  jdNumber: jdCount,
                  tjNumber: tjCount,
                  zxNumber: zxCount,
                  colp: 0,
                  myCol: '#ffffff',
                });
                //加小计数据
                vm.batchData2.push({
                  projectName: "",
                  CreatedTime: "小计",
                  dayCountNumber: dayCount,
                  jlNumber: vm.batchData2[vm.batchData2.length - 1].minCunt,
                  jdNumber: jdCount,
                  tjNumber: tjCount,
                  zxNumber: zxCount,
                  minCunt: item.jlNumberCount,//小计，监理人数
                  colp: 0,
                  myCol: '#efebeb',
                });

                tjCount = 0;
                jdCount = 0;
                zxCount = 0;
                dayCount = 0;
                //计算跨行
                row += 1;
                vm.batchData2[vm.batchData2.length - row].colp = row;
                row = 0;
              }

              tjCount = tjCount + item.tjNumber;
              jdCount = jdCount + item.jdNumber;
              zxCount = zxCount + item.zxNumber;
              dayCount = dayCount + item.dayCountNumber;

              vm.batchData2.push({
                projectName: item.projectName,
                CreatedTime: item.CreatedTime,
                dayCountNumber: item.dayCountNumber,
                jlNumber: item.jlNumber,
                jdNumber: item.jdNumber,
                tjNumber: item.tjNumber,
                zxNumber: item.zxNumber,
                minCunt: item.jlNumberCount,//小计，监理人数
                colp: 0,
                myCol: '#ffffff',
              });
              i += 1;
              row += 1;
            }
            tjLastCount = tjLastCount + item.tjNumber;
            jdLastCount = jdLastCount + item.jdNumber;
            zxLastCount = zxLastCount + item.zxNumber;
            dayLastCount = dayLastCount + item.dayCountNumber;


            //最后一条
            if (r.data.Rows.length == i) {
              jlLastNumberCount = jlLastNumberCount + vm.batchData2[vm.batchData2.length - 1].minCunt;
              //存储所有小计数据
              vm.projectBatchCount.push({
                projectName: vm.batchData2[vm.batchData2.length - 1].projectName,
                //CreatedTime: "小计",
                dayCountNumber: dayCount,
                jlNumber: vm.batchData2[vm.batchData2.length - 1].minCunt,
                jdNumber: jdCount,
                tjNumber: tjCount,
                zxNumber: zxCount,
                colp: 0,
                myCol: '#ffffff',
              });

              vm.batchData2.push({
                projectName: "",
                CreatedTime: "小计",
                dayCountNumber: dayCount,
                jlNumber: vm.batchData2[vm.batchData2.length - 1].minCunt,
                jdNumber: jdCount,
                tjNumber: tjCount,
                zxNumber: zxCount,
                minCunt: item.jlNumberCount,//小计，监理人数
                colp: 0,
                myCol: '#efebeb',
              });
              //计算跨行
              row += 1;
              vm.batchData2[vm.batchData2.length - row].colp = row;
              vm.batchData2.push({
                projectName: "",
                CreatedTime: "总计",
                dayCountNumber: dayLastCount,
                jlNumber: jlLastNumberCount,
                jdNumber: jdLastCount,
                tjNumber: tjLastCount,
                zxNumber: zxLastCount,
                minCunt: item.jlNumberCount,//小计，监理人数
                colp: 1,
                myCol: '#b9b3b3',
              });

              vm.projectBatchCount.push({
                projectName: "总计",
                //  CreatedTime: "总计",
                dayCountNumber: dayLastCount,
                jlNumber: jlLastNumberCount,
                jdNumber: jdLastCount,
                tjNumber: tjLastCount,
                zxNumber: zxLastCount,
                colp: 1,
                myCol: '#b9b3b3',
              });

              tjCount = 0;
              jdCount = 0;
              zxCount = 0;
              dayCount = 0;
            }

          })
        });
    }
    $scope.$watch(function(){
      return vm.project.pid;
    }, function() {
      vm.batchData2 = [];
      if ((!vm.m.sDate) || (!vm.m.eDate)) {
        utils.alert("查询时间不能为空！");
        return;
      } else {
        vm.search();
      }
    });

    $scope.$watch('m.eDate', function() {
      vm.batchData2 = [];
      if ((!vm.m.sDate) || (!vm.m.eDate)) {
        utils.alert("查询时间不能为空！");
        return;
      } else {
        vm.search();
      }

    });
    $scope.$watch('m.sDate', function() {
      vm.batchData2 = [];
      if ((!vm.m.sDate) || (!vm.m.eDate)) {
        return;
      } else {
        vm.search();
      }

    });
    // 返回
    vm.goback = function() {            vm.m = { countType: 0 };
      vm.projectBatchCount = [];
      var tb = "";
      vm.printBatchCount = function () {
        if (vm.m.countType == 0) {
          $('#export').val($("#dvBatchCount").html());
        } else {
          $('#export').val($("#dvBatchCount2").html());
        }

      }

      var dateFilter = $filter('date');
      vm.project = {};
      vm.m.eDate = new Date();
      var d = new Date()
      d.setDate(d.getDate() - 7);
      vm.m.sDate = d;

      vm.search = function() {
        if ((!vm.m.sDate) || (!vm.m.eDate)) {
          utils.alert("查询时间不能为空！");
          return;
        } else if (vm.m.sDate > vm.m.eDate) {
          utils.alert("开始时间不能大于结束时间！");
          return;
        }

        var startDate = dateFilter(vm.m.sDate, 'yyyy-MM-dd');
        var endDate = dateFilter(vm.m.eDate, 'yyyy-MM-dd');

        vm.batchData2 = [];
        var lastProjectId = "";
        var colp = 0;
        api.szgc.projectMasterListService.GetBatchCount({
            starDate: startDate,
            endDate: endDate,
            projectId: vm.project.pid
          })
          .then(function (r) {
            vm.batchData2 = [];
            vm.projectBatchCount = [];
            //小计字段
            var tjCount = 0;
            var jdCount = 0;
            var zxCount = 0;
            var dayCount = 0;
            //总计字段
            var tjLastCount = 0;
            var jdLastCount = 0;
            var zxLastCount = 0;
            var dayLastCount = 0;
            var jlLastNumberCount = 0;

            var latProjectName = "";
            var i = 0;
            var row = 0;
            //  console.log("r.data", r.data);
            r.data.Rows.forEach(function(item) {
              if (item.projectId == lastProjectId) {
                //同一个项目数据
                tjCount = tjCount + item.tjNumber;
                jdCount = jdCount + item.jdNumber;
                zxCount = zxCount + item.zxNumber;
                dayCount = dayCount + item.dayCountNumber;

                vm.batchData2.push({
                  projectName: item.projectName,
                  CreatedTime: item.CreatedTime,
                  dayCountNumber: item.dayCountNumber,
                  jlNumber: item.jlNumber,
                  jdNumber: item.jdNumber,
                  tjNumber: item.tjNumber,
                  zxNumber: item.zxNumber,
                  minCunt:item.jlNumberCount,//小计，监理人数
                  colp: 0,
                  myCol: '#ffffff',
                });
                i += 1;
                row += 1;

              } else {
                //不同项目
                lastProjectId = item.projectId;
                if (i > 0) {
                  jlLastNumberCount = jlLastNumberCount + vm.batchData2[vm.batchData2.length - 1].minCunt;
                  //存储所有小计数据
                  vm.projectBatchCount.push({
                    projectName: vm.batchData2[vm.batchData2.length - 1].projectName,
                    //CreatedTime: "小计",
                    dayCountNumber: dayCount,
                    jlNumber: vm.batchData2[vm.batchData2.length - 1].minCunt,
                    jdNumber: jdCount,
                    tjNumber: tjCount,
                    zxNumber: zxCount,
                    colp: 0,
                    myCol: '#ffffff',
                  });
                  //加小计数据
                  vm.batchData2.push({
                    projectName: "",
                    CreatedTime: "小计",
                    dayCountNumber: dayCount,
                    jlNumber: vm.batchData2[vm.batchData2.length - 1].minCunt,
                    jdNumber: jdCount,
                    tjNumber: tjCount,
                    zxNumber: zxCount,
                    minCunt: item.jlNumberCount,//小计，监理人数
                    colp: 0,
                    myCol: '#efebeb',
                  });

                  tjCount = 0;
                  jdCount = 0;
                  zxCount = 0;
                  dayCount = 0;


                  //计算跨行
                  row += 1;
                  vm.batchData2[vm.batchData2.length - row].colp = row;
                  row = 0;
                }

                tjCount = tjCount + item.tjNumber;
                jdCount = jdCount + item.jdNumber;
                zxCount = zxCount + item.zxNumber;
                dayCount = dayCount + item.dayCountNumber;

                vm.batchData2.push({
                  projectName: item.projectName,
                  CreatedTime: item.CreatedTime,
                  dayCountNumber: item.dayCountNumber,
                  jlNumber: item.jlNumber,
                  jdNumber: item.jdNumber,
                  tjNumber: item.tjNumber,
                  zxNumber: item.zxNumber,
                  minCunt: item.jlNumberCount,//小计，监理人数
                  colp: 0,
                  myCol: '#ffffff',
                });
                i += 1;
                row += 1;
              }
              tjLastCount = tjLastCount + item.tjNumber;
              jdLastCount = jdLastCount + item.jdNumber;
              zxLastCount = zxLastCount + item.zxNumber;
              dayLastCount = dayLastCount + item.dayCountNumber;


              //最后一条
              if (r.data.Rows.length == i) {
                jlLastNumberCount = jlLastNumberCount + vm.batchData2[vm.batchData2.length - 1].minCunt;
                //存储所有小计数据
                vm.projectBatchCount.push({
                  projectName: vm.batchData2[vm.batchData2.length - 1].projectName,
                  //CreatedTime: "小计",
                  dayCountNumber: dayCount,
                  jlNumber: vm.batchData2[vm.batchData2.length - 1].minCunt,
                  jdNumber: jdCount,
                  tjNumber: tjCount,
                  zxNumber: zxCount,
                  colp: 0,
                  myCol: '#ffffff',
                });

                vm.batchData2.push({
                  projectName: "",
                  CreatedTime: "小计",
                  dayCountNumber: dayCount,
                  jlNumber: vm.batchData2[vm.batchData2.length - 1].minCunt,
                  jdNumber: jdCount,
                  tjNumber: tjCount,
                  zxNumber: zxCount,
                  minCunt: item.jlNumberCount,//小计，监理人数
                  colp: 0,
                  myCol: '#efebeb',
                });
                //计算跨行
                row += 1;
                vm.batchData2[vm.batchData2.length - row].colp = row;
                vm.batchData2.push({
                  projectName: "",
                  CreatedTime: "总计",
                  dayCountNumber: dayLastCount,
                  jlNumber: jlLastNumberCount,
                  jdNumber: jdLastCount,
                  tjNumber: tjLastCount,
                  zxNumber: zxLastCount,
                  minCunt: item.jlNumberCount,//小计，监理人数
                  colp: 1,
                  myCol: '#b9b3b3',
                });

                vm.projectBatchCount.push({
                  projectName: "总计",
                  //  CreatedTime: "总计",
                  dayCountNumber: dayLastCount,
                  jlNumber: jlLastNumberCount,
                  jdNumber: jdLastCount,
                  tjNumber: tjLastCount,
                  zxNumber: zxLastCount,
                  colp: 1,
                  myCol: '#b9b3b3',
                });
                tjCount = 0;
                jdCount = 0;
                zxCount = 0;
                dayCount = 0;
              }

            })
          });
      }
      $scope.$watch('project.pid', function() {
        vm.batchData2 = [];
        if ((!vm.m.sDate) || (!vm.m.eDate)) {
          utils.alert("查询时间不能为空！");
          return;
        } else {
          vm.search();
        }

      });
      $scope.$watch('m.eDate', function() {
        vm.batchData2 = [];
        if ((!vm.m.sDate) || (!vm.m.eDate)) {
          utils.alert("查询时间不能为空！");
          return;
        } else {
          vm.search();
        }
      });
      $scope.$watch('m.sDate', function() {
        vm.batchData2 = [];
        if ((!vm.m.sDate) || (!vm.m.eDate)) {
          return;
        } else {
          vm.search();
        }

      });
      // 返回
      vm.goback = function() {
        history.go(-1);
      }
      history.go(-1);
    }
  }
})();
