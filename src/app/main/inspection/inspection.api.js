/**
 * Created by emma on 2016/11/15.
 */
(function(){
  'use strict';

  angular
    .module('app.inspection')
    .config(config);

  /** @anInject */
  function config(apiProvider) {
    var $http = apiProvider.$http,
      $q = apiProvider.$q;

    apiProvider.register('inspection',{
      deliverys:{
        uri:'/estate/v1/deliverys',
        getLists:function(){
          return $http.get($http.url(this.uri));
        }
      }
    })
  }
})();
