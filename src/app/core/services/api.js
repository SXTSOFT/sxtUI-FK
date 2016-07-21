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

    getApi.$injector = ['$resource','$http','$injector','$q','db','$rootScope','$cordovaNetwork','$window','$cordovaFileTransfer','$timeout'];

    function getServer(name){
      return injector.get(name);
    }

    function getApi($resource,$http,$injector,$q,db,$rootScope,$cordovaNetwork,$window,$cordovaFileTransfer,$timeout){
      injector = $injector;
      provider.$http.$http = $http;
      provider.$q.$q = $q;
      provider.$cordovaFileTransfer = $cordovaFileTransfer;
      provider.$timeout = $timeout;
      provider.$window = $window;
      pouchdb = db;
      resolveApi(api,$resource,$http);
      api.setting = setting;
      api.task = task;
      api.upload = upload;
      api.uploadTask = uploadTask;
      api.setNetwork = provider.setNetwork;
      api.getNetwork = provider.getNetwork;
      api.resetNetwork = function () {
        $rootScope.$emit('$cordovaNetwork:online');
      };
      api.useNetwork = function (state) {
        var cState,type = $window.navigator && $window.navigator.connection && $cordovaNetwork.getNetwork();
        switch (type) {
          case 'ethernet':
          case 'wifi':
          case '2g':
          case '3g':
          case '4g':
            cState = 0;
            break;
          case 'unknown':
          case 'none':
          case 'cellular':
            cState = 1;
            break;
          default:
            cState = 0;
            break;
        }
        if(state!=0 || cState==0) {
          api.oNetwork = networkState;
          networkState = state;
        }
      };
      api.resolveNetwork = function () {
        networkState = api.oNetwork;
      };

      $rootScope.$on('$cordovaNetwork:online', function(event, state){
        //console.log('$window.navigator',$window.navigator);
        var type = $window.navigator && $window.navigator.connection && $cordovaNetwork.getNetwork();
        switch (type) {
          case 'ethernet':
          case 'wifi':
            networkState = 0;
            break;
          case 'unknown':
          case 'none':
          case '2g':
          case '3g':
          case '4g':
          case 'cellular':
            networkState = 1;
            break;
          default:
            networkState = 0;
            break;
        }
      });
      $rootScope.$on('$cordovaNetwork:offline', function(event, state){
        networkState =1;
      });
      api.resetNetwork();

      api.db = provider.$http.db;
      api.clearDb = clearDb;
      api.download = download;
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

    /**
     *
     * @param obj
     * @returns {Object}
       */
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
        else if(value===null){
          settingDb.delete(key).then(function (result) {
            result(result);
          }).catch(function () {
            resolve(null);
          })
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
    function upload(filter,progress,complete,fail,options) {
      var tasks = [],
        self =this,
        groups = [];
      appendTasks(tasks,groups,filter,options).then(function (tasks) {
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
        },complete,fail,options);
      });
      return groups;
    }
    function appendTasks(tasks,groups,filter,options) {
      return provider.$q.$q(function(resolve,reject) {
        var p=[];
        cfgs.forEach(function (cfg) {
          if (cfg.upload && cfg.fn) {
            if (filter && filter(cfg) === false)return;
            var group = {
              name: cfg.name || '其它-' + cfg._id,
              start: tasks.length,
              cfg:cfg
            };
            groups.push(group);
            p.push(initDb(cfg).findAll(function (item) {
              if (filter)return filter(cfg, item);
              return true;
            }));
          }
        });
        provider.$q.$q.all(p).then(function (rs) {
          var i=0;
          rs.forEach(function (result) {
            var group = groups[i++],cfg = group.cfg;
            result.rows.forEach(function (row) {
              tasks.push(function () {
                return cfg.fn.call(cfg, row).then(function (result) {
                  options.uploaded && options.uploaded(cfg,row,result);
                });
              });
            });
            group.end = tasks.length;
            group.current = 0;
            group.total = group.end - group.start;
          });
          resolve(tasks);
        })
      });
    }
    function download(tasks) {
      var oNetworkState = networkState;
      networkState = 0;
      var t = task(tasks);

      return function (progress,success,fail,options) {
        return t(progress,function () {
          networkState = oNetworkState;
          success && success();
        },function () {
          networkState = oNetworkState;
          fail && fail();
        },options);
      };
    }
    function donwfile(dir,uname,url) {

      return provider.$q.$q(function (resolve) {
        if (provider.$window.cordova) {
          var rootPath = provider.$window.cordova.file.dataDirectory + '/' + dir + '/';
          provider.$cordovaFileTransfer.download(url, rootPath + uname).then(function (r) {
            resolve();
          }).catch(function (err) {
            console.log('downerr',err);
            resolve();
          });
        }
        else {
          resolve();
        }
      })
    }
    function task(tasks) {
      return function start(progress,success,fail,options) {
        run(0,progress,success,fail,options);
      }
      function run(i,progress,success,fail,options) {
        var len = tasks.length,fn = tasks[i];
        if (progress(i * 1.0 / len, i, len) !== false) {
          if (!fn) {
            success && success(tasks);
          }
          else {
            var d = new Date().getTime(),next = function () {
              run(i + 1, progress, success, fail, options);
            };
            fn(tasks,donwfile).then(function () {
              if(d && !next.r) {
                d = 0;
                next.r = true;
                next();
              }
            }).catch(function (err) {
              console.log('derr',err);
              d = 0;
              fail && fail();
            });
            provider.$timeout(function () {
              if(d && !next.r){
                d = 0;
                next.r = true;
                next();
              }
            },options && options.timeout?options.timeout:3000);
          }
        }
      }
    }
    function uploadTask(itemOrFilter,value) {
      return provider.$q(function (resolve) {
        if (!uploadDb) {
          uploadDb = pouchdb('systemupload');
        }
        if(!angular.isFunction(itemOrFilter)){
          if(networkState==1) {
            uploadDb.addOrUpdate(itemOrFilter).then(function () {
              resolve(itemOrFilter);
            });
          }
          else{
            resolve(itemOrFilter);
          }
        }
        else{
          uploadDb.findAll(itemOrFilter).then(function (result) {
            if(value===null){
              result.rows.forEach(function (row) {
                uploadDb.remove(row);
              });
            }
            resolve(result);
          }).catch(function () {
            resolve(null);
          });
        }
      })
    }

    /**
     * 绑定配置
     * @param cfg
       * @returns {*}
       */
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
              lodb = initDb(cfg),
              caller = this;

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
                  var updates = [];
                  args.forEach(function (d) {
                    id(d,lodb,args,cfg,function (defer) {
                      updates.push(defer);
                    });
                  });
                  provider.$q.$q.all(updates).then(function () {
                    resolve(args);
                  });
                }
                else{
                  var result = {};
                  if(cfg.dataType == 3){
                    if(args.length==1 && !cfg.filter) {
                      lodb.get(args[0]).then(function (r) {
                        if(r || !cfg.raiseError) {
                          result.data = r;
                          resolve(result);
                        }
                        else {
                          reject();
                        }
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
                      },cfg.starKey && cfg.starKey.apply(cfg,args)).then(function (r) {
                        result.data = r.rows[0];
                        if (!cfg.raiseError || result.data)
                          resolve(result);
                        else
                          reject(result);
                      })
                    }
                  }
                  else {
                    lodb.findAll(function (item) {
                      if (cfg.filter)
                        return cfg.filter.apply(cfg, [item].concat(args));
                      return true;
                    },cfg.starKey && cfg.starKey.apply(cfg,args)).then(function (r) {
                      bindData(result,r.rows,cfg);
                      resolve(result);
                    });
                  }
                }
              });
              return (cb? p2.then(function (result) {
                return cb.call(caller,result,cfg,args);
              }):p2).then(function (result) {
                console.log('r',result,cfg);
                return result;
              });
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

      function id(d,db,args,cfg,cb) {
        var _id = angular.isFunction(cfg.idField) ? cfg.idField(d) : d[cfg.idField];
        if(_id && db){
          var defer = db.addOrUpdate(cfg.data?cfg.data.apply(cfg,[angular.extend({_id:_id},d)].concat(args)):angular.extend({_id:_id},d));
          if(cb && cb(defer));
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

    function initDb(cfg) {
      if(cfg.db) return cfg.db;
      if(!cfg._id)return;
      return (cfg.db = pouchdb(cfg._id));
    }
    function getNetwork() {
      return networkState;
    }
    function toArray(args) {
      return Array.prototype.slice.call(args);
    }

    function clearDb(progress,complete,fail,options) {
      var tasks = [];
       cfgs.forEach(function (cfg) {
         if(options.exclude && options.exclude.indexOf(cfg._id)!=-1)return;
         var db = initDb(cfg);
         if(db) {
           tasks.push(function () {
             return db.destroy().then(function (result) {
               cfg.db = null;
               return result;
             }).catch(function (err) {
               console.log(err)
             });
           })
         }
       });
      return task(tasks)(progress,complete,fail,options);
    }
  }

})();
