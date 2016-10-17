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
    apiProvider.register('material',{
      materialScience:{
        Create:function (args) {
          return $http.post('/api/MaterialScience', args)
        },
        getList:function(args){
          return $http.get($http.url('/api/MaterialScience',{Skip:args.Skip,Limit:args.Limit}))
        },
        getMaterial:function(id){
          return $http.get($http.url('/api/MaterialScience/'+id));
        },
        putMaterial:function(data){
          return $http.put('/api/MaterialScience/'+data.Id,data);
        },
        delete:function(id){
          return $http.delete('/api/MaterialScience/'+id);
        }
      }
    })
  }
})(angular,undefined);

