(function ()
{
  'use strict';

  angular
    .module('app.core')
    .provider('api', apiProvider)

  /** @ngInject */
  function apiProvider() {

    var api = {};
    this.register = register;
    this.$http = {
      get:cfg('get'),
      post:cfg('post'),
      delete:cfg('delete'),
      options:cfg('options'),
      resource:cfg('resource')
    };


    this.$get = getApi;

    getApi.$injector = ['$resource','$http'];

    function getApi($resource,$http){
      resolveApi(api,$resource,$http);
      return api;
    }

    function resolveApi(p,$resource,$http){
      angular.forEach(p,function(o,k){
        if(o.method && o.args){
          if(o.method == 'resource'){
            p[k] = $resource(o.args[0]);
          }
          else{
            p[k] = $http[o.method].apply(api, o.args);
          }
        }
        else{
          resolveApi(o,$resource,$http);
        }
      });
    }

    function register(name,apiObj){
      api[name] = angular.extend(api[name]||{},apiObj);
    }

    function cfg(method){
      return function () {
        return {
          method: method,
          args: Array.prototype.slice.call(arguments)
        }
      };
    }
  }

})();
