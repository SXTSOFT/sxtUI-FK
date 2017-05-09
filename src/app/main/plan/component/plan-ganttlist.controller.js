/**
 * Created by emma on 2016/9/27.
 */
(function(){
  'use strict';

  angular
    .module('app.plan')
    .component('planGanttlist',{
      templateUrl:'app/main/plan/component/plan-ganttlist.html',
      controller:planGanttlist,
      controllerAs:'vm'
    });

  /**@ngInject*/
  function  planGanttlist($scope,$state,api,utils){
    var vm = this;
    
    $scope.pageing={
      page:1,
      pageSize:10,
      total:0
    };
    vm.pageAction = function(title, page, pageSize, total){
      $scope.pageing.page = page;
    }
    $scope.$watch("pageing",function(){
      load();
    },true);
    function load(){
      vm.loading = false;
      var page= utils.getPage($scope.pageing);
      api.plan.BuildPlan.getList({status:'Generated',Skip:page.Skip,Limit:page.Limit}).then(function(r){
        vm.items = r.data.Items;
        vm.loading = true;
        $scope.pageing.total = r.data.TotalCount;
      },function(err){
        
      });
    }
    //load();
    vm.Delete = function(item){
      utils.confirm('确定删除',null).then(function(){
        api.plan.BuildPlan.deleteBuildPlan(item.Id).then(function(r){
          utils.alert('删除成功').then(function(){
            load();
          })
        },function(err){
          utils.alert(err.data||'删除失败')
        })
      })

    }
    vm.edit = function(item){
      if(item.status == 0){
        utils.alert('计划正在创建，请稍后').then(function(){
            load();
          },function(err){
            //utils.alert(err.data||'开启精装修失败')
          })
      }else{
        $state.go("app.plan.milestone.gantt",{id:item.Id})
      }
      
    }
    vm.openJzx = function(item){
      utils.confirm('确定开启精装修',null).then(function(){
        api.plan.BuildPlan.startRenovation(item.Id).then(function(r){
          utils.alert('开启精装修成功').then(function(){
            load();
          },function(err){
            utils.alert(err.data||'开启精装修失败')
          })
        })
      })
    }
  }
})();
