/**
 * Created by jiuyuong on 2016/8/30.
 */
(function () {
  'use strict';
  angular
    .module('app.szgc')
    .directive('setHeight',setHeight);
  /** @ngInject */
  function setHeight($timeout) {
    return {
      link:function (scope,element) {
        $timeout(function () {
          var height = element.parent().height();
          element.css("min-height",height+10);
        });
      }
    }
  }
})();
