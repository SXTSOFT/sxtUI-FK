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
          IndexName:'abcd',
          Points:[
            {
              MeasureValue:1
            },
            {
              MeasureValue:2
            },
            {
              MeasureValue:2
            },{
              MeasureValue:2
            },
            {
              MeasureValue:2
            },
            {
              MeasureValue:2
            },{
              MeasureValue:2
            },{
              MeasureValue:2
            },{
              MeasureValue:2
            },{
              MeasureValue:2
            },{
              MeasureValue:2
            },{
              MeasureValue:2
            },{
              MeasureValue:2
            },{
              MeasureValue:2
            },{
              MeasureValue:2
            },{
              MeasureValue:2
            },{
              MeasureValue:2
            },{
              MeasureValue:2
            },{
              MeasureValue:2
            },{
              MeasureValue:2
            },{
              MeasureValue:2
            },{
              MeasureValue:2
            }
          ]
        },
        {
          MeasureUserName:'ac',
          MeasureTime:2022-22-22,
          IndexName:'abce',
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
      if(item.cols>l&&item.cols <=20)l=item.cols;
      if(item.cols > 20){
        l=20;
        item.rowspan =1 + Math.floor(item.cols / 20);
        vm.rowslength += Math.floor(item.cols / 20);
      }else{
        item.rowspan =1;
      }
      if(item.rowspan >1){
        item.rowData = [[{value:5},{value:6}],[{value:7},{value:8}]]
        //item.rowData =
      }else {
        item.rowData = [[{value:15},{value:16}]]
      }
    })
   // console.log('length',vm.alItem)
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
