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
        }
      },
      TaskFlow:{

      },
      /** /api/TaskLibrary 任务 **/
      TaskLibrary:{
        update:function (taskLibrary) {
          return $http.post('/api/TaskLibrarys/'+taskLibrary.id,taskLibrary);
        },
        GetList:function(param){
          return $http.get($http.url('/api/TaskLibrarys',{Skip:param.Skip,Limit:param.Limit}));
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
