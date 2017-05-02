(function(angular,undefined){
  'use strict';
  angular
    .module('app.insideYs')
    .config(config);

  /** @ngInject */
  function config(apiProvider){
    var $http = apiProvider.$http,
      $q = apiProvider.$q;
    apiProvider.register('insideYs', {
      batch: {
        getList: function (param,id) {
          return $http.get($http.url('/api/v1/enterpirse/report/problemdetails/'+id, param));
        },
        getListExcel:function(id){
        return $http.url('/api/v1/enterpirse/report/problemdetails/'+id+'/excel?Skip=0&Limit=9999');
        }
      }
    })
  }
})(angular,undefined);
