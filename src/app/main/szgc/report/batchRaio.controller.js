/**
 * Created by emma on 2016/4/8.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .controller('batchRaioController',batchRaioController);

  /** @ngInject */
    function batchRaioController($scope,_projects,_skills,$filter,api,utils) {
      var vm = this;
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
      //初始化班组
      vm.skills = _skills.data.data;
      for (var i = 0; i < vm.skills.length; i++) {
        vm.skills[i].selected = false;
      }
      vm.isSkillChecked = false;
      //vm.selected = vm.projects;
      vm.toggleskill = function (item) {
        console.log('item',item)
        item.selected = !item.selected;
      };
      vm.toggleSkillAll = function() {
        vm.isSkillChecked = !vm.isSkillChecked;
        if(vm.isSkillChecked){
          for (var i = 0; i < vm.skills.length; i++) {
            vm.skills[i].selected = true;
          }
        }else{
          for (var i = 0; i < vm.skills.length; i++) {
            vm.skills[i].selected = false;
          }
        }
      };

      //初始化日期
      var dateFilter = $filter('date');
      vm.m.eDate = new Date();
      var d = new Date()
      d.setDate(d.getDate() - 7);
      vm.m.sDate = d;

      $scope.$watch(function(){
        return vm.projects.project_id;
      }, function() {
        vm.batchData2 = [];
        if ((!vm.m.sDate) || (!vm.m.eDate)) {
          utils.alert("查询时间不能为空！");
          return;
        } else {
          //vm.search();
        }
      });

      $scope.$watch('m.eDate', function() {
        vm.batchData2 = [];
        if ((!vm.m.sDate) || (!vm.m.eDate)) {
          utils.alert("查询时间不能为空！");
          return;
        } else {
          //vm.search();
        }

      });
      $scope.$watch('m.sDate', function() {
        vm.batchData2 = [];
        if ((!vm.m.sDate) || (!vm.m.eDate)) {
          return;
        } else {
          //vm.search();
        }

      });
      function trim(str) { //删除左右两端的空格
        return str.replace(/(^\s*)|(\s*$)/g, "");
      }
      vm.postData = function(){
        if (vm.m.sDate && vm.m.eDate && (vm.m.sDate > vm.m.eDate)) {
          utils.alert("查询开始时间不能大于结束时间！");
          vm.searBarHide=false;
          return false;
        }
        api.szgc.grpFitRateService.getGrpFitRateByFiter(post.getPrjs(), post.getSkills(), vm.m.sDate, vm.m.eDate).then(function (_reportData) {
          if (_reportData.data && _reportData.data.Rows && _reportData.data.Rows.length > 0) {
            vm.reportData = _reportData.data.Rows;
            var fitArr = [];
            for (var i = 0; i < vm.reportData.length; i++) {
              vm.reportData[i].rate = vm.reportData[i].Avg_JLLast ? vm.reportData[i].Avg_JLLast : vm.reportData[i].Avg_JLFirst;
              if (vm.reportData[i].rate > 0 && vm.reportData[i].rate <= 100) {
                fitArr.push(vm.reportData[i]);
              }
            }
            vm.reportData = fitArr.sort(function (a, b) {
              return (a.rate - b.rate);
            });
            vm.searBarHide=true;
            showReport();
          } else {
            vm.searBarHide=false;
            utils.alert("查无数据!");
          }
        });
      }
      var post = {
        getPrjs: function () {
          var prjs = null;
          for (var i = 0; i < vm.projects.length; i++) {
            if (vm.projects[i].selected) {
              prjs =trim(prjs ? (prjs + ',' + vm.projects[i].project_id) : vm.projects[i].project_id);
            }
          }
          return prjs;
        },
        getSkills: function () {
          var skills;
          for (var i = 0; i < vm.skills.length; i++) {
            if (vm.skills[i].selected) {
              skills =trim(skills ? (skills + ',' + vm.skills[i].skill_id) : vm.skills[i].skill_id);
            }
          }
          return skills;
        }
      }
      //报表
      function showReport() {
        var xAxis_data = [];//x轴数据
        var fit_value = [];//y轴数据
        //初始化报表x,y轴的数据
        (function init() {

          function format(str_input) {
            var str_tmp = '';
            for (var i = 0; i < str_input.length; i = i + 2) {
             // str_tmp = str_tmp + str_input.substr(i, 2) + '\n';
              str_tmp = str_input.substr(0, 4);
            }
            return str_tmp;
          }
          function getName(str_input){
            var str='';
            if(str_input){
              var istr = str_input.split('(');
              if(istr[1]){
                var istr2=istr[1].split(')');
                return str = istr2[0];
              }else{
                return str = istr[0];
              }

              // console.log('aa',istr2)

            }

          }

          if (vm.reportData) {
            console.log('vm',vm.reportData)
            var Avg_JLLast, Avg_JLFirst;
            for (var i = 0; i < vm.reportData.length; i++) {
              xAxis_data.push({
                //x:format(vm.reportData[i].GrpName),
                x:getName(vm.reportData[i].GrpName),
                y:vm.reportData[i].rate,
                color:'#B5C334'
                //textStyle: {
                //  fontSize: 8,
                //  color: '#858585',
                //  align: 'center'
                //}
              });
              Avg_JLLast = $.isNumeric(vm.reportData[i].Avg_JLLast) ? vm.reportData[i].Avg_JLLast.toFixed(0) : Avg_JLLast;
              Avg_JLFirst = $.isNumeric(vm.reportData[i].Avg_JLFirst) ? vm.reportData[i].Avg_JLFirst.toFixed(0) : Avg_JLFirst
              fit_value.push(vm.reportData[i].Avg_JLLast ? Avg_JLLast : Avg_JLFirst);
            }
          }
        })();
        //呈现报表
        //var myChart3 = echarts.init(document.getElementById("report"));
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
            series:{
              data: fit_value,
              barMaxWidth: 20,
              barMinHeight: 20
            },
          }
        };
        var pageload = {
          datapoints: xAxis_data
        };
        vm.data.data = [ pageload ];
        console.log('dataa',vm.data.data)
        //myChart3.setOption({
        //  title: {
        //    text: '班组验收合格率对比',
        //    subtext: '单位(%)'
        //  },
        //  tooltip: {
        //    trigger: 'axis'
        //  },
        //  toolbox: {
        //    show: false,
        //    feature: {
        //      mark: { show: true },
        //      dataView: { show: true, readOnly: false },
        //      magicType: { show: true, type: ['line', 'bar'] },
        //      restore: { show: true },
        //      saveAsImage: { show: true }
        //    }
        //  },
        //  calculable: true,
        //  xAxis: [{
        //    axisLabel: {
        //      rotate: 0
        //    },
        //    type: 'category',
        //    data: xAxis_data
        //  }
        //  ],
        //  yAxis: [
        //    {
        //      type: 'value',
        //      min: 0,
        //      max: 100
        //    }
        //  ],
        //  series: [
        //    {
        //      name: '合格率',
        //      type: 'bar',
        //      data: fit_value,
        //      barMaxWidth: 20,
        //      barMinHeight: 20,
        //      itemStyle: {
        //        normal: {
        //          label: {
        //            show: true
        //          }
        //        }
        //      }
        //    }
        //  ]
        //});
        //var m = myChart3.getOption();
        //console.log('m',m);
      }
      vm.search = function () {
        if ((!vm.m.sDate) || (!vm.m.eDate)) {
          utils.alert("查询时间不能为空！");
          return;
        } else if (vm.m.sDate > vm.m.eDate) {
          utils.alert("开始时间不能大于结束时间！");
          return;
        }


        var startDate = dateFilter(vm.m.sDate, 'yyyy-MM-dd');
        var endDate = dateFilter(vm.m.eDate, 'yyyy-MM-dd');






      }
    }
})();
