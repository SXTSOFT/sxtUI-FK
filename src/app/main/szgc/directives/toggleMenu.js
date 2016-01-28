/**
 * Created by zhangzhaoyong on 16/1/28.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .directive('toggleMenu',toggleMenuDirective);

  /** @ngInject */
  function toggleMenuDirective($mdMedia) {
    return {
      restrict: 'EA',
      template: '<md-button  class="md-fab menu md-mini" ng-class="{\'menu-left\':!inst}" lx-ripple="white" ng-click="whenClick()"><i class="fa fa-bars"></i><i class="fa fa-arrow-up"></i></md-button>',
      scope: {
        inst: '='
      },
      link: function (scope, element, attrs, ctrl) {
        scope.whenClick = function () {
          scope.inst = !scope.inst;
          if (scope.inst)
          {
            $(element.parents('md-tab-content')[0]).animate({ scrollTop: 0 }, 'slow');
          }
        }
        if ($mdMedia('sm'))
          scope.inst = true;
      }
    }
  }
})();
