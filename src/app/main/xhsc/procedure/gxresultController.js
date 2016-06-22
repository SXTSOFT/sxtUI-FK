/**
 * Created by emma on 2016/5/31.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxresultController',gxresultController);

  /** @ngInject*/
  function gxresultController($mdDialog,$stateParams,$state,$scope,remote){
    var vm = this;
    vm.params = $stateParams;
    vm.gxname = $stateParams.acceptanceItemName;
    vm.bwname = $stateParams.name;

    vm.times = [{
      time:'一天'
    },{
      time:'二天'
    },{
      time:'三天'
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
    remote.Assessment.queryAllBulidings($stateParams.projectId).then(function(result){
      vm.allRelations = [];
      var f = result.data.Sections.find(function(t){
        return t.AreaID ===  $stateParams.areaId;
      })
      if(f){
        vm.allRelations.push(f);
      }
      //console.log(vm.allRelations)
    })

    //console.log($scope)
  }
})();
