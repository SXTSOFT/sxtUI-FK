(function ()
{
    'use strict';

    angular
        .module('sxt')
        .config(config);

    /** @ngInject */
    function config(authProvider)
    {
      authProvider.interceptors.push('vankeAuth');
    }

})();
