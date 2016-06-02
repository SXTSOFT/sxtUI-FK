/**
 * Created by jiuyuong on 2016/6/1.
 */
(function () {
  'use strict';
  angular
    .module('app.xhsc')
    .directive('fixScrollbarWidth',fixScrollbarWidth)
  /** @ngInject */
  function fixScrollbarWidth() {

    return {
      scope:{
        parent:'@fixScrollbarWidth'
      },
      link:function (scope,element) {
        var p =$(scope.parent, element.parents('md-tab-content')[0])[0];
        scope.$watch(function () {
          return p.offsetWidth - p.clientWidth;
        },function () {
          resetWidth(p,element);
        })

      }
    }

    function resetWidth(p,el) {
        var w = p.offsetWidth - p.clientWidth;
        el.width(w);
    }
  }
})();
