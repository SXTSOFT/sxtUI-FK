/**
 * Created by abc on 2016/2/23.
 */
(function(){
  'use strict';

  angular.module('app.szgc')
    .controller('LineChartController',lineController);

  function lineController($scope){
    $scope.option ={
      tooltip: {
        show: false,
      },
    }
    var pageload = {
      name: '',
      datapoints: [
        { x: '主体', y: 35, },
        { x: '墙体', y: 25 },
        { x: '瓷砖', y: 20 },
        { x: '门窗', y: 15 },
        { x: '油漆', y: 10 }
      ]
    };

    var firstPaint = {
     // name: 'page.firstPaint',
      datapoints: [
        { x: '主体', y: 0 },
        { x: '墙体', y: 0 },
        { x: '瓷砖', y: 0 },
        { x:'门窗', y: 0 },
        { x: '油漆', y: 0 }

      ]
    };


    $scope.config = {
      //title: 'Bar Chart',
      //subtitle: 'Bar Chart Subtitle',

      showXAxis: true,
      showYAxis: true,
      showLegend: true,
      debug: true,
      stack: true,
    };

    $scope.data = [ pageload ];
    $scope.multiple = [pageload, firstPaint ];
  }

})();
