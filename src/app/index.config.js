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
      $mdDateLocaleProvider.parseDate = function(dateString) {
        var m = moment(dateString, 'YYYY-MM-DD', true);
        return m.isValid() ? m.toDate() : new Date(NaN);
      };
      $mdDateLocaleProvider.formatDate = function(date) {
        var m = moment(date);
        return m.isValid() ? m.format('YYYY-MM-DD') : '';
      };
      $mdDateLocaleProvider.monthHeaderFormatter = function(date) {
        return date.getFullYear()+ '年' + $mdDateLocaleProvider.shortMonths[date.getMonth()] ;
      };

    }
})();
