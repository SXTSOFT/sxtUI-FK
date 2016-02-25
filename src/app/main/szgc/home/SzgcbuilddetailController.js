/**
 * Created by emma on 2016/2/23.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .controller('SzgcbuilddetailController', SzgcdetailController);

  /** @ngInject */
  function SzgcdetailController($scope,details)
  {

    var vm = this;
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

    vm.back = function(){
      history.back();
    }
    //获取floorData的一些数据－－flayerData
    //vm.sxtfloor = flData.flData;
    //[
    //  {"data":[50,20,10,5,5]},
    //  {"data":[50,30,10,5,10]},
    //  {"data":[50,40,20,15,5]},
    //  {"data":[50,40,10,5,25]}
    //]

    //console.log('detail',details)
    vm.buildDetail = details;
    //vm.buildDetail={
    //  'title':'二期工程',
    //  'data':[50,50,20,10,10,1],
    //  'start':'2010-10-10',
    //  'end':'2010-11-11',
    //  'sale':'2011-01-01'
    //}
    vm.buildFloor = vm.buildDetail.data[0];

  }

})();
