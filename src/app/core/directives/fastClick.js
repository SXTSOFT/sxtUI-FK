/**
 * Created by jiuyuong on 2016/5/9.
 */
(function () {
  'use strict';
  angular
    .module('app.core')
    .directive('fastClick',fastClick);

  /** @ngInject */
  function fastClick() {
    var fn = function(scope,attr) {
      scope.$apply(function() {
        scope.$eval(attr.fastClick);
      });
    };
    return {
      link:link
    };
    function link(scope,element,attr) {
      element.on('touchstart', function(event) {
        scope._usingTouch = true;
        fn(scope,attr);
      });

      element.on('click',function (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
      })
      element.on('mousedown', function(event) {
        if(!scope._usingTouch)
          fn(scope,attr);
      });
    }

  }
})();
