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
        post:function(param){
          return $http.post($http.url('/api/TaskLibrarys/'+param.TaskLibraryId+'/TaskFlows'),param)
        },
        getTaskFlow:function(param){
          return $http.get($http.url('/api/TaskLibrarys/',{Type:param.type,Level:param.level,Skip:param.Skip,Limit:param.Limit}))
        },
        postTaskFlow:function(param){
          return $http.post('/api/TaskLibrarys', param)
        },
        getFlowById:function(taskFlowId){
          return $http.get($http.url('/api/TaskLibrarys/'+taskFlowId))
        },
        updateFlowById:function(taskFlowId){
          return $http.put($http.url('/api/TaskLibrarys/'+taskFlowId))
        },
        getFlowTree:function(taskFlowId){
          return $http.get($http.url('/api/TaskLibrarys/'+taskFlowId+'/Tree'))
        },
        deleteFlow:function (id) {
          return $http.delete('/api/TaskFlows/'+id)
        },
        resetTaskFlowRoles:function(id,data){
          return $http.post($http.url('/api/TaskFlows/'+id+'/TaskFlowRoles/Reset'),data)
        },
        getRoleByFlowId:function(id){
          return $http.get($http.url('/api/TaskFlows/'+id+'/TaskFlowRoles'))
        },
        resetTaskFlow:function(id,data){
          return $http.post($http.url('/api/TaskFlows/'+id+'/TaskLibrarys/Reset'),data)
        }
      },
      /** /api/TaskLibrary 任务 **/
      TaskLibrary:{
        create:function (taskLibrary) {
          return $http.post('/api/TaskLibrarys',taskLibrary);
        },
        update:function (taskLibrary) {
          var item= angular.extend(taskLibrary,{Id:taskLibrary.TaskLibraryId});

          return $http.put('/api/TaskLibrarys/'+taskLibrary.TaskLibraryId,item);
        },
        deleteFlowById:function(id){
          return $http.delete($http.url('/api/TaskLibrarys/'+id))
        },
        GetList:function(param){
          return $http.get($http.url('/api/TaskLibrarys',param));
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
      },
      UserGroup:{
        create:function (data) {
          return $http.post('/api/UserGroup',data);
        },
        query:function (param) {
          return $http.get($http.url('/api/UserGroup',param))
        },
        //reset:function(param){
        //  return $http.post($http.url('/api/TaskFlowRoles/Reset'),param)
        //}
      },
      TaskFlowRole:{
        queryByFlowId:function (flowId) {
          return $http.get('/api/TaskFlowRoles/'+flowId);
        }
      }
    });
  }
})(angular,undefined);
