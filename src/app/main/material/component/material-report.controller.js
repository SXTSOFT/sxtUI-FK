/**
 * Created by lukehua on 2017/1/4.
 */

(function(angular,undefined){
    'use strict';
    angular
    .module('app.material')
    .component('materialReport',{
      templateUrl:'app/main/material/component/material-report.html',
      controller:materialReport,
      controllerAs:'vm'
    });

    /** @ngInject */
    function materialReport($scope,api,sxt){
        var vm = this;
        vm.host = sxt.app.api;
        vm.projects = [];
       
        var mobileDetect = new MobileDetect(window.navigator.userAgent);
        vm.isMobile = mobileDetect.mobile();

        vm.getProjects = function(){
            if(vm.projects.length == 0){
                return api.xhsc.Project.getMap().then(function (r) {
                    vm.projects = r.data;
                });
            }
        };

        vm.clearRegion = function(){
            vm.regions=[];
            vm.sections = [];
            vm.regionId = null;
            vm.sectionId = null;
        }

        vm.getAreas = function (pId) {
            return api.xhsc.Project.GetAreaChildenbyID(pId).then(function (r) {
                vm.regions = r.data;
            });
        };

        vm.clearSection = function(){
            vm.sections = [];
            vm.sectionId = null;
        }

        vm.getSections = function (aId) {
            return api.material.materialPlan.GetProjectSection(aId).then(function (e) {
                vm.sections = e.data;
            });
        };

        vm.getData = function(sid){
            return api.material.materialPlan.getMaterialReport(sid).then(function(r){
                vm.source = r.data;
            });
        }

        vm.printBatchCount = function(){
            $('#export').val($("#divReport").html());
        }
    };
})(angular,undefined);