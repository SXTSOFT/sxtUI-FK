/**
 * Created by lss on 2016/6/2.
 */
/**
 * Created by jiuyuong on 2016/6/1.
 */
(function () {
  'use strict';
  angular
    .module('app.xhsc')
    .directive('fitTableHeight',fitTableHeight)
  /** @ngInject */
  function fitTableHeight($timeout) {
    return {
      link:function (scope,element) {
        $timeout(function(){
          var p =element.parent()[0];
          element.css("min-height",p.offsetHeight);
        });
        //scope.$watch(function () {
        //  return p.offsetHeight;
        //},function () {
        //  element.height(p.offsetHeight);
        //})
      }
    }
  }
})();
