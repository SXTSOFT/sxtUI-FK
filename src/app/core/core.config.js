(function ()
{
    'use strict';

    angular
        .module('app.core')
        .config(config);

    /** @ngInject */
    function config($ariaProvider, $logProvider, msScrollConfigProvider, $provide, fuseConfigProvider, $httpProvider,$mdAriaProvider)
    {
      $mdAriaProvider.disableWarnings();
      $httpProvider.interceptors.push('authToken');

      // ng-aria configuration
      $ariaProvider.config({
          tabindex: false
      });

      // Enable debug logging
      $logProvider.debugEnabled(true);

      // msScroll configuration
      msScrollConfigProvider.config({
          wheelPropagation: true
      });

      // toastr configuration
      toastr.options.timeOut = 3000;
      toastr.options.positionClass = 'toast-top-right';
      toastr.options.preventDuplicates = true;
      toastr.options.progressBar = true;



        // Fuse theme configurations
        fuseConfigProvider.config({
            'disableCustomScrollbars'        : false,
            'disableCustomScrollbarsOnMobile': true,
            'disableMdInkRippleOnMobile'     : false
        });
    }
})();
