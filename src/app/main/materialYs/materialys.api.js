/**
 * Created by 陆科桦 on 2016/10/23.
 */

(function () {
  'use strict';

  angular
    .module('app.xhsc')
    .config(config);

  /** @ngInject */
  function config(apiProvider) {
    var $http = apiProvider.$http,
      $q = apiProvider.$q;
    apiProvider.register('xhsc',{
      materialPlan:{
        getMaterialPlanBatch: $http.db({
          _id: 'materialPlan',
          idField: 'Id',
          dataType: 1
        }).bind(function (sectionId,status) {
          return $http.get($http.url('/api/MaterialPlan/GetMaterialPlansBatchBySectionId',{sectionId:sectionId,status:status}));
        }),
        getMaterialPlanDetail:$http.db({
          _id:'materialPlan',
          idField:'Id',
          dataType:3
        }).bind(function (mpid) {
          return $http.get($http.url('/api/MaterialPlan/GetMaterialPlanAsync?mpid='+mpid));
        }),

        getMaterialPlanBatchById:function (id) {
          return $http.get($http.url('/api/MaterialPlan/GetMaterialPlanBatchById?id='+id));
        },

        PostCheckInfo: $http.db({
          _id: 'materialPlanCheckInfo',
          idField: 'Id',
          upload:true
        }).bind(function (data) {
          return $http.put('/api/MaterialPlan/InsertCheckInfo', data);
        }),
        PostReportInfo: $http.db({
          _id: 'materialPlanReportInfo',
          idField: 'Id',
          upload:true
        }).bind(function (data) {
          return $http.put('/api/MaterialPlan/InsertReportInfo', data);
        }),
        PostApprovalInfo: $http.db({
          _id: 'materialPlanApprovalInfo',
          idField: 'Id',
          upload:true
        }).bind(function (data) {
          return $http.put('/api/MaterialPlan/InsertApproval', data);
        }),
        PostExitInfo: $http.db({
          _id: 'materialPlan',
          idField: 'Id',
          upload:true
        }).bind(function (data) {
          return $http.post('/api/MaterialPlan/InsertExitInfo', data);
        }),
        CreateMaterialPlanBatch:$http.db({
          _id:'materialPlanBatch',
          idField:'Id',
          dataType:3
        }).bind(function (data) {
          return $http.post('/api/MaterialPlan/CreateMaterialPlanBatchAsync',data);
        }),
        MaterialInspection:$http.db({
          _id:'materialPlanBatch',
          idField:'Id',
          dataType:3
        }).bind(function (data) {
          return $http.put('/api/MaterialPlan/MaterialInspection',data);
        }),
        materialUnqualifiedExit:$http.db({
          _id:'materialPlanBatch',
          idField:'Id',
          dataType:3
        }).bind(function (data) {
          return $http.put('/api/MaterialPlan/UnMaterialExit',data);
        })
      }
    });
  }

})(angular,undefined);
