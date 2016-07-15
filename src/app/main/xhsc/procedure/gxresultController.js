/**
 * Created by emma on 2016/5/31.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxresultController',gxresultController);

  /** @ngInject*/
  function gxresultController($mdDialog,$stateParams,$state,$scope,remote,utils,db,sxt){
    var vm = this;
    vm.params = $stateParams;
    vm.gxname = $stateParams.acceptanceItemName;
    vm.bwname = $stateParams.name;
    var  InspectionId=$stateParams.InspectionId;

    vm.times = [{
      time:'一天',
      val:1
    },{
      time:'二天',
      val:2
    },{
      time:'三天',
      val:3
    },{
      time:'四天',
      val:4
    },{
      time:'五天',
      val:5
    }]
    vm.persons = [{
      unit:'甲方',
      users:[{
        name:'张三',
        id:1
      },{
        name:'李四',
        id:2
      },{
        name:'王五',
        id:3
      }]
    },{
      unit:'监理',
      users:[{
        name:'张三1',
        id:4
      },{
        name:'李四1',
        id:5
      },{
        name:'王五1',
        id:6
      }]
    },{
      unit:'施工单位',
      users:[{
        name:'张三2',
        id:7
      },{
        name:'李四2',
        id:8
      },{
        name:'王五2',
        id:9
      }]
    }]
    //console.log('s',$stateParams)
    remote.Project.queryAllBulidings($stateParams.projectId).then(function(result){
      vm.allRelations = [];
      var areaId = $stateParams.areaId;
      var tmp=[];
      result.data[0].Sections.forEach(function(t){
        tmp= t.SectionRegionIDs.split(',');
        var  d;
        if (angular.isArray(tmp)){
          d= tmp.find(function(x){
            return areaId.indexOf(x)>-1;
          });
          if (d){
            vm.allRelations.push(t);
          }
        }
      })
    });


    vm.params={
          InspectionID:InspectionId,
          Remarks:"",
          Day:7
    }

    vm.Isfail=true;
    var zgReceipt = db('createZGReceipt');
    vm.submitResult = function(){
      //console.log('time',vm.time)

      vm.data ={
        InspectionID:vm.params.InspectionID,
        Remarks:vm.params.Remarks,
        Day:vm.time
      }
      //
      //zgReceipt.addOrUpdate(vm.data).then(function(res){
      //  //console.log('res',res)
      //  utils.alert("暂存成功",null,function(){
      //    $state.go("app.xhsc.gx.gxmain",{index:0});
      //  });
      //})

      remote.Procedure.createZGReceipt(vm.data).then(function(r){
        console.log(r)
          if (r.data&&r.data.ErrorCode==0){
            utils.alert("保存成功",null,function(){
              $state.go("app.xhsc.gx.gxmain",{index:0});
            });
          }
      })
    }
  }
})();
