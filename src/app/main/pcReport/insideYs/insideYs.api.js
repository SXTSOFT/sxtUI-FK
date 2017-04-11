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
        getList: function (param) {
          return $http.get($http.url('/api/v1/enterpirse/report/problemdetails', {rectifyOu: param.rectifyOu, status: param.status}));
        }
      }
    })
  }
})(angular,undefined);