(function ()
{
    'use strict';

    angular
        .module('sxt')
        .config(config);

    /** @ngInject */
    function config($mdDateLocaleProvider)
    {
      $mdDateLocaleProvider.shortDays = ['日', '一', '二', '三', '四', '五', '六'];
      $mdDateLocaleProvider.shortMonths = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    }

})();
