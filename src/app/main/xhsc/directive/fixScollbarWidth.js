/**
 * Created by jiuyuong on 2016/6/1.
 */
(function () {
  'use strict';
  angular
    .module('app.xhsc')
    .directive('fixScollbarWidth',fixScollbarWidth)
  /** @ngInject */
  function fixScollbarWidth() {
    return {
      scope:{
        parent:'@fixScollbarWidth',
        link:function (scope,element) {
          
        }
      }
    }
  }
})();
