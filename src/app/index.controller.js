(function ()
{
    'use strict';

    angular
        .module('sxt')
        .controller('IndexController', IndexController);

    /** @ngInject */
    function IndexController(fuseTheming,api)
    {
        api.szgc.vanke.profile().then(function () {

        });
        var vm = this;

        // Data
        vm.themes = fuseTheming.themes;

        //////////
    }
})();
