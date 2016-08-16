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

            'app.navigation',

          // Navigation
          // Toolbar
          'app.toolbar',

            // Quick panel
            //'app.quick-panel',

            // Sample
            'app.sample',

            // auth
            'app.auth',

            'app.szgc',
          'app.material',
          'panzoom',
          'hmTouchEvents',
          'ui.tree',
          'ngCordova'
        ]);
})();
