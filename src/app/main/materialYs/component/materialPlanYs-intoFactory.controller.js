/**
 * Created by Administrator on 2016/10/25.
 */

(function () {
  'use strict';
  angular
    .module('app.xhsc')
    .component('materialIntoFactory',{
      templateUrl:'app/main/materialYs/component/materialPlanYs-intoFactory.html',
      controller:materialIntoFactory,
      controllerAs:'vm'
    });

  /** @ngInject */
  function materialIntoFactory($scope,api,utils){

  }

})(angular,undefined);
