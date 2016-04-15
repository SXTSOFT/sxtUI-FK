/**
 * Created by jiuyuong on 2016/4/12.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('scController',scController)
  /** @ngInject */
  function scController($scope,remote,xhUtils,$stateParams,utils,$mdDialog,$state) {
    var vm = this;
    vm.info = {
      name: $stateParams.name,
      areaId:$stateParams.areaId,
      acceptanceItemID: $stateParams.acceptanceItemID,
      regionId: $stateParams.regionId,
      regionType: $stateParams.regionType,
      aItem:{
        MeasureItemName:$stateParams.pname,
        AcceptanceItemID:$stateParams.acceptanceItemID
      }
    };
    vm.nextRegion = function(prev){
      xhUtils.getRegion(vm.info.areaId,function(r){
        var find = r.find(vm.info.regionId);
        if(find){
          var next = prev?find.prev():find.next();
          if(next) {
            vm.info.name = next.FullName;
            vm.info.regionId = next.RegionID;
          }
          else{
            utils.alert('未找到'+(prev?'上':'下')+'一位置');
          }
        }
      });
    };
    //console.log('acceptanceItemID',vm.info.acceptanceItemID )
    remote.Measure.MeasureIndex.query (vm.info.acceptanceItemID).then (function (r) {
      vm.MeasureIndexes = r.data;
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
              $scope.items = items;
              $scope.answer = function() {
                $mdDialog.hide();
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
          <h2>提交测量</h2>\
          <span flex></span>\
          </div>\
          </md-toolbar>\
          <md-dialog-content style="max-width:300px;max-height:410px; ">\
          <md-list>\
          <md-list-item ng-repeat="topping in items">\
          <p> {{ topping.regionName }} </p>\
          <md-checkbox class="md-secondary" ng-model="topping.regionId"></md-checkbox>\
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
  }
})();
