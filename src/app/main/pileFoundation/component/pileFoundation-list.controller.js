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
    vm.tf = {};
    vm.tf.files = ['test.png'];
    vm.tf.obj = {
      CreateDate: null,
      GeoJSON: null,
      Id: null,
      RegionName: null,
      RegionTreeId: null,
      RegionTreeName: null,
      RegionType: 0,
      Status: 0,
      UserId: null
    };
    vm.tf.data = [
      {
        Id: null,
        RegionType: 0,
        RegionName: null,
        RegionTreeId: null,
        RegionTreeName: null,
        GeoJSON: null,
        Status: 0,
        CreateDate: null,
        UserId: null
      }
    ];

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

    vm.drawRegion = function (data) {
      vm.tf.obj = data ? data : [];
      console.log(data)
      // vm.tf.obj = {
      //   CreateDate: "2016-11-21",
      //   GeoJSON: null,
      //   Id: "958b24a76bd2479ebe71bcff590833da",
      //   RegionName: "园建",
      //   RegionTreeId: "00042>0004200000",
      //   RegionTreeName: "金鹏测试项目>一期",
      //   RegionType: 128,
      //   Status: 4,
      //   UserId: null
      // };
      // vm.tf.data = [
      //   {
      //     Id: "0-f0dfa64566da446c9f30b41d55e3f34d",
      //     RegionType: 128,
      //     RegionName: "1区域",
      //     RegionTreeId: "00042>0004200000>958b24a76bd2479ebe71bcff590833da",
      //     RegionTreeName: "金鹏测试项目>一期>园建",
      //     GeoJSON: "{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"Polygon\",\"coordinates\":[[[0.0703125,0.17578125],[0.32421875,0.169921875],[0.181640625,0.40234375],[0.0703125,0.17578125]]]},\"options\":{\"stroke\":true,\"color\":\"#ff0000\",\"dashArray\":null,\"lineCap\":null,\"lineJoin\":null,\"weight\":4,\"opacity\":0.5,\"fill\":true,\"fillColor\":null,\"fillOpacity\":0.2,\"clickable\":true,\"smoothFactor\":1,\"noClip\":false,\"text\":\"1区域\",\"type\":null}}",
      //     Status: 0,
      //     CreateDate: "2016-11-23",
      //     UserId: null
      //   },
      //   {
      //     Id: "0-7932d634c5a04dc4b2fddd820fb05301",
      //     RegionType: 128,
      //     RegionName: "2区域",
      //     RegionTreeId: "00042>0004200000>958b24a76bd2479ebe71bcff590833da",
      //     RegionTreeName: "金鹏测试项目>一期>园建",
      //     GeoJSON: "{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"Polygon\",\"coordinates\":[[[0.740234375,0.083984375],[0.802734375,0.080078125],[0.904296875,0.5625],[0.8515625,0.568359375],[0.740234375,0.083984375]]]},\"options\":{\"stroke\":true,\"color\":\"#ff0000\",\"dashArray\":null,\"lineCap\":null,\"lineJoin\":null,\"weight\":4,\"opacity\":0.5,\"fill\":true,\"fillColor\":null,\"fillOpacity\":0.2,\"clickable\":true,\"smoothFactor\":1,\"noClip\":false,\"text\":\"2区域\",\"type\":null}}",
      //     Status: 0,
      //     CreateDate: "2016-11-23",
      //     UserId: null
      //   },
      //   {
      //     Id: "0-ac329fda39a841529695d59605cb917e",
      //     RegionType: 128,
      //     RegionName: "2",
      //     RegionTreeId: "00042>0004200000>958b24a76bd2479ebe71bcff590833da",
      //     RegionTreeName: "金鹏测试项目>一期>园建",
      //     GeoJSON: "{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"Polygon\",\"coordinates\":[[[0.27734375,0.36328125],[0.345703125,0.671875],[0.69921875,0.525390625],[0.58984375,0.248046875],[0.29296875,0.36328125],[0.27734375,0.36328125]]]},\"options\":{\"stroke\":true,\"color\":\"#ff0000\",\"dashArray\":null,\"lineCap\":null,\"lineJoin\":null,\"weight\":4,\"opacity\":0.5,\"fill\":true,\"fillColor\":null,\"fillOpacity\":0.2,\"clickable\":true,\"smoothFactor\":1,\"noClip\":false,\"text\":\"2\",\"type\":null}}",
      //     Status: 0,
      //     CreateDate: "2016-11-23",
      //     UserId: null
      //   },
      //   {
      //     Id: "0-5c1315f9b2b644b58e2b011a3ff7dfec",
      //     RegionType: 128,
      //     RegionName: "ppp",
      //     RegionTreeId: "00042>0004200000>958b24a76bd2479ebe71bcff590833da",
      //     RegionTreeName: "金鹏测试项目>一期>园建",
      //     GeoJSON: "{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"Polygon\",\"coordinates\":[[[0.1796875,0.095703125],[0.46484375,0.138671875],[0.43359375,0.068359375],[0.189453125,0.09375],[0.1796875,0.095703125]]]},\"options\":{\"stroke\":true,\"color\":\"#ff0000\",\"dashArray\":null,\"lineCap\":null,\"lineJoin\":null,\"weight\":4,\"opacity\":0.5,\"fill\":true,\"fillColor\":null,\"fillOpacity\":0.2,\"clickable\":true,\"smoothFactor\":1,\"noClip\":false,\"text\":\"ppp\",\"type\":null}}",
      //     Status: 0,
      //     CreateDate: "2016-11-23",
      //     UserId: null
      //   },
      //   {
      //     Id: "0-894ae56a708c4beaa52bcb73ef3edc27",
      //     RegionType: 128,
      //     RegionName: "sss",
      //     RegionTreeId: "00042>0004200000>958b24a76bd2479ebe71bcff590833da",
      //     RegionTreeName: "金鹏测试项目>一期>园建",
      //     GeoJSON: "{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"Circle\",\"coordinates\":[1.142578125,0.171875]},\"options\":{\"stroke\":true,\"color\":\"#ff0000\",\"dashArray\":null,\"lineCap\":null,\"lineJoin\":null,\"weight\":2,\"opacity\":0.5,\"fill\":true,\"fillColor\":null,\"fillOpacity\":0.2,\"clickable\":true,\"text\":\"sss\",\"type\":null,\"radius\":12461.414843635388}}",
      //     Status: 0,
      //     CreateDate: "2016-11-23",
      //     UserId: null
      //   },
      //   {
      //     Id: "0-c7ad3d2e047a4ef9846054c25a3eef7a",
      //     RegionType: 128,
      //     RegionName: "kkk",
      //     RegionTreeId: "00042>0004200000>958b24a76bd2479ebe71bcff590833da",
      //     RegionTreeName: "金鹏测试项目>一期>园建",
      //     GeoJSON: "{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"Polygon\",\"coordinates\":[[[0.30078125,0.78125],[0.625,0.666015625],[0.671875,0.845703125],[0.296875,0.7890625],[0.30078125,0.78125]]]},\"options\":{\"stroke\":true,\"color\":\"#9e9e9e\",\"dashArray\":null,\"lineCap\":null,\"lineJoin\":null,\"weight\":5,\"opacity\":0.5,\"fill\":true,\"fillColor\":null,\"fillOpacity\":0.2,\"clickable\":true,\"smoothFactor\":1,\"noClip\":false,\"text\":\"kkk\",\"type\":null}}",
      //     Status: 0,
      //     CreateDate: "2016-11-23",
      //     UserId: null
      //   }
      // ];
    }

  }
})(angular, undefined);
