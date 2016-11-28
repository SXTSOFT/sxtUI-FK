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
        number:50,
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
      {"x":"美装","y":"40","color":"#ff6b50"},
      {"x":"美装","y":"50","color":"#ff6b50"},
      {"x":"美装","y":"60","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"},
      {"x":"美装","y":"40","color":"#ff6b50"},
      {"x":"美装","y":"50","color":"#ff6b50"},
      {"x":"美装","y":"60","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"},
      {"x":"美装","y":"40","color":"#ff6b50"},
      {"x":"美装","y":"50","color":"#ff6b50"},
      {"x":"美装","y":"60","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"},
      {"x":"美装","y":"40","color":"#ff6b50"},
      {"x":"美装","y":"50","color":"#ff6b50"},
      {"x":"美装","y":"60","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"},
      {"x":"美装","y":"40","color":"#ff6b50"},
      {"x":"美装","y":"50","color":"#ff6b50"},
      {"x":"美装","y":"60","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"},
      {"x":"龙泰利装饰","y":"70","color":"#ff6b50"}
    ]}];


    vm.data1= {
      config: {
        showXAxis: false,
        showYAxis: true,
        showLegend: false,
        number:9,
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
    vm.data1.data1 = [{"datapoints":[
      {"x":"顺丰","y":"7","color":"#ff6b50"},
      {"x":"圆通","y":"8","color":"#ff6b50"},
      {"x":"中通","y":"9","color":"#ff6b50"},
      {"x":"申通","y":"10","color":"#ff6b50"},
      {"x":"天天","y":"20","color":"#ff6b50"},
      {"x":"申通","y":"10","color":"#ff6b50"},
      {"x":"天天","y":"20","color":"#ff6b50"},
      {"x":"申通","y":"10","color":"#ff6b50"},
      {"x":"天天","y":"20","color":"#ff6b50"}
    ]}];
    vm.tab=(function (type) {

    })
  }

})();
