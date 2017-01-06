/**
 * Created by emma on 2016/11/15.
 */
(function(){
  'use strict';

  angular
    .module('app.inspection')
    .component('statisticsProblem',{
      templateUrl:'app/main/inspection/statistics/statistics-problem.html',
      controller:statisticsProblemController,
      controllerAs:'vm'
    });

  /**@ngInject*/
  function statisticsProblemController($state,utils,$scope,api,auth,$q,$timeout){
    var vm = this;
    vm.parm={
      page_size:10 ,
      page_number:1
    }


    auth.getUser().then(function (r) {
      vm.userid=r.Id;
    });




    vm.qdetail=(function (item) {
      if(item.type!="closed") {
        $state.go('app.statistics.problemdetail', {task_id: item.task_id});
      }
    })
    utils.onCmd($scope,['swap'],function(cmd,e){
      if(e.arg.type){
        $state.go('app.inspection.desktop')
      }else{

      }

    })
    utils.onCmd($scope,['tj'],function(cmd,e){
      $state.go('app.statistics.problempage');
    })
    vm.tab=(function (type) {
      // vm.data=[];
      // vm.dataList.forEach(function (r) {
      //   if(r.status==type||type=="")
      //       vm.data.push(r);
      // })


      vm.count=0;
      vm.data.userid="";
      vm.data.type="";
      if(type=="my")
        vm.data.userid=vm.userid;
      else
        vm.data.type=type;


      vm.data.forEach(function (r) {

        if(type=="my")
        {
          if(r.operator.id==vm.data.userid){
            vm.count+=1;
          }
        }
        else
        {
          if(r.status==type||type==""){
            vm.count+=1;
          }
        }
      })
    })

    vm.load=function() {
      return api.inspection.estate.getrepair_tasks(vm.parm).then(function (r) {
        $timeout(function(){
          vm.data=r.data.data;
          //vm.data=vm.dataList;
          vm.show=true;
        })
      })
    }

    vm.load();


  }

})();
