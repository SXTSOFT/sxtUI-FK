/**
 * Created by emma on 2016/5/11.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('detailscController',detailscController);

  /** @ngInject*/
  function detailscController($stateParams,remote,$rootScope){
    var vm = this;
    var iMax = 20;
    vm.info={
      pname: $stateParams.pname,
      name:$stateParams.name
    };
    $rootScope.title = vm.info.name+'('+vm.info.pname+')';
    vm.back = function () {
      history.back();
    }
    remote.Assessment.getMeasureNew({
      RegionID:$stateParams.regionId,
      AcceptanceItemID:$stateParams.measureItemID,
      RecordType:4,
      RelationID:$stateParams.db
    }).then(function (result){
      var newD = [];
      result.data.forEach(function (item) {
        if(!item.MeasureValueList.length){
          var rowSpan = 0,t1=0,t2 = 0;
          item.Children = result.data.filter(function (r) {
            if(r.ParentAcceptanceIndexID==item.AcceptanceIndexID){
              if(r.MeasureValueList.length==0)return false;
              r.rows = [];
              var ps=[];
              r.QualifiedRate = r.QualifiedRate * 100;
              r.allDot = r.QualifiedPointNum + r.UnqualifiedPointNum;
              t1 += r.QualifiedPointNum;
              t2 += r.allDot;
              r.MeasureValueList.forEach(function (m) {
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
                  r.rows.push(p.ms);
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
                  r.rows.push(ms);
                }
              });
              r.rows.forEach(function (ms) {
                while (ms.length<20){
                  ms.push({});
                }
              });
              rowSpan+=r.rows.length;
              return true;
            }
            return false;
          });

          item.QualifiedPointNum = t1;
          item.rowSpan = rowSpan;
          item.allDot = t2;
          newD.push(item);
        }
        else if(!item.ParentAcceptanceIndexID){
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
            if(m.ExtendedField1 && m.ExtendedField1.indexOf(',')){
              var ms = m.ExtendedField1.split(',');
              ms.forEach(function (v) {
                p.ms.push({
                  MeasureStatus:m.MeasureStatus,
                  MeasureValue:v,
                  MeasureValueId:m.MeasureValueId
                });
              });
              p.ParentMeasureValueID = m.MeasureValueId;
            }
            else {
              p.ms.push(m);
              if (item.AcceptanceIndexName.indexOf('尺寸一致性') != -1) {
                m.MeasureValue = m.MeasureValue + '<br/>' + m.DesignValue;
              }
            }
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
      console.log(vm.scData)
    });
  }
})();
