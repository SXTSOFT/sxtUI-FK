/**
 * Created by zhangzhaoyong on 16/2/2.
 */
(function () {
  'use strict';

  angular
    .module('app.szgc')
    .directive('hMaps', hMapsDirective);

  /** @ngInject */
  function hMapsDirective($timeout){

    return {
      scope:{

      },
      link:function(scope,element) {

      }
    }
  }

})();
