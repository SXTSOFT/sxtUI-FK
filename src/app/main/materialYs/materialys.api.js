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
        PostCheckInfo: $http.db({
          _id: 'materialPlan',
          idField: 'Id',
          upload:true
        }).bind(function (data) {
          return $http.put('/api/MaterialPlan/InsertCheckInfo', data);
        }),
        PostReportInfo: $http.db({
          _id: 'materialPlan',
          idField: 'Id',
          upload:true
        }).bind(function (data) {
          return $http.put('/api/MaterialPlan/InsertReportInfo', data);
        })
      }
    });
  }

})(angular,undefined);
