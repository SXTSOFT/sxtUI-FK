/**
 * Created by HuangQingFeng on 2016/11/22.
 */
(function(angular,undefined){
  'use strict';
  angular
    .module('app.earthwork')
    .config(config);

  /** @ngInject */
  function config(apiProvider){
    var $http = apiProvider.$http,
      $q = apiProvider.$q;
    apiProvider.register('earthwork', {
      earthwork: {
        create: function (data) {
          return $http.post('/api/Eartwork/', data);
        }
      }
    })
  }
})(angular,undefined);
