/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('checkHouseController',checkHouseController);

  /** @ngInject */
  function checkHouseController($scope){
    var vm=this;
    var rs = {
      data:[
        {
          MeasureUserName:'aa',
          MeasureTime:2022-22-22,
          IndexName:'abc',
          Points:[
            {
              MeasureValue:1
            }
          ]
        },
        {
          MeasureUserName:'ab',
          MeasureTime:2022-22-22,
          IndexName:'abc',
          Points:[
            {
              MeasureValue:1
            },
            {
              MeasureValue:2
            },
            {
              MeasureValue:2
            }
          ]
        },
        {
          MeasureUserName:'ac',
          MeasureTime:2022-22-22,
          IndexName:'abc',
          Points:[
            {
              MeasureValue:5
            }
          ]
        }
      ]
    }
    vm.alItem = rs.data;
    vm.person = rs.data[0].MeasureUserName;
    vm.time = rs.data[0].MeasureTime;
    vm.rowslength = rs.data.length;
    var cols=[];
    var l=0;
    rs.data.forEach(function(item){
     // console.log('rs',item);
      item.cols = item.Points.length;
      if(item.cols>l)l=item.cols;

    })

    rs.data.forEach(function(item){
      while(item.Points.length<l){
        item.Points.push({});
      }
    })
    vm.cols =l;
    if((vm.cols +5)%4 != 0){
      vm.twoCols = Math.floor((vm.cols +5)/4) +1;
      vm.oneCols =(vm.cols +5) -2*vm.twoCols;
    }else{
      vm.twoCols = (vm.cols +5)/4;
      vm.oneCols = 2*vm.twoCols;
    }

  }
})();
