(function ()
{
  'use strict';

  angular
    .module('app.core')
    .provider('api', apiProvider)

  /** @ngInject */
  function apiProvider() {
    var api = {},provider = this,injector,dbs=[],pouchdb;
    provider.register = register;
    provider.getNetwork = getNetwork;
    provider.$http = angular.extend(bindHttp({
      url:url,
      db:function (cfg) {
        return bindHttp(cfg, function (args, result) {
          if (result) {
            var lodb = dbs.find(function (b) {
              return b._id == cfg._id;
            });
            if (!lodb) {
              lodb = pouchdb(cfg._id);
              dbs.push(lodb);
            }
            var data = result.data,
              id = function (d) {
                d._id = angular.isFunction(cfg.idField) ? cfg.idField(d) : d[cfg.idField];
                return d._id;
              };
            if (cfg.dataType==1) {
              data.forEach(function (d) {
                if (id(d)) {
                  lodb.addOrUpdate(d);
                }
              })
            }
            else {
              if (cfg.dataType==3) {
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
          }
          else {
            var uploadDb = '_upload',
              upDb = dbs.find(function (b) {
                return b._id == uploadDb;
              });
            if (!lodb) {
              upDb = pouchdb(uploadDb);
              dbs.push(upDb);
            }
            upDb.addOrUpdate(args);
          }
        });
      }
    }));
    provider.$q = function(){
      return provider.$q.$q.apply(provider,Array.prototype.slice.call(arguments));
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

    function cfg(method,fn){
      if(method == 'custom' || method=='resource'){
        return function (){
          return {
            method : method,
            args: Array.prototype.slice.call(arguments),
            fn:fn
          };
        }
      }
      return function () {
        var self = this;
        if(provider.getNetwork()==1 && self._id){
          return provider.$q.$q(function (resolve,reject) {
            if(method=='get') {
              var db = dbs.find(function (d) {
                return d._id == self._id;
              });
              if (!db) {
                db = pouchdb(self._id);
                dbs.push(db);
              }
              var result = {
                data: null
              };
              if (db) {
                db.findAll(self.filter).then(function (r) {
                  switch (self.dataType) {
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
                switch (self.dataType) {
                  case 1:
                    result.data = [];
                    break;
                  case 2:
                    result.data = {rows: []};
                    break;
                  case 3:
                    result.data = null;
                    break;
                }
                resolve(result);
              }
            }
            else {
              var args = Array.prototype.slice.call(arguments),
                url = args[0],id = function (d) {
                  d._id = angular.isFunction(cfg.idField)? cfg.idField(d):d[cfg.idField];
                  return d._id;
                },_id = id(args[1]);
              self.url = url;
              resolve(fn({
                _id:url+(_id?_id:''),
                args:args
              }));
            }
          })
        }
        else {
          var args = Array.prototype.slice.call(arguments),
            url = args[0];
          if (url.indexOf('http') == -1)
            args[0] = sxt.app.api + url;
          return fn ? provider.$http.$http[method].apply(self, args).then(function (result) {
            return fn(args, result);
          }) :
            provider.$http.$http[method].apply(self, args);
        }
      };
    }


    function custom(fn,scope,cb){
      return function (){
        var args = Array.prototype.slice.call(arguments);
        return cb ?
          fn.apply(scope,args).then(function (result) {
            return cb(args,result);
          }):
          fn.apply(scope,args);
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

    function bindHttp(obj,fn) {
      return angular.extend(obj,{
        get:cfg('get',callback),
        post:cfg('post',callback),
        delete:cfg('delete',callback),
        options:cfg('options',callback),
        head:cfg('head',callback),
        resource:cfg('resource',callback),
        custom:cfg('custom',callback)
      });
      function callback(args,result) {
        fn && fn(args,result);
        return result;
      }
    }

    function setting(key,value) {
      return provider.$q(function (resolve) {
        var settingdb='systemstting',
          lodb = dbs.find(function (b) {
            return b._id == settingdb;
          });
        if (!lodb) {
          lodb = pouchdb(settingdb);
          dbs.push(lodb);
        }
        if(value){
          lodb.addOrUpdate({
            _id:key,
            value:value
          }).then(function () {
            resolve(value);
          });
        }
        else{
          lodb.get(key).then(function (result) {
            resolve(result);
          }).catch(function () {
            resolve(null);
          });
        }
      })
    }


    function getNetwork() {
     return 1;
    }

  }

})();
