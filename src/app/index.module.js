(function ()
{
    'use strict';

    /**
     * Main module of the Fuse
     */
    angular
        .module('sxt', [

            // Core
            'app.core',

            // Navigation
            'app.navigation',

            // Toolbar
            'app.toolbar',

            // auth
            'app.auth',

            'app.xhsc'
        ]);
})();
