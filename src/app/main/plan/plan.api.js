/**
 * Created by jiuyuong on 2016/9/26.
 */
(function (angular, undefined) {
  'use strict';

  angular
    .module('app.plan')
    .config(config);

  /** @ngInject */
  function config(apiProvider) {
    var $http = apiProvider.$http,
      $q = apiProvider.$q;
    apiProvider.register('plan',{
      GetPage:function(param) {
        return {Skip:(param.page - 1) * param.pageSize,Limit:param.pageSize};
      },

      /** /api/TaskTemplates 模板 **/
      TaskTemplates:{
        GetList:function(param){
          return $http.get($http.url('/api/TaskTemplates',{Skip:param.Skip,Limit:param.Limit}));
        },
        Create:function (param) {
          return $http.post('/api/TaskTemplates', param)
        },
        getItem:function(id){
          return $http.get($http.url('/api/TaskTemplates/'+id));
        },
        update:function(param){
          return $http.put('/api/TaskTemplates/'+param.Id,param);
        },
        delete:function(id){
          return $http.delete('/api/TaskTemplates/'+id);
        }
      },
      TaskFlow:{
        post:function(input){
          return $http.post($http.url('/api/TaskLibrarys/'+input.TaskFlowId+'/TaskFlows',input))
        },
        getTaskFlow:function(){

        }
      },
      /** /api/TaskLibrary 任务 **/
      TaskLibrary:{
        update:function (taskLibrary) {
          var item= angular.extend(taskLibrary,{Id:taskLibrary.TaskLibraryId});

          return $http.put('/api/TaskLibrarys/'+taskLibrary.TaskLibraryId,item);
        },
        Create:function(param){
          return $http.post('/api/TaskLibrarys', param)
        },
        GetList:function(param){
          return $http.get($http.url('/api/TaskLibrarys',{Skip:param.Skip,Limit:param.Limit}));
        },
        getItem:function(id){
          return $http.get($http.url('/api/TaskLibrarys/'+id));
        },
        getTaskFlow:function (taskId) {
          return $http.get($http.url('/api/TaskLibrarys/'+taskId+'/Tree'));
        }
      },
      compensate:{
        createBc:function (values) {
          return $http.post('/api/Compensates', values)
        },
        getList:function(param){
          return $http.get($http.url('/api/Compensates',{Skip:param.Skip,Limit:param.Limit}));
        },
        getCompensate:function(id){
          return $http.get($http.url('/api/Compensates/'+id));
        },
        putCompensate:function(data){
          return $http.put('/api/Compensates/'+data.Id,data);
        },
        delete:function(id){
          return $http.delete('/api/Compensates/'+id);
        }
      }
    });
  }
})(angular,undefined);
