/**
 * Created by shaoshun on 2017/3/12.
 */
/**
 * Created by lss on 2016/10/7.
 */
(function () {
  'use strict';
  angular
    .module('app.pcReport_sl')
    .directive('jtReport',jtReport);

  /** @ngInject */
  function jtReport() {
    return {
      scope: {
        fixTitle:"@",
        itemName:"@"
      },
      link: function (scope, element) {
        element.scroll(function (event) {
            var left= element.scrollLeft();
            var  top =element.scrollTop();
            var s=170;
            $('#'+scope.fixTitle).css( 'transform', 'translateX('+(s-left)+'px)');
            $("#"+scope.itemName).css('transform', 'translateY('+(-top)+'px)')
        })
      }
    }
  }

})();


