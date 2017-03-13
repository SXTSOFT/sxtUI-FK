/**
 * Created by lukehua on 17/3/13.
 */
(function () {
    'use strict';

    angular
        .module('app.szgc')
        .controller('materialReportController', materialReportController);

    /** @ngInject */
    function materialReportController($scope, $filter, api, utils, $q) {
        var vm = this;
        vm.loading = false;
    }
})();