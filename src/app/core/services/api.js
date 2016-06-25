(function ()
{
  'use strict';

  angular
    .module('app.core')
    .provider('api', apiProvider)

  /** @ngInject */
  function apiProvider() {
    var api = {},
      provider = this,
      injector,
      cfgs=[],
      pouchdb,
      settingDb;
    provider.register = register;
    provider.getNetwork = getNetwork;
    provider.$http = bindHttp({
      url:url,
      db:function (cfg) {
        cfgs.push(cfg);
        cfg.bind = bind;
        return cfg;
        function bind(fn) {
          cfg.fn = fn;
          return function () {
            var args = toArray(arguments),
              lodb = cfg.db;
            if(!lodb)
                lodb = cfg.db = pouchdb(cfg._id)

            if(provider.getNetwork()==1){
              return provider.$q.$q(function (resolve,reject) {
                if(!cfg.upload) {
                  var result = {
                    data: null
                  };
                  lodb.findAll(function(item) {
                    if (cfg.filter)
                      return cfg.filter.apply(cfg, [item].concat(args));
                    return true;
                  }).then(function (r) {
                      switch (cfg.dataType) {
                        case 1:
                          result.data = r.rows;
                          break;
                        case 2:
                          result.data = {rows: r.rows};
                          break;
                        case 3:
                          result.data = r.rows[0];
                          break;
                      }
                      resolve(result);
                    });
                }
                else {
                  //update or insert localdb
                }
              })
            }
            else
            {
              return fn.call(this,args).then(function (result) {
                var data = result.data;
                if (cfg.dataType == 1) {
                  data.forEach(function (d) {
                    if (id(d)) {
                      lodb.addOrUpdate(d);
                    }
                  })
                }
                else {
                  if (cfg.dataType == 3) {
                    lodb.addOrUpdate(data);
                  }
                  else if (data.rows && angular.isArray(data.rows)) {
                    data.rows.forEach(function (d) {
                      if (id(d)) {
                        lodb.addOrUpdate(d);
                      }
                    })
                  }
                }
                return result;
              });
            }
          }
        }
        function id(d) {
          d._id = angular.isFunction(cfg.idField) ? cfg.idField(d) : d[cfg.idField];
          return d._id;
        }
      }
    });
    provider.upload = function (filter,progress,complete) {
      var scope = {
        tasks:[]
      };
      appendTasks(scope.tasks,filter);
    };
    provider.$q = function(){
      return provider.$q.$q.apply(provider,toArray(arguments));
    }



    provider.$get = getApi;
    provider.get = getServer;
    provider.setting = setting

    getApi.$injector = ['$resource','$http','$injector','$q','db'];

    function getServer(name){
      return injector.get(name);
    }

    function getApi($resource,$http,$injector,$q,db){
      injector = $injector;
      provider.$http.$http = $http;
      provider.$q.$q = $q;
      pouchdb = db;
      resolveApi(api,$resource,$http);
      api.setting = setting;
      return api;
    }

    function resolveApi(p,$resource,$http){
      if(p!==api)
        p.root = api;
      angular.forEach(p,function(o,k){
        if(k === 'root' || !angular.isObject(o))return;
        if(o.method && o.args){
          if(o.method == 'custom'){
            p[k] = custom(o.args[0],p,o.fn);
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
            args: toArray(arguments),
            fn:fn
          };
        }
      }
      return function () {
        var args = toArray(arguments),
          url = args[0];
        if (url.indexOf('http') == -1)
          args[0] = sxt.app.api + url;
        return provider.$http.$http[method].apply(self, args);
      };
    }


    function custom(fn,scope){
      return function (){
        var args = toArray(arguments);
        return fn.apply(scope,args);
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

    function bindHttp(obj) {
      return angular.extend(obj,{
        get:cfg('get'),
        post:cfg('post'),
        delete:cfg('delete'),
        options:cfg('options'),
        head:cfg('head'),
        resource:cfg('resource'),
        custom:cfg('custom')
      });
    }

    function setting(key,value) {
      return provider.$q(function (resolve) {
        if (!settingDb) {
          settingDb = pouchdb('systemstting');
        }
        if(value){
          settingDb.addOrUpdate({
            _id:key,
            value:value
          }).then(function () {
            resolve(value);
          });
        }
        else{
          settingDb.get(key).then(function (result) {
            resolve(result);
          }).catch(function () {
            resolve(null);
          });
        }
      })
    }

    function appendTasks(tasks,filter) {
      cfgs.forEach(function (cfg) {
        if(cfg.upload){
          cfg.db.findAll(function (item) {
            if(filter)return filter(cfg,item);
            return true;
          }).then(function (result) {
            result.rows.forEach(function (row) {
              tasks.push({
                cfg:cfg,
                row:row
              });
            });
          });
        }
      });
    }

    function getNetwork() {
     return 1;
    }

    function toArray(args) {
      return Array.prototype.slice.call(args);
    }

  }

})();
