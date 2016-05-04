/**
 * Created by jiuyuong on 2016/4/12.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('scController',scController)
  /** @ngInject */
  function scController($scope,remote,xhUtils,$stateParams,utils,$mdDialog,$state,$rootScope) {
    var vm = this;
    vm.info = {
      name: $stateParams.name,
      areaId:$stateParams.areaId,
      acceptanceItemID: $stateParams.acceptanceItemID,
      //regionId: $stateParams.regionId,
      //regionType: $stateParams.regionType,
      aItem:{
        MeasureItemName:$stateParams.pname,
        AcceptanceItemID:$stateParams.acceptanceItemID
      }
    };
    $rootScope.title = vm.info.aItem.MeasureItemName;
    vm.setRegionId = function(regionId,regionType){
      switch (regionType) {
        case '8':
          remote.Project.getFloorDrawing(regionId).then(function (r) {
            if(r.data.length) {
              vm.info.imageUrl = r.data[0].DrawingImageUrl;
              vm.info.regionId = regionId;
              vm.info.regionType = regionType;
            }
            else{
              utils.alert('未找到图纸');
            }
          });
          break;
        case '16':
          remote.Project.getHouseDrawing(regionId).then(function (r) {
            if(r.data.length) {
              vm.info.imageUrl = r.data[0].DrawingImageUrl;
              vm.info.regionId = regionId;
              vm.info.regionType = regionType;
            }
            else{
              utils.alert('未找到图纸');
            }
          });
          break;
      }
    }

    vm.nextRegion = function(prev){
      xhUtils.getRegion(vm.info.areaId,function(r){
        var find = r.find(vm.info.regionId);
        if(find){
          var next = prev?find.prev():find.next();
          if(next) {
            vm.info.name = next.FullName;
            //vm.info.regionId = next.RegionID;
            vm.setRegionId(next.RegionID,vm.info.regionType);
          }
          else{
            utils.alert('未找到'+(prev?'上':'下')+'一位置');
          }
        }
      });
    };
    //console.log('acceptanceItemID',vm.info.acceptanceItemID )
    remote.Measure.MeasureIndex.query (vm.info.acceptanceItemID).then (function (r) {
      var m=[];
      r.data.forEach(function(item){
        if(item.IndexName=='结构立面垂直度'|| item.IndexName=='结构表面平整度') {
          var fd = m.find(function (k) {
            return k.IndexName == '结构立面';
          });
          if (!fd) {
            fd = {
              AcceptanceIndexID: 'a',
              IndexName: '结构立面',
              cds: []
            }
            m.push(fd);
          }
          if(item.IndexName=='结构立面垂直度')
            item.IndexName='垂直度';
          if(item.IndexName=='结构表面平整度')
            item.IndexName='平整度';


          fd.cds.push(item);
        }
        else if(item.IndexName=='立面垂直度'|| item.IndexName=='表面平整度') {
          var fd = m.find(function (k) {
            return k.IndexName == '立面/表面';
          });
          if (!fd) {
            fd = {
              AcceptanceIndexID: 'a',
              IndexName: '立面/表面',
              cds: []
            }
            m.push(fd);
          }
          if (item.IndexName == '立面垂直度')
            item.IndexName = '立面';
          if (item.IndexName == '表面平整度')
            item.IndexName = '表面';
          fd.cds.push(item);
        }
        else if(item.IndexName=='阴阳角方正度度'|| item.IndexName=='阴阳角直线度度') {
          var fd = m.find(function (k) {
            return k.IndexName == '阴阳角';
          });
          if (!fd) {
            fd = {
              AcceptanceIndexID: 'a',
              IndexName: '阴阳角',
              cds: []
            }
            m.push(fd);
          }
          fd.cds.push(item);
        }
        else{
          m.push(item);
        }
      });
      vm.MeasureIndexes = m;
    });
    vm.submit = function(){
      if(vm.project){
        var items=[];
        for(var k in vm.project._featureGroups){
          var p = vm.project._featureGroups[k],
            o = p.layer.options;
          if(!items.find(function(t){return t.regionId== o.regionId})){
            items.push({
              regionId: o.regionId,
              regionName: o.regionName
            })
          }
        }
        $mdDialog.show({
            fullscreen:true,
            controller: function($scope,$mdDialog,items){
              items.forEach(function(item){
                item.checked = true;
              })
              $scope.items = items;
              $scope.answer = function() {
                var vs=[];
                items.forEach(function(item){
                  if(item.checked){
                    vs.push({
                      AcceptanceItemID:vm.info.acceptanceItemID,
                      CheckRegionID:item.regionId,
                      RegionType:vm.info.regionType
                    })
                  }
                });
                if(vs.length) {
                  remote.ProjectQuality.MeasurePoint.submit(vs).then(function(r){
                    $mdDialog.hide();
                  });
                }
                else{
                  $mdDialog.hide();
                }

              };
              $scope.cancel = function() {
                $mdDialog.cancel();
              };
            },
            locals:{
              items:items
            },
            template: '<md-dialog>\
            <md-toolbar>\
            <div class="md-toolbar-tools">\
          <h2>请选择提交项目</h2>\
          <span flex></span>\
          </div>\
          </md-toolbar>\
          <md-dialog-content style="min-width:320px;max-height:410px; ">\
          <md-list>\
          <md-list-item ng-repeat="topping in items">\
          <p> {{ topping.regionName }} </p>\
          <md-checkbox class="md-secondary" ng-model="topping.checked"></md-checkbox>\
          </md-list-item>\
          </md-list>\
          </md-dialog-content>\
            <md-dialog-actions layout="row">\
            <md-button ng-click="cancel()">取消</md-button>\
          <span flex></span>\
            <md-button ng-click="answer()" style="margin-right:20px;" >\
            提交\
          </md-button>\
          </md-dialog-actions>\
          </md-dialog>'
          })
          .then(function() {
            $state.go('app.xhsc.choose')
          }, function() {

          });
      }
    }
    vm.setRegionId($stateParams.regionId,$stateParams.regionType);
  }
})();
