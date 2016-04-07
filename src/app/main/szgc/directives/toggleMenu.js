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
      template: '<md-button  class="md-fab menu md-mini" ng-class="{\'menu-left\':!inst}"  ng-click="whenClick()"><md-icon md-font-icon="{{getinst()?\'icon-menu\':\'icon-arrow-up\'}}" ng-class="{\'icon-menu\':!inst,\'icon-menu\':inst}" ></md-icon></md-button>',
      scope: {
        inst: '='
      },
      link: function (scope, element, attrs, ctrl) {
        scope.getinst = function(){
          return scope.inst;
        }
        scope.whenClick = function () {
          scope.inst = !scope.inst;
          if (scope.inst)
          {
            $(element.parents('md-tab-content')[0]).animate({ scrollTop: 0 }, 'slow');

          }
        }
        //if($mdMedia('sm'))
          scope.inst = false;
        //scope.whenClick();
      }
    }
  }
})();
