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
    apiProvider.register('plan',{

    })
  }
})(angular,undefined);

