(function ()
{
  'use strict';

  angular
    .module('app.core')
    .provider('api', apiProvider)

  /** @ngInject */
  function apiProvider() {
    var api = {},provider = this,injector;
    provider.register = register;
    provider.$http = {
      url:url,
      get:cfg('get'),
      post:cfg('post'),
      delete:cfg('delete'),
      options:cfg('options'),
      head:cfg('head'),
      resource:cfg('resource'),
      custom:cfg('custom')
    };
    provider.$q = function(){
      return provider.$q.$q.apply(provider,Array.prototype.slice.call(arguments));
    }



    provider.$get = getApi;
    provider.get = getServer;

    getApi.$injector = ['$resource','$http','$injector','$q'];

    function getServer(name){
      return injector.get(name);
    }

    function getApi($resource,$http,$injector,$q){
      injector = $injector;
      provider.$http.$http = $http;
      provider.$q.$q = $q;
      resolveApi(api,$resource,$http);
      return api;
    }

    function resolveApi(p,$resource,$http){
      if(p!==api)
        p.root = api;
      angular.forEach(p,function(o,k){
        if(k === 'root' || !angular.isObject(o))return;
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
      if(method == 'custom' || method=='resource'){
        return function (){
          return {
            method : method,
            args: Array.prototype.slice.call(arguments)
          };
        }
      }
      return function () {
        var args = Array.prototype.slice.call(arguments),
          url = args[0];
        if(url.indexOf('http')==-1)
          args[0] = sxt.app.api+url;
        return provider.$http.$http[method].apply(this,args);
      };
    }


    function custom(fn,scope){
      return function (){
        return fn.apply(scope,Array.prototype.slice.call(arguments));
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
      return parts.join('&');
    }

    function url(path,args) {
      if (!args) return path;
      return path + ((path.indexOf('?') == -1) ? '?' : '&') + params(args);
    }

  }

})();
