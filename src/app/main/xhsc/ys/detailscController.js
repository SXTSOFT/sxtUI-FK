/**
 * Created by emma on 2016/5/11.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('detailscController',detailscController);

  /** @ngInject*/
  function detailscController($stateParams,remote){
    var vm = this;
    var iMax = 20;
    vm.info={
      pname: $stateParams.pname,
      name:$stateParams.name
    }
    remote.Assessment.getMeasure({
      RegionID:$stateParams.regionId,
      AcceptanceItemID:$stateParams.measureItemID,
      RecordType:4,
      RelationID:'' //$stateParams.db //TODO: 后台暂未存此数据，后面要去掉
    }).then(function (result){
      var newD = [];
      result.data.forEach(function (item) {
        item.rows = [];
        var ms = [];
        item.MeasureValueList.forEach(function (m) {
          if(ms.length<20) {
            ms.push(m)
          }
          else{
            item.rows.push(ms);
            ms = [];
          }
        });
        while (ms.length<20){
          ms.push({});
        }
        item.rows.push(ms);
        newD.push(item);
      });

      vm.scData = newD;
      console.log('res',result)
    })
   /* vm.scData = [{
      MeasureUserName:'aa',
      MeasureTime:2022-22-22,
      IndexName:'abc',
      MaximumDeviation:1,
      QualifiedRate:1,
      ResultStatus:1,
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
      MaximumDeviation:1,
      QualifiedRate:1,
      ResultStatus:2,
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
            newData.push({points:item.Points.slice(0,iMax),parent:false,rowspan:iSpan,IndexName:item.IndexName,
              MeasureUserName:item.MeasureUserName,MaximumDeviation:item.MaximumDeviation,QualifiedRate:item.QualifiedRate,
              ResultStatus:item.ResultStatus})
          }else{
            //item1.parent = true;
            //item1.rowspan =iSpan;
            //item1.IndexName = item.IndexName;
            //item1.MeasureUserName = item.MeasureUserName;
            //item.points = item.Points.slice(i*10,i*10+10);
            newData.push({points: item.Points.slice(i*iMax,i*iMax+iMax),parent:true,rowspan:iSpan,IndexName:item.IndexName,
              MeasureUserName:item.MeasureUserName,MaximumDeviation:item.MaximumDeviation,QualifiedRate:item.QualifiedRate,
              ResultStatus:item.ResultStatus})
          }

        }
      }else{
        //item1.points = item.Points;
        //item1.parent = false;
        //item1.rowspan =1;
        //item1.IndexName = item.IndexName;
        //item1.MeasureUserName = item.MeasureUserName;

        newData.push({points:item.Points,parent:false,rowspan:1,IndexName:item.IndexName,MeasureUserName:item.MeasureUserName,
          MaximumDeviation:item.MaximumDeviation,QualifiedRate:item.QualifiedRate,ResultStatus:item.ResultStatus})

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
    vm.cols =l;
    if((vm.cols +6)%4 != 0){
      vm.twoCols = Math.floor((vm.cols +6)/4) +1;
      vm.oneCols =(vm.cols +6) -2*vm.twoCols;
    }else{
      vm.twoCols = (vm.cols +6)/4;
      vm.oneCols = 2*vm.twoCols;
    }*/

  }
})();
