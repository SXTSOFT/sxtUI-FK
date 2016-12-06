
(function(){
  'use strict';

  angular
    .module('app.core')
    .provider('api', apiProvider);

  /** @ngInject */
  function apiProvider() {
    var api = {},
      provider = this,
      injector,
      cfgs=[],
      pouchdb,
      uploadDb,
      networkState = 1;

    provider.register = register;
    //provider.getNetwork = getNetwork;
    //provider.setNetwork = function (state) { networkState = state;};
    provider.$http = bindHttp({
      url:url,
      db:bindDb,
      wrap:wrap
    });
    provider.$q = function(){
      return provider.$q.$q.apply(provider,toArray(arguments));
    }



    provider.$get = getApi;
    provider.get = getServer;
    provider.setting = setting;

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
      provider.$rootScope = $rootScope;
      pouchdb = db;
      resolveApi(api,$resource,$http);
      api.setting = setting;
      api.getUploadData=getUploadData;
      api.getDBs=getDBs;
      api.task = task;
      api.upload = upload;
      api.uploadTask = uploadTask;
      api.event = event;
      provider.setNetwork = api.setNetwork = function (state) {
        return provider.$q.$q(function(resolve,reject){
          networkState = state;
          if(networkState==0)
            $rootScope.$emit('sxt:online');
          else
            $rootScope.$emit('sxt:offline');
          resolve(networkState);
        })
      };
      api.getNetwork = provider.getNetwork = function () {
        return networkState;
      };
      api.resetNetwork = function () {
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
        api.setNetwork(networkState);
      };
      api.wrap=wrap;
      api.useNetwork = function (state) {
        var cState,type = $window.navigator && $window.navigator.connection && $cordovaNetwork.getNetwork();
        switch (type) {
          case 'ethernet':
          case 'wifi':
          case '2g':
          case '3g':
          case '4g':
          case 'cellular':
            cState = 0;
            break;
          case 'unknown':
          case 'none':
            cState = 1;
            break;
          default:
            cState = 0;
            break;
        }
        if(state!=0 || cState==0) {
          api.oNetwork = networkState;
          networkState = state;
          api.networkState(networkState);
        }
      };
      api.resolveNetwork = function () {
        api.networkState(api.oNetwork);
      };
      api.db = provider.$http.db;
      api.clearDb = clearDb;
      api.download = download;
      return api;
    }

    function event(name,fn,scope) {
      var destroy = provider.$rootScope.$on(name,fn);
      scope && scope.$on('$destroy',destroy);
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
        put:cfg('put'),
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
        var settingDb= pouchdb('systemstting');
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
        self.task(tasks,options)(function (percent,current,total) {
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
        cfgs.sort(function(s1,s2){
          var p1 = s1.prioirty|| 0,
            p2 = s2.prioirty||0;
          return p1 - p2;
        });
        cfgs.forEach(function (cfg) {
          if (cfg.upload && cfg.fn) {
            if (filter && filter(cfg) === false)return;
            //if (cfg.)

            var group = {
              name: cfg.name || '其它-' + cfg._id,
              start: tasks.length,
              cfg:cfg
            };
            var db = initDb(cfg)
            groups.push(group);
            p.push(db.findAll(function (item) {
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
                  if (result&&result.status==200&&result.data&&!result.data.ErrorCode){
                    options.uploaded && options.uploaded(cfg,row,result);
                  }
                });
              });
            });
            group.end = tasks.length;
            group.current = 0;
            group.total = group.end - group.start;
          });
          resolve(tasks);
        }).catch(function () {
          reject();
        })
      });
    }
    function getUploadData(filter) {
      return provider.$q.$q(function (resolve,reject) {
        var p=[];
        var keys=[];
        cfgs.forEach(function (cfg) {
          if (cfg.upload && (!filter||filter(cfg))) {
            if (filter && filter(cfg) === false)return;
            var db = initDb(cfg)
            keys.push(db);
            p.push(db.findAll());
          }
        });
        provider.$q.$q.all(p).then(function (rs) {
          var arr=[];
          var i=0;
          rs.forEach(function (result) {
            if ( result.rows&& result.rows.length){
              arr.push({
                key:keys[i].name,
                vals:result.rows,
                db:keys[i]
              })
            }
            i++;
          });
          resolve(arr);
        }).catch(function () {
          reject();
        });
      })
    }
    function getDBs(filter) {
      return provider.$q.$q(function (resolve,reject) {
        var p=[];
        cfgs.forEach(function (cfg) {
          if (!filter||filter(cfg)) {
            if (filter && filter(cfg) === false)return;
            var db = initDb(cfg)
            p.push(db);
          }
        });
        resolve(p)
      })
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
            resolve();
          });
        }
        else {
          resolve();
        }
      })
    }
    function task(tasks,config) {
      return function start(progress,success,fail,options) {
        run(0,progress,success,fail,options);
      }
      function run(i,progress,success,fail,options) {
        var len = tasks.length,fn = tasks[i];
        if(config && config.event)
          provider.$rootScope.$emit(config.event,{
            target:config.target,
            event:'progress',
            percent:i * 1.0 / len,
            current:i,
            total:len
          });

        if (!progress || progress(i * 1.0 / len, i, len) !== false) {
          if (!fn) {
            if(config && config.event)
              provider.$rootScope.$emit(config.event,{
                target:config.target,
                event:'success'
              });
            success && success(tasks);
          }
          else {
            var d = new Date().getTime(),next = function () {
              run(i + 1, progress, success, fail, options);
            };
            var isTimeout=false;
            provider.$timeout(function(){
              if (!isTimeout){
                isTimeout=true;
                if(config && config.event)
                  provider.$rootScope.$emit(config.event,{
                    target:config.target,
                    event:'fail'
                  });
                fail && fail(true);
              }
            },50000);
            fn(tasks,donwfile).then(function (k) {
              if (!isTimeout){
                isTimeout=true;
                if(d && !next.r) {
                  d = 0;
                  next.r = true;
                  next();
                }
              }
            }).catch(function (err) {
              isTimeout=true;
              d = 0;
              if(config && config.event)
                provider.$rootScope.$emit(config.event,{
                  target:config.target,
                  event:'fail'
                });
              fail && fail();
            });
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

    function wrap(cfg) {

      function cfgSet(config) {
        var _cfg=$.extend(true,{},cfg,config);
        _cfg=bindDb(_cfg)
        function f() {
          var args = toArray(arguments);
          if (!_cfg.offline){
            return _cfg.fn.apply(_cfg,args);
          }
          var excute=_cfg.bind(_cfg.fn,_cfg.callback);
          return excute.apply(_cfg,args);
        }
        return f;
      }
      var  cfg=bindDb(cfg);
      function f() {
        var args = toArray(arguments);
        if (!cfg.offline){
           return cfg.fn.apply(cfg,args);
        }
        var excute=cfg.bind(cfg.fn,cfg.callback);
        return excute.apply(cfg,args);
      }
      f.cfgSet=cfgSet;
      return f;
    }

    /**
     * 绑定配置
     * @param cfg
       * @returns {*}
       */
    function bindDb (cfg) {
      if (cfg.methods) {
        var o = {}, methods = cfg.methods;
        delete cfg.methods;
        for (var k in methods) {
          o[k] = bindDb(angular.extend(angular.copy(cfg), methods[k])).bind(methods[k].fn);
        }
        return o;
      }
      else {
        cfgs.push(cfg);
        cfg.bind = function (fn, cb) {
          cfg.fn = fn;
          cfg.mode = cfg.mode || 0;
          var callFn = function () {
            var args = toArray(arguments),
              lodb = initDb(cfg,args),
              caller = this;
            if (cfg.mode == 1) { //1 离线优先，无离线数据尝试网络；
              var oRaiseError = cfg.raiseError;
              cfg.raiseError = true;
              return userOffline(caller, lodb, args, cb, fn).catch(function () {
                return userNetwork(caller, lodb, args, cb, fn).then(function (r) {
                  cfg.raiseError = oRaiseError;
                  return r;
                });
              });
            }
            else if (cfg.mode == 2) { //2 网络优先，无网络尝试离线数据
              return userNetwork(caller, lodb, args, cb, fn).catch(function () {
                return userOffline(caller, lodb, args, cb, fn);
              })
            }
            else {  //0 有网络只走网络，没网络只走离线；
              if (cfg.local || !cfg.fn || provider.getNetwork() == 1) {
                return userOffline(caller, lodb, args, cb, fn);
              }
              else {
                return userNetwork(caller, lodb, args, cb, fn);
              }
            }
          }
          callFn.cfg = cfg;
          callFn.db = function () {
            return initDb(cfg, toArray(arguments));
          }
          return callFn;
        };
        return cfg;
      }



      function id(d, db, args, cfg, cb) {
        return provider.$q.$q(function (resolve,reject) {
          var _id = angular.isFunction(cfg.idField) ? cfg.idField(d,args) : (d[cfg.idField]?d[cfg.idField]:cfg.idField);
          if (_id && db){
            return db.addOrUpdate(cfg.data ? cfg.data.apply(cfg, [angular.extend({_id: _id}, d)].concat(args))
              : angular.extend({_id: _id}, d)).then(function (defer) {
              if (cb && cb(defer));
              resolve(_id);
            }).catch(function (r) {
              reject(_id);
            })
          }else {
            resolve(_id);
          }
        })
      }

      function bindData(result, rows, cfg) {
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

      function _task(task) {
        return provider.$q.$q(function (resolve,reject) {
          if (!angular.isArray(task)||!task.length){
            resolve();
            return;
          }
          var len=task.length;
          function  execute(fn,index) {
            fn(task,index).then(function () {
              if (index>0){
                execute(task[index-1],index-1);
              }else {
                resolve();
              }
            }).catch(function () {
               reject();
            });
          }
          execute(task[task.length-1],task.length-1);
        });
      }

      function userOffline(caller, lodb, args, cb, fn) {
        var p2 = provider.$q.$q(function (resolve, reject) {
          if (!cfg._id&&!lodb) {
            resolve(bindData({}, [], cfg));
          }
          else if (cfg.delete) {
            var tasks=[];
            args.forEach(function (d) {
              tasks.push(function (arr,index) {
                return lodb.delete((angular.isFunction(cfg.idField) ? cfg.idField(d,args) : (d[cfg.idField]?d[cfg.idField]:cfg.idField)) || d)
              })
            });
            _task(tasks).then(function () {
              resolve(args);
            }).catch(function () {
              reject(args);
            });
          }
          else if (cfg.upload) {
            var updates = [];
            args.forEach(function (d) {
              updates.push(function (arr,index) {
                return id(d, lodb, args, cfg)
              });
            });
            _task(updates).then(function () {
              resolve({data:{ErrorCode:0,args:args}});
            }).catch(function () {
              reject();
            });
            // provider.$q.$q.all(updates).then(function () {
            //   resolve({data:{ErrorCode:0,args:args}});
            // });
          }
          else {
            var result = {};
            if (cfg.dataType == 3) {
              if ((args.length == 1 && !cfg.filter) || cfg.firstIsId) {
                lodb.get(args[0]).then(function (r) {
                  if (r || !cfg.raiseError) {
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
              else {
                lodb.findAll(function (item) {
                  if (cfg.filter)
                    return cfg.filter.apply(cfg, [item].concat(args));
                  return true;
                }, cfg.search, args).then(function (r) {
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
              }, cfg.search, args).then(function (r) {
                if (cfg.raiseError && !r.rows.length) {
                  reject(result);
                }
                else {
                  bindData(result, r.rows, cfg);
                  resolve(result);
                }
              });
            }
          }
        });
        return cb ? p2.then(function (result) {
          return cb.call(caller, result, cfg, args);
        }) : p2;
      }

      function userNetwork(caller, lodb, args, cb, fn) {
        var q = provider.$q.$q(function (resolve, reject) {
          var p = fn && fn.apply(caller, args);
          if (p) {
            p.then(function (result) {
              if(result && ((result.status>=200 && result.status<=299) || result.data)) {
                if (result.data) {
                  var data = result.data;
                  data.data=data.data?data.data:data.Data;
                  if (cfg.dataType == 1) {
                    var arr=[];
                    data.forEach(function (d) {
                      arr.push(function (arr,index) {
                        return id(d, lodb, args, cfg);
                      })
                    })
                    _task(arr).then(function () {
                      resolve(result);
                    }).catch(function () {
                      reject(result);
                    });
                  }
                  else {
                    if (cfg.dataType == 3) {
                      id(data, lodb, args, cfg).then(function () {
                        resolve(result);
                      }).catch(function () {
                        reject(result);
                      });
                    }
                    else if (data.rows && angular.isArray(data.rows)) {
                      var  arr=[];
                      data.rows.forEach(function (d) {
                        arr.push(function () {
                          return id(d, lodb, args, cfg);
                        })
                      })
                      arr.then(function () {
                        resolve(result);
                      }).catch(function () {
                        reject(result);
                      })
                    }
                    else if (data.data && angular.isArray(data.data)) {
                      data.data.forEach(function (d) {
                        arr.push(function () {
                          return id(d, lodb, args, cfg);
                        })
                      })
                      arr.then(function () {
                        resolve(result);
                      }).catch(function () {
                        reject(result);
                      })
                    }
                    else if (data.Rows && angular.isArray(data.Rows)) {
                      data.Rows.forEach(function (d) {
                        arr.push(function () {
                          return id(d, lodb, args, cfg);
                        })
                      })
                      arr.then(function () {
                        resolve(result);
                      }).catch(function () {
                        reject(result);
                      })
                    }else {
                      resolve(result);
                    }
                  }

                }
                else {
                  resolve(result);
                }
              }
              else {
                  reject(result);
                }
              })
          }
          else {
            resolve();
          }
        })
        return q && cb ? q.then(function (result) {
          return cb.call(caller, result, cfg, args);
        }) : q;
      }
    }

    function initDb(cfg,args) {
      var  localBD;
      if(cfg._id && cfg.db)
        localBD= cfg.db;
      if(cfg._id)
        localBD= cfg.db = pouchdb(cfg._id,cfg);
      else if(cfg.db){
        var id = cfg.db.apply(cfg,args);
        if(id)
          localBD= cfg._db=pouchdb(id,cfg);
      }
      return localBD;
    }


    function getNetwork() {
      return networkState;
    }
    function toArray(args) {
      return Array.prototype.slice.call(args);
    }

    function clearDb(progress,complete,fail,options) {
      var tasks = [];
      task([function (tasks) {
        return provider.$q.$q(function (resove,reject) {
          var dbs= window.localStorage.getItem("dbs");
          if (dbs){
            dbs=dbs.split(",");
            dbs= dbs.filter(function (o) {
              return o.toString()!="undefined"&&o.toString()!="NaN";
            })
            dbs.forEach(function (t) {
              if(!(options.exclude && options.exclude.indexOf(t)!=-1)){
                tasks.push(function(){
                  return pouchdb(t).destroy().catch(function(err){
                  });
                });
              }
            });
          }
          resove();
        })
      }],options)(progress,complete,fail,options);
    }
  }

})();
