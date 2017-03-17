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
        vm.data = [];
        $q.all([api.szgc.vanke.projects({ page_size: 1000, page_number: 1 }),
        api.material.MaterialService.MaterialCount()
        ]).then(function(r){
            r[0].data.data.forEach(function(p){
                var c = r[1].data.Rows.find(function(count){return count.ProjectId == p.project_id});
                if(c){
                    p.TJ = c.TJ;
                    p.JD = c.JD;
                    p.ZX = c.ZX;
                }else{
                    p.TJ = 0;
                    p.JD = 0;
                    p.ZX = 0;
                }
                vm.data.push(p);
            })
        })
        
        vm.loading = false;
    }
})();