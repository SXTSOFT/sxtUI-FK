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
      settingDb,
      networkState = 1;
    provider.register = register;
    provider.getNetwork = getNetwork;
    provider.setNetwork = function (state) { networkState = state;};
    provider.$http = bindHttp({
      url:url,
      db:bindDb
    });
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
      api.task = task;
      api.upload = upload;
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
    function upload(filter,progress,complete,fail) {
      var tasks = [],
        self =this,
        groups = [];
      appendTasks(tasks,groups,filter);
      self.task(tasks)(function (percent,current,total,tips) {
        groups.forEach(function (g) {
          if(current>=g.end)
            g.percent = 1;
          else if(current<=g.start)
            g.percent = 0;
          else {
            g.current = current - g.start;
            g.percent = g.current * 1.0 / g.total;
          }
        });
        progress && progress(percent,current,total,tips);
      },complete,fail);
      return groups;
    }
    function appendTasks(tasks,groups,filter) {
      cfgs.forEach(function (cfg) {
        if(cfg.upload){
          var group = {
              name:cfg.name ||'其它-'+cfg._id,
              start:tasks.length
            };
          groups.push(group);
          cfg.db.findAll(function (item) {
            if(filter)return filter(cfg,item);
            return true;
          }).then(function (result) {
            result.rows.forEach(function (row) {
              tasks.push(function () {
                cfg.fn.call(cfg,row);
              });
            });
            group.end = tasks.length;
            group.current = 0;
            group.total = group.end - g.start;
          });
        }
      });
    }
    function task(tasks) {
      var oNetworkState = networkState;
      networkState = 0;
      var args = tasks,
        l = args.length;
      return function start(progress,success,fail) {
        run(0,progress,success,fail);
      }
      function run(i,progress,success,fail) {
        var fn = args[i];
        if(!fn){
          networkState = oNetworkState;
          progress(i*1.0/l,i,l);
          success && success();
        }
        else {
          progress(i*1.0/l,i,l,fn)
          fn().then(function () {
            run(i+1,progress,success,fail)
          }).catch(function () {
            networkState = oNetworkState;
            fail && fail();
          });
        }
      }
    }

    function bindDb (cfg) {
      if(cfg.methods){
        var o = {},methods = cfg.methods;
        delete cfg.methods;
        for(var k in methods){
          o[k] = bindDb(angular.extend(angular.copy(cfg),methods[k])).bind(methods[k].fn);
        }
        return o;
      }
      else {
        cfgs.push(cfg);
        cfg.bind = bind;
        return cfg;
      }
      function bind(fn) {
        cfg.fn = fn;
        return function () {
          var args = toArray(arguments),
            lodb = cfg.db,
            _id;
          if(!lodb)
            lodb = cfg.db = pouchdb(cfg._id);

          if(cfg.local || !cfg.fn || provider.getNetwork()==1){
            return provider.$q.$q(function (resolve,reject) {
              if(cfg.delete){
                args.forEach(function (d) {
                  _id = id(d)||d;
                  lodb.delete(_id);
                })
              }
              else if(cfg.upload) {
                args.forEach(function (d) {
                  _id = id(d);
                  if(_id){
                    lodb.addOrUpdate(angular.extend({_id:_id},d));
                  }
                });
              }
              else{
                var result = {
                  data: null
                };
                if(cfg.dataType == 3 && args.length==1){
                  lodb.get(args[0]).then(function (r) {
                    result.data = r;
                    resolve(result);
                  }).catch(function (r) {
                    result.data = r;
                    reject(result);
                  });
                }
                else {
                  lodb.findAll(function (item) {
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
              }
            })
          }
          else
          {
            var p = fn && fn.apply(this,args);
            return p && p.then(function (result) {
                var data = result.data;
                if (cfg.dataType == 1) {
                  data.forEach(function (d) {
                    _id = id(d);
                    if (_id) {
                      lodb.addOrUpdate(angular.extend({_id:_id},d));
                    }
                  })
                }
                else {
                  if (cfg.dataType == 3) {
                    lodb.addOrUpdate(data);
                  }
                  else if (data.rows && angular.isArray(data.rows)) {
                    data.rows.forEach(function (d) {
                      _id = id(d);
                      if (_id) {
                        lodb.addOrUpdate(angular.extend({_id:_id},d));
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
        var _id = angular.isFunction(cfg.idField) ? cfg.idField(d) : d[cfg.idField];
        return _id;
      }
    }


    function getNetwork() {
     return networkState;
    }
    function toArray(args) {
      return Array.prototype.slice.call(args);
    }

    //to vanke
  }

})();
