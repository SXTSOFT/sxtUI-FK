/**
 * Created by emma on 2016/5/11.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('detailscController',detailscController);

  /** @ngInject*/
  function detailscController(){
    var vm = this;
    var iMax = 20;
    vm.scData = [{
      MeasureUserName:'aa',
      MeasureTime:2022-22-22,
      IndexName:'abc',
      Points:[
        {
          MeasureValue:1
        }
      ]
    },{
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
          MeasureValue:3
        },{
          MeasureValue:4
        },
        {
          MeasureValue:5
        },
        {
          MeasureValue:6
        },{
          MeasureValue:7
        },{
          MeasureValue:8
        },{
          MeasureValue:9
        },{
          MeasureValue:10
        },{
          MeasureValue:11
        },{
          MeasureValue:11
        },{
          MeasureValue:11
        },{
          MeasureValue:11
        },{
          MeasureValue:11
        },{
          MeasureValue:11
        },{
          MeasureValue:11
        },{
          MeasureValue:11
        },{
          MeasureValue:11
        },{
          MeasureValue:11
        },{
          MeasureValue:21
        }
      ]
    }]
    var newData = [];
    //vm.scData = [{
    //  MeasureUserName:'aa',
    //  MeasureTime:2022-22-22,
    //  IndexName:'abc',
    //  parent:false,
    //  rowspan:1,
    //  Points:[
    //    {
    //      MeasureValue:1
    //    }
    //  ]
    //},{
    //  MeasureUserName:'ab',
    //  MeasureTime:2022-22-22,
    //  IndexName:'abcd',
    //  parent:false,
    //  rowspan:2,
    //  Points:[
    //    {
    //      MeasureValue:1
    //    },
    //    {
    //      MeasureValue:2
    //    },
    //    {
    //      MeasureValue:3
    //    },{
    //      MeasureValue:4
    //    },
    //    {
    //      MeasureValue:5
    //    },
    //    {
    //      MeasureValue:6
    //    },{
    //      MeasureValue:7
    //    },{
    //      MeasureValue:8
    //    },{
    //      MeasureValue:9
    //    },{
    //      MeasureValue:10
    //    }
    //  ]
    //},
    //  {
    //    MeasureUserName: 'ab',
    //    MeasureTime: 2022 - 22 - 22,
    //    IndexName: 'abcd',
    //    parent: true,
    //    rowspan:2,
    //    Points: [
    //      {
    //        MeasureValue: 11
    //      }]
    //  },{
    //    MeasureUserName: 'ab',
    //    MeasureTime: 2022 - 22 - 22,
    //    IndexName: 'abcd',
    //    parent: false,
    //    rowspan:1,
    //    Points: [
    //      {
    //        MeasureValue: 11
    //      }]
    //  }];
    vm.person = vm.scData[0].MeasureUserName;
    vm.time = vm.scData[0].MeasureTime;
    vm.rowslength = vm.scData.length;
    var cols=[];
    var l=0;
    vm.scData.forEach(function(item){
      item.cols = item.Points.length;
      if(item.cols>l&&item.cols <=iMax)l=item.cols;
      if(item.cols > iMax){
        l=iMax;
        var temp = [];
        var iSpan = 1 + Math.floor(item.cols / iMax);
        for(var i=0;i<iSpan;i++){
          if(i==0){
            //item1.parent = false;
            //item1.rowspan =iSpan;
            //item1.points = item.Points.slice(0,10);
            //item1.IndexName = item.IndexName;
            //item1.MeasureUserName = item.MeasureUserName;
            newData.push({points:item.Points.slice(0,iMax),parent:false,rowspan:iSpan,IndexName:item.IndexName,MeasureUserName:item.MeasureUserName})
          }else{
            //item1.parent = true;
            //item1.rowspan =iSpan;
            //item1.IndexName = item.IndexName;
            //item1.MeasureUserName = item.MeasureUserName;
            //item.points = item.Points.slice(i*10,i*10+10);
            newData.push({points: item.Points.slice(i*iMax,i*iMax+iMax),parent:true,rowspan:iSpan,IndexName:item.IndexName,MeasureUserName:item.MeasureUserName})
          }

        }
      }else{
        //item1.points = item.Points;
        //item1.parent = false;
        //item1.rowspan =1;
        //item1.IndexName = item.IndexName;
        //item1.MeasureUserName = item.MeasureUserName;
        newData.push({points:item.Points,parent:false,rowspan:1,IndexName:item.IndexName,MeasureUserName:item.MeasureUserName})
      }
    })
    vm.newData = newData;
    console.log('newData',newData)
    vm.newData.forEach(function(item){
      while(item.points.length<l){
            item.points.push({});
        }
    })
    //vm.scData.forEach(function(item){
    //  while(item.Points.length<l){
    //    item.Points.push({});
    //  }
    //})
    vm.rowData = [[
      {
        MeasureValue:1
      },
      {
        MeasureValue:2
      },
      {
        MeasureValue:3
      },{
        MeasureValue:4
      },
      {
        MeasureValue:5
      }
    ],[
      {
        MeasureValue:1
      },
      {
        MeasureValue:2
      },
      {
        MeasureValue:3
      },{
        MeasureValue:4
      },
      {
        MeasureValue:5
      },
      {
        MeasureValue:6
      },{
        MeasureValue:7
      },{
        MeasureValue:8
      },{
        MeasureValue:9
      },{
        MeasureValue:10
      }
    ],[
      {
        MeasureValue:1
      }
    ]]
    vm.cols =l;
    if((vm.cols +6)%4 != 0){
      vm.twoCols = Math.floor((vm.cols +6)/4) +1;
      vm.oneCols =(vm.cols +6) -2*vm.twoCols;
    }else{
      vm.twoCols = (vm.cols +6)/4;
      vm.oneCols = 2*vm.twoCols;
    }

  }
})();
