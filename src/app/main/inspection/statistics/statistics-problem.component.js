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
  function statisticsProblemController($state,utils,$scope,api,auth){
    var vm = this;
    vm.parm={
      page_size:10 ,
      page_number:1
    }


    auth.getUser().then(function (r) {
      vm.userid=r.Id;
    });
    api.inspection.estate.getrepair_tasks(vm.parm).then(function (r) {
      vm.data=r.data.data;
    })

    vm.qdetail=(function (item) {
      if(item.type!="alreadyclosed") {
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
      vm.data.userid="";
      vm.data.type="";
      if(type=="my")
        vm.data.userid=vm.userid;
      else
        vm.data.type=type;
    })
  }

})();
