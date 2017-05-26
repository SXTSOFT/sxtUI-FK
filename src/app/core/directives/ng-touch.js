/**
 * Created by shaoshunliu on 2017/5/26.
 */
/**
 * Created by jiuyuong on 2016/5/9.
 */
(function () {
  'use strict';
  angular
    .module('app.core')
    .directive('myTouchstart', [function() {
      return function(scope, element, attr) {

        element.on('touchstart', function(event) {
          scope.$apply(function() {
            scope.$eval(attr.myTouchstart);
          });
        });
      };
    }]).directive('myTouchend', [function() {
      return function(scope, element, attr) {

        element.on('touchend', function(event) {
          scope.$apply(function() {
            scope.$eval(attr.myTouchend);
          });
        });
      };
  }]);
})();
