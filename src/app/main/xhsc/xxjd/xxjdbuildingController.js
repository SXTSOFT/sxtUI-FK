/**
 * Created by emma on 2016/6/24.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('xxjdbuildingController',xxjdbuildingController);

  /**@ngInject*/
  function xxjdbuildingController($scope,$stateParams,details){
    var vm = this;
    //vm.build = builds.builds[0];
    //vm.buildLen =builds.builds.length;
    //console.log($scope)
    vm.build = {
      name:$stateParams.name,
      id:$stateParams.id,
      gx1:$scope.$parent.current.gx1,
      floors:$scope.$parent.current.floors,
      sellLine:$scope.$parent.current.sellLine,
      summary:$scope.$parent.current.summary
    }

    vm.data= {
      config: {
        showXAxis: true,
        showYAxis: true,
        showLegend: false,
        width:'100%',
        debug: true,
        stack: false,
        dataZoom:{
          show:false
        },
        xAxis:{
          type: 'category'
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 50,
          axisLabel: {
            formatter: function (value, index) {
              return parseInt(value);//非真正解决
            }
          },
          yAxisIndex:0
        },
        series: {
          label: {
            normal: {
              show: true
            }
          }
        }
      },
      data:details
    };
    console.log('details',details)
  }
})();
