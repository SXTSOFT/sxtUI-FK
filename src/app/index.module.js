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

            // Quick panel
            //'app.quick-panel',

            // Sample
            'app.sample',

            // auth
            'app.auth',

            'app.szgc',
          'panzoom',
          'hmTouchEvents',
          'ui.tree',
          'ngCordova'
        ]);
})();
