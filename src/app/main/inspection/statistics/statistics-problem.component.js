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
  function statisticsProblemController($state,utils,$scope,api){
    var vm = this;
    vm.data=[
      {datatime:'2016-11-12 12:00',title:'深圳留仙洞一期B#1201餐厅',content:'墙面-墙面开裂',responsibilityunit:'达达装饰',type:'all'},
      {datatime:'2016-11-13 12:00',title:'深圳留仙洞二期B#1201餐厅',content:'墙面-墙面开裂',responsibilityunit:'达达装饰',type:'all'},
      {datatime:'2016-11-14 12:00',title:'深圳留仙洞三期B#1201餐厅',content:'墙面-墙面开裂',responsibilityunit:'达达装饰',type:'notclose'},
      {datatime:'前天 12:00',title:'深圳留仙洞四期B#1201餐厅',content:'墙面-墙面开裂',responsibilityunit:'达达装饰',type:'notclose'},
      {datatime:'昨天 12:00',title:'深圳留仙洞五期B#1201餐厅',content:'墙面-墙面开裂',responsibilityunit:'达达装饰',type:'alreadyclosed'},
      {datatime:'今天 12:00',title:'深圳留仙洞六期B#1201餐厅',content:'墙面-墙面开裂',responsibilityunit:'达达装饰',type:'alreadyclosed'},
      {datatime:'昨天 12:00',title:'深圳留仙洞七期B#1201餐厅',content:'墙面-墙面开裂',responsibilityunit:'达达装饰',type:'meestablish'},
      {datatime:'今天 12:00',title:'深圳留仙洞八期B#1201餐厅',content:'墙面-墙面开裂',responsibilityunit:'达达装饰',type:'meestablish'}
    ]
    vm.qdetail=(function (item) {
      if(item.type!="alreadyclosed") {
        $state.go('app.statistics.problemdetail', {id: item.title});
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

      vm.data.type=type;
    })
  }

})();
