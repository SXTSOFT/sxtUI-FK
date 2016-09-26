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
      /** /api/TaskLibrary 任务 **/
      TaskLibrary:{
        GetList:function(param){
          return $http.get($http.url('/api/TaskLibrarys',{Skip:param.Skip,Limit:param.Limit}));
        }
      }
    });
  }
})(angular,undefined);
