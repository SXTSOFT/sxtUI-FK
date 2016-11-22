/**
 * Created by emma on 2016/11/15.
 */
(function(){
  'use strict';

  angular
    .module('app.inspection')
    .component('statisticsProblempage',{
      templateUrl:'app/main/inspection/statistics/statistics-problempage.html',
      controller:statisticsProblempageController,
      controllerAs:'vm'
    });

  /**@ngInject*/
  function statisticsProblempageController(){
    var vm = this;
    vm.myDate=new Date();
    vm.problem={number:30,number1:20,number2:10}
    vm.data= {
      config: {
        showXAxis: false,
        showYAxis: true,
        showLegend: false,
        xyExchange:true,
        debug: true,
        stack: false,
        xAxis: {
          type: 'value',
        },
        yAxis:{
          type:'category'
        },
        dataZoom:[

          {
            type: 'slider',
            show: false,
            yAxisIndex: 0,
            filterMode: 'empty',
            width: 1200,
            height: '100%',
            handleSize: 108,
            showDataShadow: false,
            left: '93%'
          }
        ],
        series:{

        },
      }
    };

    vm.data.data = [{"datapoints":[
      {"x":"达达装饰","y":"7","color":"red"},
      {"x":"丽华装饰","y":"8","color":"red"},
      {"x":"龙泰利装饰","y":"9","color":"red"},
      {"x":"美装","y":"10","color":"red"},
      {"x":"美装","y":"20","color":"red"},
      {"x":"美装","y":"30","color":"red"},
      {"x":"美装","y":"40","color":"red"},
      {"x":"美装","y":"50","color":"red"},
      {"x":"美装","y":"60","color":"red"},
      {"x":"龙泰利装饰","y":"70","color":"red"}
    ]}];
    vm.data.data1 = [{"datapoints":[
      {"x":"顺丰","y":"7","color":"red"},
      {"x":"圆通","y":"8","color":"red"},
      {"x":"中通","y":"9","color":"red"},
      {"x":"申通","y":"10","color":"red"},
      {"x":"天天","y":"20","color":"red"}
    ]}];
    vm.tab=(function (type) {

    })
  }

})();
