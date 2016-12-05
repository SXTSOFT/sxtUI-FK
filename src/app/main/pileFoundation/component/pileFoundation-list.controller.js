/**
 * Created by HuangQingFeng on 2016/11/22.
 */

(function (angular, undefined) {
  'use strict';
  angular
    .module('app.pileFoundation')
    .component('pileFoundationList', {
      templateUrl: 'app/main/pileFoundation/component/pileFoundation-list.html',
      controller: pileFoundationList,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function pileFoundationList($scope,api, utils, $stateParams, $state,$compile,tokenInjector) {
    var vm = this;
    vm.data = {};
    vm.lst_html = [];
    vm.RegionName = '';
    vm.RegionTreeId = '';
    vm.RegionTreeName = '';
    vm.zj = {};


    api.xhsc.Project.getMap().then(function (r) {
      vm.ProjectList = r.data||[];
    });

    $scope.$watch('vm.project',function () {
      if (vm.project==null) return;
      vm.StagesList = [];
        api.xhsc.Project.GetAreaChildenbyID(vm.project).then(function (r) {
        vm.StagesList = r.data||[];
        vm.lst_html = [];
      });
    });

    $scope.$watch('vm.Stages',function () {
      vm.lst_html = [];
      if(vm.Stages==null) return;
      vm.RegionTreeId = vm.project+'>'+vm.Stages;
      load(vm.RegionTreeId);
    });

    function load (regionTreeId) {
      vm.lst_html = [];
      api.pileFoundation.pileFoundation.getPileFoundationByRegionTreeId({regionTreeId:vm.RegionTreeId}).then(function (r) {
        if(r.data && r.data.length>0){
          vm.lst_html = r.data;
        }
      });
    }

    vm.addRegion = function () {
      if(vm.RegionName==''){
        utils.alert('区域名称不能为空！');
        return;
      }

      var model = {
        Id:sxt.uuid(),
        GeoJSON:'',
        RegionName:vm.RegionName,
        RegionTreeId:vm.RegionTreeId,
        RegionTreeName:vm.RegionTreeName,
        RegionType:128,
        Status:4,
        CrateTime:new Date().Format('yyyy-MM-dd hh:mm:ss')
      };
      vm.lst_html.push(model);
      vm.RegionName = '';
    }

    vm.makeRegionTreeName = function (arg1,arg2){
      if (arg1!=null && arg1!=''){
        vm.RegionTreeName = arg1;
      }
      if (arg2!=null && arg2!=''){
        vm.RegionTreeName = vm.RegionTreeName +'>'+ arg2;
      }
    }

    vm.save = function (data) {
      api.pileFoundation.pileFoundation.save(data).then(function (r) {
        utils.alert('提交成功！');
        load(vm.RegionTreeId);
      });
    }

    // vm.showImg = function (data) {
    //   vm.rid = data.Id;
    //   vm.tf.obj = data ? data : [];
    // }

  }
})(angular, undefined);
