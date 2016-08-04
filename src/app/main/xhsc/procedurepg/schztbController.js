/**
 * Created by emma on 2016/7/27.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('schztbController',schztbController);

  /**@ngInject*/
  function schztbController($stateParams,$rootScope,remote){
    var vm = this;
    var iMax = 20;
    vm.info={
      pname: $stateParams.pname,
      name:$stateParams.name
    };
    vm.regionId=$stateParams.regionId;
    vm.AcceptanceItemID = $stateParams.measureItemID;
    $rootScope.title = vm.info.name+'('+vm.info.pname+')';
    vm.back = function () {
      history.back();
    }
    remote.Assessment.getMeasure({
      RegionID:$stateParams.regionId,//'0001500000000010000000001',//,
      AcceptanceItemID:$stateParams.measureItemID,//'c9ba481a76644c949d13fdb14b4b4adb',//,
      RecordType:1,
      RelationID:$stateParams.db//'a55164d5c46f454ca8df799f520bbba8'//
    }).then(function (result){
      var newD = [];
      vm.checkUser = result.data.checkUser;

      result.data.record.forEach(function (item) {
        //item.newList

        if(!item.List.length){
        //if(!item.newList.length){
          var rowSpan = 0,t1=0,t2 = 0,tempq=[],tempa=[];
          item.Children = result.data.record.filter(function (r) {
            if(r.ParentAcceptanceIndexID==item.AcceptanceIndexID){
              if(r.List.length==0)return false;
              r.rows = [];
              var ps=[];
              var numbers=[];
              for(var i=0;i<r.QualifiedPointNum.length;i++){
                var q = r.QualifiedPointNum[i].Value;
                var p = r.UnqualifiedPointNum[i].Value;
                tempa.push({Role:r.QualifiedPointNum[i].Role,allDot:q+p});
              }
              //r.numbers =numbers;
              for(var i=0;i< r.QualifiedPointNum.length;i++){
                tempq.push(r.QualifiedPointNum[i]);
              }
              r.QualifiedRate.forEach(function(v){
                v.Value = v.Value * 100;
              })
              r.List.forEach(function (m) {
                m.MeasureValue.forEach(function(r1){
                  var fi= m.MeasureStatus.find(function(_r){
                    return _r.Role == r1.Role;
                  })
                  if(fi){
                    r1.Status = fi.Value;
                  }
                })
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
          var t1a= 0,t2a= 0,t3a= 0,t4a=0,t5a=0,t6a=0;
          //item.Qall = t1;
          //item.QualifiedPointNum = t1;
          item.rowSpan = rowSpan;
          //item.allDot = t2;
          newD.push(item);
          //console.log(tempa)
          var atemp=[],btemp=[];
          if(tempa){
            for(var i=0;i<tempa.length;i++){
              var f =atemp.find(function(t){
                return t.Role == tempa[i].Role;
              })
              if(!f){
                f={
                  Role:tempa[i].Role,
                  t:tempa[i].allDot
                }
                atemp.push(f)
              }else{
                f.t +=tempa[i].allDot
              }
            }
          }
          if(tempq){
            for(var i=0;i<tempq.length;i++){
              var f =btemp.find(function(t){
                return t.Role == tempa[i].Role;
              })
              if(!f){
                f={
                  Role:tempq[i].Role,
                  t:tempq[i].Value
                }
                btemp.push(f)
              }else{
                f.t +=tempq[i].Value
              }
            }
          }
          var arra=[],arrb=[];
          for(var i=0;i<btemp.length;i++){
            var a = btemp[i].t/atemp[i].t;
            arra.push({Role:btemp[i].Role,Value:a});
          }
          for(var i=0;i<atemp.length;i++){
            var a = btemp[i].t+'/'+atemp[i].t;
            arrb.push({Role:btemp[i].Role,Value:a});
          }
          item.allDot = arrb;
          item.Qual = arra;
          //console.log(btemp);
          //item.allDot = item.allDot;
        }
        else if(!item.ParentAcceptanceIndexID){
          item.rows = [];
          var ps=[];
          item.QualifiedRate.forEach(function(v){
            v.Value = v.Value * 100;
          })
          var numbers=[];
          for(var i=0;i<item.QualifiedPointNum.length;i++){
            var q = item.QualifiedPointNum[i].Value;
            var p = item.UnqualifiedPointNum[i].Value;
            numbers.push({Role:item.QualifiedPointNum[i].Role,allDot:q+'/'+p});
          }
          item.numbers =numbers;

          //item.QualifiedRate = item.QualifiedRate * 100;
          //item.allDot = item.QualifiedPointNum + item.UnqualifiedPointNum;
         // item.QualifiedRate
          item.List.forEach(function (m) {

            m.MeasureValue.forEach(function(r){
              var fi= m.MeasureStatus.find(function(_r){
                return _r.Role == r.Role;
              })
              if(fi){
                r.Status = fi.Value;
              }
            })
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
              if (item.IndexName.indexOf('尺寸一致性') != -1) {
                m.MeasureValue.forEach(function(_r){
                  _r.Value =_r.Value + '<br/>' + m.DesignValue[$index].Value;
                })
                //m.MeasureValue = m.MeasureValue + '<br/>' + m.DesignValue;
              // m.MeasureValue = m.MeasureValue;
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
