/**
 * Created by 陆科桦 on 2016/10/14.
 */
(function(angular,undefined){
  'use strict';
  angular
    .module('app.material')
    .config(config);

  /** @ngInject */
  function config(apiProvider){
    var $http = apiProvider.$http,
      $q = apiProvider.$q;
    apiProvider.register('material', {
      type: {
        getList: function (param) {
          return $http.get($http.url('/api/MaterialClass', {Skip: param.Skip, Limit: param.Limit}));
        },
        getItem: function (id) {
          return $http.get($http.url('/api/MaterialClass/' + id));
        },
        create: function (id,param) {
          return $http.post('/api/MaterialClass/', id);
        },
        delete: function (id) {
          return $http.delete('/api/MaterialClass/' + id);
        },
        update: function (param) {
          return $http.put('/api/MaterialClass/' + param.Id, param);
        },
        getParent:function(){
          return $http.get($http.url('/api/MaterialClass/GetParentMaterialClass'));
        }
      },
      materialScience: {
        Create: function (args) {
          return $http.post('/api/MaterialScience', args)
        },
        getList:function(args){
          return $http.get($http.url('/api/MaterialScience',{Skip:args.Skip,Limit:args.Limit}))
        },
        getMaterial:function(id){
          return $http.get($http.url('/api/MaterialScience/'+id));
        },
        putMaterial:function(data){
          return $http.put('/api/MaterialScience/' + data.Id,data);
        },
        delete:function(id){
          return $http.delete('/api/MaterialScience/'+id);
        },
        getMaterialList:function () {
          return $http.get($http.url('/api/MaterialScience/GetMaterialListAsync'))
        },
        GetMaterialByTypeId:function (typeId) {
          return $http.get($http.url('/api/MaterialScience/GetMaterialByTypeId/' + typeId))
        },
        GetMaterialTreeList:function (cid) {
          return $http.get($http.url('/api/MaterialScience/GetMaterialTreeListAsync/'+cid))
        },
        GetMaterialListByTypeId:function (cid) {
          return $http.get($http.url('/api/MaterialScience/GetMaterialListByTypeId/'+cid))
        },
        batchCreate:function (data) {
          return $http.put('/api/MaterialScience/BatchCreateMaterial',data);
        }
      },
      materialPlan:{
        Create:function (args) {
          return $http.post('/api/MaterialPlan', args)
        },
        getList:function(args){
          return $http.get($http.url('/api/MaterialPlan',{RegionId:args.RegionId,SectionId:args.SectionId,Skip:args.Skip,Limit:args.Limit}))
        },
        getMaterial:function(id){
          return $http.get($http.url('/api/MaterialPlan/'+id));
        },
        putMaterial:function(data){
          return $http.put('/api/MaterialPlan/'+data.Id,data);
        },
        delete:function(id){
          return $http.delete('/api/MaterialPlan/'+id);
        },
        GetProjectSection:function (args) {
          return $http.get($http.url('/api/ProjectInfoApi/GetProjectSection',{areaId:args}));
        },
        getUserProjectSectionForPc:function(){
          return $http.get($http.url('/api/ProjectInfoApi/GetUserSectionForPc'))
        },
        getMaterialReport:function(sid,param){
          return $http.get($http.url('/api/MaterialPlan/GetMaterialReportBySectionId/' + sid, {Skip: param.Skip, Limit: param.Limit}))
        }
      },
      contract:{
        getSysOrgOU:function () {
          return $http.get($http.url('/api/ProjectInfoApi/GetOrgOU'));
        },
        create: function (args) {
          return $http.post('/api/MaterialContract', args)
        },
        update:function(data){
          return $http.put('/api/MaterialContract/'+data.Id,data);
        },
        getList: function (param) {
          return $http.get($http.url('/api/MaterialContract', {Skip: param.Skip, Limit: param.Limit}));
        },
        getById:function(id){
          return $http.get($http.url('/api/MaterialContract/'+id));
        },
        GetContractDetailById:function (cid,mid) {
          return $http.get($http.url('/api/MaterialContract/GetContractDetailById/'+cid+'/'+mid));
        },
        UpdateContract:function (data) {
          return $http.put('/api/MaterialContract/UpdateContract',data);
        },
      }
    })
  }
})(angular,undefined);

