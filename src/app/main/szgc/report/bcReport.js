
/**
 * Created by shaoshun on 2017/3/12.
 */
/**
 * Created by lss on 2016/10/7.
 */
(function () {
  'use strict';
  angular
    .module('app.szgc')
    .directive('bcReport',bcReport);

  /** @ngInject */
  function bcReport() {
    return {
      scope: {
        fiexTitle:"@",
        itemNames:"@"
      },
      link: function (scope, element) {
        element.scroll(function (event) {
            var left= element.scrollLeft();
            var  top =element.scrollTop();
            var s=170;
            $('#'+scope.fiexTitle).css( 'transform', 'translateX('+(-left)+'px)');
            $("#"+scope.itemNames).css('transform', 'translateY('+(-top)+'px)')
        })
      }
    }
  }

})();