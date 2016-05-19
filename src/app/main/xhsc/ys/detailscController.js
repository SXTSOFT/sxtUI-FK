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
      RelationID:'' //$stateParams.db //TODO: 后台暂未存此数据，后面要去掉
    }).then(function (result){
      var newD = [];
      var tempData = angular.copy(result.data);
      result.data.forEach(function (item) {

        if(!item.MeasureValueList.length){
          item.Children = [];
          item.rows=[[]];
          for(var i=0;i<20;i++){
            item.rows[0].push({})
          }
          result.data.forEach(function(t){
            if(item.AcceptanceIndexID == t.ParentAcceptanceIndexID){
              var idx = result.data.indexOf(t);
              //result.data.splice(idx,1);
              item.Children.push(t);
              t.rows=[];
              var ms = [];
              t.QualifiedRate = t.QualifiedRate * 100;
              t.MeasureValueList.forEach(function (m) {
                // if(m.MeasureValue !=0){
                if(ms.length<20) {
                  ms.push(m)
                }
                else{
                  t.rows.push(ms);
                  ms = [];
                }
              });
              while (ms.length<20){
                ms.push({});
              }
              t.rows.push(ms);

            }
          })
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
          var ms = [];
          item.QualifiedRate = item.QualifiedRate * 100;
          item.MeasureValueList.forEach(function (m) {
            // if(m.MeasureValue !=0){
            if(ms.length<20) {
              ms.push(m)
            }
            else{
              item.rows.push(ms);
              ms = [];
            }
            // }

          });
          while (ms.length<20){
            ms.push({});
          }
          item.rows.push(ms);
          newD.push(item);
        }


      });

      vm.scData = newD;
      console.log('res',newD)
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
