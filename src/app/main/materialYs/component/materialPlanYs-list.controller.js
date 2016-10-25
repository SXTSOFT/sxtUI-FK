/**
 * Created by Administrator on 2016/10/24.
 */
(function () {
  'use strict';
  angular
    .module('app.xhsc')
    .component('materialPlanList',{
      templateUrl:'app/main/materialYs/component/materialPlanYs-list.html',
      controller:materialPlanList,
      controllerAs:'vm'
    });

  /** @ngInject */
  function materialPlanList($scope,api,utils){
    var vm = this;
    vm.planList = [
      {'id':1,'planName':'AAA','status':'未进','index':0},
      {'id':2,'planName':'BBB','status':'未验','index':1},
      {'id':3,'planName':'CCC','status':'未检','index':2},
      {'id':4,'planName':'DDD','status':'未档','index':3}
    ];

    vm.NotIntoFactoryList = [
      {'id':1,'planName':'AAA','status':'未进','index':0},
      {'id':2,'planName':'BBB','status':'未进','index':0},
      {'id':3,'planName':'CCC','status':'未进','index':0},
      {'id':4,'planName':'DDD','status':'未进','index':0}
    ];

    vm.NotAcceptanceList = [
      {'id':1,'planName':'AAA','status':'未验','index':1},
      {'id':2,'planName':'BBB','status':'未验','index':1},
      {'id':3,'planName':'CCC','status':'未验','index':1},
      {'id':4,'planName':'DDD','status':'未验','index':1}
    ];

    vm.NotCheckList = [
      {'id':1,'planName':'AAA','status':'未检','index':2},
      {'id':2,'planName':'BBB','status':'未检','index':2},
      {'id':3,'planName':'CCC','status':'未检','index':2},
      {'id':4,'planName':'DDD','status':'未检','index':2}
    ];

    vm.NotArchivedList = [
      {'id':1,'planName':'AAA','status':'未档','index':3},
      {'id':2,'planName':'BBB','status':'未档','index':3},
      {'id':3,'planName':'CCC','status':'未档','index':3},
      {'id':4,'planName':'DDD','status':'未档','index':3}
    ];

    vm.NotInstructionsList = [
      {'id':1,'planName':'AAA','status':'未档','index':4},
      {'id':2,'planName':'BBB','status':'未档','index':4},
      {'id':3,'planName':'CCC','status':'未档','index':4},
      {'id':4,'planName':'DDD','status':'未档','index':4}
    ];

    vm.AllBtnClick = function (rflag,rid) {

    }
  }
})(angular,undefined)
