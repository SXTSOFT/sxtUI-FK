(function ()
{
    'use strict';

    angular
        .module('app.sample')
        .controller('SampleController', SampleController);

    /** @ngInject */
    function SampleController(SampleData)
    {
        var vm = this;
 console.log('SampleController')
        // Data
        vm.helloText = SampleData.data.helloText;

        // Methods

        //////////
    }
})();
