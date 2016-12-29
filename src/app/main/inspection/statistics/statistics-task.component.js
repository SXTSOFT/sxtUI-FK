/**
 * Created by emma on 2016/11/15.
 */
(function(){
  'use strict';

  angular
    .module('app.inspection')
    .component('statisticsTask',{
      templateUrl:'app/main/inspection/statistics/statistics-task.html',
      controller:statisticsTaskController,
      controllerAs:'vm'
    });

  /**@ngInject*/
  function statisticsTaskController(utils,$scope){
    var vm=this;
    vm.height=$(window).height();
    vm.ptop=$(window).height()/6+'px;';
    vm.count=[
      {title:'未开始',value:20,percentage:'50%',color:'red'},
      {title:'已开始',value:20,percentage:'33%',color:'red'},
      {title:'已完成',value:10,percentage:'17%',color:'red'}
    ];
  }

})();
