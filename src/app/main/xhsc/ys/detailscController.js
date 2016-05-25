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
    //console.log('stat',$stateParams)
    remote.Assessment.getMeasure({
      RegionID:$stateParams.regionId,
      AcceptanceItemID:$stateParams.measureItemID,
      RecordType:4,
      RelationID:$stateParams.db
    }).then(function (result){
      var newD = [];
      result.data.forEach(function (item) {

        if(!item.MeasureValueList.length){
          item.Children = [];
          item.rows=[[]];
          for(var i=0;i<20;i++){
            item.rows[0].push({})
          }
          newD.push(item);
          //var find = result.data.find(function(t){
          //  return item.AcceptanceIndexID == t.ParentAcceptanceIndexID;
          //})
          //if(find){
          //  //item.Children.push(item);
          //  console.log(find)
          //}
        }else if(!item.ParentAcceptanceIndexID){
          item.rows = [];
          var ps=[];
          item.QualifiedRate = item.QualifiedRate * 100;
          item.allDot = item.QualifiedPointNum + item.UnqualifiedPointNum;
          item.MeasureValueList.forEach(function (m) {
            var p = ps.find(function (p1) {
              return p1.ParentMeasureValueID == m.ParentMeasureValueID;
            });
            if(!p){
              p = {
                ParentMeasureValueID:m.ParentMeasureValueID,
                ms:[]
              };
              ps.push(p);
            }
            p.ms.push(m);
          });
          ps.forEach(function (p) {
            if(p.ms.length<=20){
              item.rows.push(p.ms);
            }
            else{
              var ms = [];
              p.ms.forEach(function (m) {
                if(ms.length<20){
                  ms.push(m);
                }
                else{
                  item.rows.push(ms);
                  ms=[m];
                }
              });
              item.rows.push(ms);
            }
          });
          item.rows.forEach(function (ms) {
            while (ms.length<20){
              ms.push({});
            }
          })
          newD.push(item);
        }


      });

      vm.scData = newD;
      console.log('res',result)
    });
    vm.testData = [{
      MeasureUserName:'aa',
      MeasureTime:2022-22-22,
      IndexName:'abc',
      MaximumDeviation:1,
      QualifiedRate:1,
      ResultStatus:1,
      Points:[
        [
          {
            MeasureValue:1
          },
          {
            MeasureValue:2
          }
        ],[
          {
            MeasureValue:3
          },{

          }
        ]
      ]
    },{
      MeasureUserName:'门洞',
      Children:[
        {
          MeasureTime:2022-22-22,
          IndexName:'宽',
          MaximumDeviation:1,
          QualifiedRate:1,
          ResultStatus:1,
          Points:[[
            {
              MeasureValue:1
            },
            {
              MeasureValue:2
            }
          ],[
            {
              MeasureValue:3
            },
            {
              MeasureValue:4
            }
          ]]
        },{
          MeasureTime:2022-22-22,
          IndexName:'高',
          MaximumDeviation:1,
          QualifiedRate:1,
          ResultStatus:1,
          Points:[[
            {
              MeasureValue:3
            },
            {
              MeasureValue:4
            }
          ]]
        },{
          MeasureTime:2022-22-22,
          IndexName:'厚',
          MaximumDeviation:1,
          QualifiedRate:1,
          ResultStatus:1,
          Points:[[
            {
              MeasureValue:3
            },
            {
              MeasureValue:4
            }
          ]]
        }
      ]
    },{
      MeasureUserName:'aa',
      MeasureTime:2022-22-22,
      IndexName:'abc',
      MaximumDeviation:1,
      QualifiedRate:1,
      ResultStatus:1,
      Points:[
        [
          {
            MeasureValue:1
          },
          {
            MeasureValue:2
          }
        ]
      ]
    }
    ]
  }
})();
