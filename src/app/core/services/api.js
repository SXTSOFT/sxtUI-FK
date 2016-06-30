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
      uploadDb,
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
      api.uploadTask = uploadTask;
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
            args: toArray(arguments)
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
      self.task(tasks)(function (percent,current,total) {
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
        progress && progress(percent,current,total);
      },complete,fail);
      return groups;
    }
    function appendTasks(tasks,groups,filter) {
      cfgs.forEach(function (cfg) {
        if(cfg.upload){
          if(filter && filter(cfg)===false)return;
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
      return function start(progress,success,fail) {
        run(0,progress,success,fail,null);
      }
      function run(i,progress,success,fail) {
        var len = tasks.length,fn = tasks[i];
        if (progress(i * 1.0 / len, i, len) !== false) {
          if (!fn) {
            networkState = oNetworkState;
            success && success();
          }
          else {
            fn(tasks).then(function () {
              run(i + 1, progress, success, fail);
            }).catch(function () {
              networkState = oNetworkState;
              fail && fail();
            });
          }
        }
      }
    }
    function uploadTask(itemOrFilter) {
      return provider.$q(function (resolve) {
        if (!uploadDb) {
          uploadDb = pouchdb('systemupload');
        }
        if(!angular.isFunction(itemOrFilter)){
          uploadDb.addOrUpdate(itemOrFilter).then(function () {
            resolve(item);
          });
        }
        else{
          uploadDb.findAll(itemOrFilter).then(function (result) {
            resolve(result);
          }).catch(function () {
            resolve(null);
          });
        }
      })
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
        cfg.bind = function (fn,cb) {
          cfg.fn = fn;
          return function () {
            var args = toArray(arguments),
              lodb = cfg.db,
              caller = this;
            if(!lodb && cfg._id)
              lodb = cfg.db = pouchdb(cfg._id);

            if(cfg.local || !cfg.fn || provider.getNetwork()==1){
              var p2 = provider.$q.$q(function (resolve,reject) {
                if(!cfg._id){
                  resolve(bindData({},[],cfg));
                }
                else if(cfg.delete){
                  args.forEach(function (d) {
                    lodb.delete(id(d)||d);
                  });
                  resolve(args);
                }
                else if(cfg.upload) {
                  args.forEach(function (d) {
                    id(d,lodb,args,cfg);
                  });
                  resolve(args);
                }
                else{
                  var result = {};
                  if(cfg.dataType == 3){
                    if(args.length==1 && !cfg.filter) {
                      lodb.get(args[0]).then(function (r) {
                        result.data = r;
                        resolve(result);
                      }).catch(function (r) {
                        result.data = r;
                        reject(result);
                      });
                    }
                    else{
                      lodb.findAll(function (item) {
                        if (cfg.filter)
                          return cfg.filter.apply(cfg, [item].concat(args));
                        return true;
                      }).then(function (r) {
                        result.data = r.rows[0];
                        resolve(result);
                      })
                    }
                  }
                  else {
                    lodb.findAll(function (item) {
                      if (cfg.filter)
                        return cfg.filter.apply(cfg, [item].concat(args));
                      return true;
                    }).then(function (r) {
                      bindData(result,r.rows,cfg);
                      resolve(result);
                    });
                  }
                }
              });
              return cb? p2.then(function (result) {
                return cb.call(caller,result,cfg,args);
              }):p2;
            }
            else
            {
              var p = fn && fn.apply(caller,args),
                p1 = p && p.then(function (result) {
                    if(result && result.data) {
                      var data = result.data;
                      if (cfg.dataType == 1) {
                        data.forEach(function (d) {
                          id(d, lodb, args,cfg);
                        })
                      }
                      else {
                        if (cfg.dataType == 3) {
                          id(data, lodb, args,cfg);
                        }
                        else if (data.rows && angular.isArray(data.rows)) {
                          data.rows.forEach(function (d) {
                            id(d, lodb, args,cfg);
                          })
                        }
                        else if (data.data && angular.isArray(data.data)) {
                          data.data.forEach(function (d) {
                            id(d, lodb, args,cfg);
                          })
                        }
                        else if (data.Rows && angular.isArray(data.Rows)) {
                          data.Rows.forEach(function (d) {
                            id(d, lodb, args,cfg);
                          })
                        }
                      }
                    }
                    return result;
                  });
              return p1 && cb ? p1.then(function (result) {
                return cb.call(caller,result,cfg,args);
              }):p1;
            }
          }
        };
        return cfg;
      }

      function id(d,db,args,cfg) {
        var _id = angular.isFunction(cfg.idField) ? cfg.idField(d) : d[cfg.idField];
        if(_id && db){
          db.addOrUpdate(cfg.data?cfg.data.apply(cfg,[angular.extend({_id:_id},d)].concat(args)):angular.extend({_id:_id},d));
        }
        return _id;
      }
      function bindData(result,rows,cfg) {
        switch (cfg.dataType) {
          case 1:
            result.data = rows;
            break;
          case 2:
            result.data = {rows: rows};
            break;
          case 3:
            result.data = rows[0];
            break;
          case 4:
            result.data = {
              data: rows
            };
            break;
          case 5:
            result.data = {
              Rows: rows
            };
            break;
        }
        return result;
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
