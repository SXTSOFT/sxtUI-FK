(function ()
{
    'use strict';

    /**
     * Main module of the Fuse
     */
    angular
        .module('sxt', [
            'app.core',
            'app.navigation',
            'app.toolbar',
            'app.auth',
            'app.pcReport',
            'app.xhsc',
            'app.plan'
        ]);
})();
