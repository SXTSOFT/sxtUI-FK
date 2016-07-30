/**
 * Created by emma on 2016/2/23.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .controller('SzgcbuilddetailController', SzgcdetailController);

  /** @ngInject */
  function SzgcdetailController($scope,details,$stateParams)
  {

    var vm = this;
    vm.build = {
      name: $stateParams.buildName || $scope.$parent.vm.current.name,
      building_id: $stateParams.buildId || $scope.$parent.vm.current.building_id,
      floors: $stateParams.floors || $scope.$parent.vm.current.floors,
      summary: $stateParams.summary || $scope.$parent.vm.current.summary,
      gx1: $scope.$parent.vm.current.gx1,
      gx2: $scope.$parent.vm.current.gx2
    };
    vm.treeId = $stateParams.pid + '>' + $stateParams.itemId + '>' + $stateParams.buildId;
    vm.sellLine = 0.6;
    vm.data= {
      config: {
        showXAxis: true,
        showYAxis: true,
        showLegend: false,
        width:367,
        debug: true,
        stack: false,
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



  }

})();
