(function ()
{
  'use strict';

  angular
    .module('app.core')
    .provider('api', apiProvider)

  /** @ngInject */
  function apiProvider() {

    var api = {},provider = this;
    provider.register = register;
    provider.$http = {
      url:url,
      get:cfg('get'),
      post:cfg('post'),
      delete:cfg('delete'),
      options:cfg('options'),
      resource:cfg('resource'),
      custom:cfg('custom')
    };


    provider.$get = getApi;

    getApi.$injector = ['$resource','$http'];

    function getApi($resource,$http){
      provider.$http.$http = $http;
      resolveApi(api,$resource,$http);
      return api;
    }

    function resolveApi(p,$resource,$http){
      angular.forEach(p,function(o,k){
        if(o.method && o.args){
          if(o.method == 'custom'){
            p[k] = custom(o.args[0],p);
          }
          else if(o.method == 'resource'){
            p[k] = $resource(o.args[0]);
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
        return provider.$http.$http[method].apply(this,Array.prototype.slice.call(arguments));
      };
    }


    function custom(fn,scope){
      return function (){
        fn.apply(scope,Array.prototype.slice.call(arguments));
      }
    }

    function encodeUriQuery(val, pctEncodeSpaces) {
      return encodeURIComponent(val).
      replace(/%40/gi, '@').
      replace(/%3A/gi, ':').
      replace(/%24/g, '$').
      replace(/%2C/gi, ',').
      replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
    }

    function params(params) {
      var parts = [];
      angular.forEach(params, function (value, key) {
        if (value === null || angular.isUndefined(value)) return;
        if (!angular.isArray(value)) value = [value];

        angular.forEach(value, function (v) {
          if (angular.isDate(v)) {
            v = moment(v).format('YYYY-MM-DD')
          }
          else if (angular.isObject(v)) {
            v = angular.toJson(v);
          }
          parts.push(encodeUriQuery(key) + '=' + encodeUriQuery(v));
        });
      });
    }

    function url(path,args) {
      if (!args) return path;
      return path + ((path.indexOf('?') == -1) ? '?' : '&') + params(args);
    }

  }

})();
