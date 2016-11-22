/**
 * Created by emma on 2016/11/11.
 */
(function(angular,undefined){
  'use strict';

  angular
    .module('app.plan')
    .component('planPersonplan',{
      templateUrl:'app/main/plan/component/plan-personplan.html',
      controller:personPlanController,
      controllerAs:'vm'
    });

  /**@ngInject*/
  function personPlanController($scope,$rootScope){
    var vm = this;
    var data=new Date();
    vm.events=[{
      data:data
    }]
    //vm.events=[data]
    $scope.onlyWeekendsPredicate = function(date){
      console.log(date)
      for(var i=0;i<vm.events.length;i++){
        if(vm.events[i].data.getDate()-1===date.getDate()&&vm.events[i].data.getFullYear() === date.getFullYear() && vm.events[i].data.getMonth() === date.getMonth()){
          return true;
        }
      }
    }

    $rootScope.$on('md-calendar-change', function(event,data){
      //console.log('a',data)
    });
  }
})(angular,undefined);
