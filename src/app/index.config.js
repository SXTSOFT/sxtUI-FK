(function ()
{
    'use strict';

    angular
        .module('sxt')
        .config(config);

    /** @ngInject */
    function config(appAuthProvider)
    {
      appAuthProvider.interceptors.push('vankeAuth');
    }

})();
