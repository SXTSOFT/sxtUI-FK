/**
 * Created by jiuyuong on 2016/10/9.
 */
(function (angular,undefined) {
  'use strict';

  angular
    .module('app.plan')
    .directive('taskCategories',taskCategories);
  /** @ngInject */
  function taskCategories(api) {
    return {
      require:'ngModel',
      scope:{
        value:'=ngModel'
      },
      templateUrl:'app/main/plan/directives/taskCategories.html',
      link:link
    }

    function link(scope,element,attrs,ctrl) {
      api.plan.Task.Categories.query().then(function (r) {
        scope.data = r.data;
      });
    }
  }
})(angular,undefined);
