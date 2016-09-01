
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
      cfgs = [],
      pouchdb,
      settingDb,
      uploadDb,
      networkState = 0,
      globalDb = {
        id: 'sxt_global_db',
        noCache:false
      };

    provider.register = register;
    //provider.getNetwork = getNetwork;
    //provider.setNetwork = function (state) { networkState = state;};
    provider.$http = bindHttp({
      url: url,
      db: bindDb
    });
    provider.$q = function () {
      return provider.$q.$q.apply(provider, toArray(arguments));
    }


    provider.$get = getApi;
    provider.get = getServer;
    provider.setting = setting;

    getApi.$injector = ['$resource', '$http', '$injector', '$q', 'db', '$rootScope', '$cordovaNetwork', '$window', '$cordovaFileTransfer', '$timeout','$cordovaFile'];

    function getServer(name) {
      return injector.get(name);
    }

    function getApi($resource, $http, $injector, $q, db, $rootScope, $cordovaNetwork, $window, $cordovaFileTransfer, $timeout,$cordovaFile) {
      injector = $injector;
      provider.$http.$http = $http;
      provider.$q.$q = $q;
      provider.$cordovaFileTransfer = $cordovaFileTransfer;
      provider.$timeout = $timeout;
      provider.$window = $window;
      provider.$rootScope = $rootScope;
      provider.$cordovaFile = $cordovaFile;
      pouchdb = db;
      resolveApi(api, $resource, $http);
      api.setting = setting;
      api.task = task;
      api.upload = upload;
      api.uploadTask = uploadTask;
      api.event = event;
      provider.setNetwork = api.setNetwork = function (state) {
        networkState = state;
        if (networkState == 0)
          $rootScope.$emit('sxt:online');
        else
          $rootScope.$emit('sxt:offline');
      };
      api.getNetwork = provider.getNetwork = function () {
        return networkState;
      };
      api.resetNetwork = function () {
        networkState = 0;
        return;
        var type = $window.navigator && $window.navigator.connection && $cordovaNetwork.getNetwork();



        switch (type) {
          case 'ethernet':
          case 'wifi':
          case '4g':
            networkState = 0;
            break;
          case 'unknown':
          case 'none':
          case '2g':
          case '3g':

          case 'cellular':
            networkState = 1;
            break;
          default:
            networkState = 0;
            break;
        }
        api.setNetwork(networkState);
      };

      api.useNetwork = function (state) {
        networkState = 0;
        return;
        var cState, type = $window.navigator && $window.navigator.connection && $cordovaNetwork.getNetwork();
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
        if (state != 0 || cState == 0) {
          api.oNetwork = networkState;
          networkState = state;
          api.networkState(networkState);
        }
      };
      api.resolveNetwork = function () {
        api.networkState(api.oNetwork);
      };

      $rootScope.$on('$cordovaNetwork:online', function (event, state) {
        api.resetNetwork();
      });
      $rootScope.$on('$cordovaNetwork:offline', function (event, state) {
        api.resetNetwork();
      });
      $rootScope.$on('$cordovaNetwork:setNetwork', function (event, state) {
        api.setNetwork(state);
      });
      $timeout(function () {
        $rootScope.$emit('$cordovaNetwork:online');
      }, 100);


      api.db = provider.$http.db;
      api.clearDb = clearDb;
      api.download = download;
      return api;
    }

    function event(name, fn, scope) {
      var destroy = provider.$rootScope.$on(name, fn);
      scope && scope.$on('$destroy', destroy);
    }

    function resolveApi(p, $resource, $http) {
      if (p !== api)
        p.root = api;
      angular.forEach(p, function (o, k) {
        if (k === 'root' || !angular.isObject(o))return;
        if (o.method && o.args) {
          if (o.method == 'custom') {
            p[k] = custom(o.args[0], p, o.fn);
          }
          else if (o.method == 'resource') {
            p[k] = $resource(o.args[0]);
          }
        }
        else {
          resolveApi(o, $resource, $http);
        }
      });
    }

    function register(name, apiObj) {
      api[name] = angular.extend(api[name] || {}, apiObj);
    }

    function cfg(method) {
      if (method == 'custom' || method == 'resource') {
        return function () {
          return {
            method: method,
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


    function custom(fn, scope) {
      return function () {
        var args = toArray(arguments);
        return fn.apply(scope, args);
      }
    }

    function encodeUriQuery(val, pctEncodeSpaces) {
      return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
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

    function url(path, args) {
      if (!args) return path;
      return path + ((path.indexOf('?') == -1) ? '?' : '&') + params(args);
    }

    /**
     *
     * @param obj
     * @returns {Object}
     */
    function bindHttp(obj) {
      return angular.extend(obj, {
        get: cfg('get'),
        post: cfg('post'),
        delete: cfg('delete'),
        options: cfg('options'),
        head: cfg('head'),
        resource: cfg('resource'),
        custom: cfg('custom')
      });
    }

    function setting(key, value) {
      return provider.$q(function (resolve) {
        if (!settingDb) {
          settingDb = pouchdb('systemstting');
        }
        if (value) {
          settingDb.addOrUpdate({
            _id: key,
            value: value
          }).then(function () {
            resolve(value);
          });
        }
        else if (value === null) {
          settingDb.delete(key).then(function (result) {
            result(result);
          }).catch(function () {
            resolve(null);
          })
        }
        else {
          settingDb.get(key).then(function (result) {
            resolve(result);
          }).catch(function () {
            resolve(null);
          });
        }
      })
    }

    function upload(filter, progress, complete, fail, options) {
      var tasks = [],
        self = this,
        groups = [];
      appendTasks(tasks, groups, filter, options).then(function (tasks) {
        self.task(tasks, options)(function (percent, current, total) {
          groups.forEach(function (g) {
            if (current >= g.end)
              g.percent = 1;
            else if (current <= g.start)
              g.percent = 0;
            else {
              g.current = current - g.start;
              g.percent = g.current * 1.0 / g.total;
            }
          });
          progress && progress(percent, current, total);
        }, complete, fail, options);
      });
      return groups;
    }

    function appendTasks(tasks, groups, filter, options) {
      return provider.$q.$q(function (resolve, reject) {
        var p = [];
        cfgs.sort(function (s1, s2) {
          var p1 = s1.prioirty || 0,
            p2 = s2.prioirty || 0;
          return p1 - p2;
        });
        cfgs.forEach(function (cfg) {
          if (cfg.upload && cfg.fn) {
            if (filter && filter(cfg) === false)return;
            var group = {
              name: cfg.name || '其它-' + cfg._id,
              start: tasks.length,
              cfg: cfg
            };
            groups.push(group);
            if (cfg.selfDb) {
              var db = initDb(cfg);
              p.push(db.findAll(function (item) {
                if (filter)return filter(cfg, item);
                return true;
              }));
            }
            else {
              p.push(db_findAll(cfg, filter));
            }
          }
        });
        provider.$q.$q.all(p).then(function (rs) {
          var i = 0;
          rs.forEach(function (result) {
            var group = groups[i++], cfg = group.cfg;
            result.rows.forEach(function (row) {
              tasks.push(function () {
                return provider.$q(function (resolve,reject) {
                  provider.$q(function (r1,r2) {
                    if(!cfg.fileField  || !row._id){
                      r1(row);
                    }
                    else{
                      initDb(cfg).get(row._id,cfg).then(function (newRow) {
                        r1(newRow);
                      },r2)
                    }
                  }).then(function (row) {
                    cfg.fn.call(cfg, row).then(function (result) {
                      if (result && result.status == 200 && result.data && !result.data.ErrorCode) {
                        options.uploaded && options.uploaded(cfg, row, result);
                        resolve();
                      }
                      else{
                        reject(result);
                      }
                    }).catch(reject);
                  }).catch(reject);
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

      return function (progress, success, fail, options) {
        return t(progress, function () {
          networkState = oNetworkState;
          success && success();
        }, function () {
          networkState = oNetworkState;
          fail && fail();
        }, options);
      };
    }

    function donwfile(dir, uname, url) {

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

    function task(tasks, config) {
      return function start(progress, success, fail, options) {
        run(0, progress, success, fail, options);
      }
      function run(i, progress, success, fail, options) {
        var len = tasks.length, fn = tasks[i];
        if (config && config.event)
          provider.$rootScope.$emit(config.event, {
            target: config.target,
            event: 'progress',
            percent: i * 1.0 / len,
            current: i,
            total: len
          });

        if (!progress || progress(i * 1.0 / len, i, len) !== false) {
          if (!fn) {
            if (config && config.event)
              provider.$rootScope.$emit(config.event, {
                target: config.target,
                event: 'success'
              });
            success && success(tasks);
          }
          else {
            var d = new Date().getTime(), next = function () {
              run(i + 1, progress, success, fail, options);
            };
            fn(tasks, donwfile).then(function () {
              if (d && !next.r) {
                d = 0;
                next.r = true;
                next();
              }
            }).catch(function (err) {
              provider.$rootScope.$emit('applicationError', {exception: err});
              d = 0;
              if (config && config.event)
                provider.$rootScope.$emit(config.event, {
                  target: config.target,
                  event: 'fail'
                });
              fail && fail();
            });
            provider.$timeout(function () {
              if (d && !next.r) {
                d = 0;
                next.r = true;
                next();
              }
            }, options && options.timeout ? options.timeout : 3000);
          }
        }
      }
    }

    function uploadTask(itemOrFilter, value) {
      return provider.$q(function (resolve) {
        if (!uploadDb) {
          uploadDb = pouchdb('systemupload');
        }
        if (!angular.isFunction(itemOrFilter)) {
          if (networkState == 1) {
            uploadDb.addOrUpdate(itemOrFilter).then(function () {
              resolve(itemOrFilter);
            });
          }
          else {
            resolve(itemOrFilter);
          }
        }
        else {
          uploadDb.findAll(itemOrFilter).then(function (result) {
            if (value === null) {
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
    function bindDb(cfg) {
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
              lodb = initDb(cfg, args),
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
        var _id = angular.isFunction(cfg.idField) ? cfg.idField(d) : d[cfg.idField];
        if (_id && db) {
          var defer = db.addOrUpdate(cfg.data ? cfg.data.apply(cfg, [angular.extend({_id: _id}, d)].concat(args)) : angular.extend({_id: _id}, d));
          if (cb && cb(defer));
        }
        return _id;
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

      function userOffline(caller, lodb, args, cb, fn) {
        var p2 = provider.$q.$q(function (resolve, reject) {
          if (!cfg._id) {
            resolve(bindData({}, [], cfg));
          }
          else if (cfg.delete) {
            if (cfg.selfDb) {
              args.forEach(function (d) {
                lodb.delete(id(d, null, args, cfg) || d);
              });
              resolve(args);
            }
            else {
              lodb.delete(args).then(function () {
                resolve(args);
              });
            }
          }
          else if (cfg.upload) {
            if (cfg.selfDb) {
              var updates = [];
              args.forEach(function (d) {
                id(d, lodb, args, cfg, function (defer) {
                  updates.push(defer);
                });
              });
              provider.$q.$q.all(updates).then(function () {
                resolve(args);
              });
            }
            else {
              lodb.addOrUpdate(args).then(function () {
                resolve(args);
              }).catch(reject);
            }
          }
          else {
            var result = {};
            if (cfg.dataType == 3) {
              if (cfg.selfDb) {
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
                lodb.get(args[0]).then(function (r) {
                  result.data = r;
                  resolve(result);
                });
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
                if (result && ((result.status >= 200 && result.status <= 299) || result.data)) {
                  if (cfg.selfDb) {
                    if (result.data) {
                      var data = result.data;
                      if (cfg.dataType == 1) {
                        data.forEach(function (d) {
                          id(d, lodb, args, cfg);
                        })
                      }
                      else {
                        if (cfg.dataType == 3) {
                          id(data, lodb, args, cfg);
                        }
                        else if (data.rows && angular.isArray(data.rows)) {
                          data.rows.forEach(function (d) {
                            id(d, lodb, args, cfg);
                          })
                        }
                        else if (data.data && angular.isArray(data.data)) {
                          data.data.forEach(function (d) {
                            id(d, lodb, args, cfg);
                          })
                        }
                        else if (data.Rows && angular.isArray(data.Rows)) {
                          data.Rows.forEach(function (d) {
                            id(d, lodb, args, cfg);
                          })
                        }
                      }
                    }
                  }
                  else {
                    lodb.saveItems(result.data);
                    //db_save(cfg, result.data);
                  }
                  resolve(result);
                }
                else {
                  reject(result);
                }
              })
              .catch(function (r) {
                reject(r);
              });
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

    function initDb(cfg, args) {
      if (cfg._id && cfg.db) return cfg.db;
      if (cfg.selfDb) {
        if (cfg._id)
          return (cfg.db = pouchdb(cfg._id));
        else if (cfg.db) {
          var id = cfg.db.apply(cfg, args);
          if (id)
            return pouchdb(id);
        }
      }
      else {
        return (cfg.db = new SingleDB(cfg));
      }
    }


    function getNetwork() {
      return networkState;
    }

    function toArray(args) {
      return Array.prototype.slice.call(args);
    }

    function clearDb(progress, complete, fail, options) {
      var tasks = [];
      cfgs.forEach(function (cfg) {
        if (cfg._id && !(options.exclude && options.exclude.indexOf(cfg._id) != -1)) {
          tasks.push(function () {
            return provider.$q(function (resolve) {
              return get_globalDb().destroy(cfg._id).then(function (result) {
                cfg.db = null;
                resolve(result);
                return result;
              },resolve);
              /*if(!provider.$window.cordova) {
                resolve();
              }
              else {
                provider.$cordovaFile.removeFile(provider.$window.cordova.file.dataDirectory, cfg._id + '.bin').then(function () {
                  resolve();
                }).catch(function () {
                  resolve();
                })
              }*/
            });
          });
        }
      });
      provider.$rootScope.$emit('preClear', tasks);
      return task(tasks, options)(progress, complete, fail, options);
    }

    /**
     * 优化Sqlite 多数据慢的问题
     */

    function SingleDB(cfg) {
      var self = this;
      self.cfg = cfg;
      var idIsFunction = angular.isFunction(cfg.idField);
      self.idFn = function (item) {
        return angular.isObject(item) ? (idIsFunction ? cfg.idField(item) : item[cfg.idField]) : item;
      };
    }

    SingleDB.prototype.findAll = function (filter) {
      return db_findAll(this.cfg, filter);
    }
    SingleDB.prototype.delete = function (id) {
      if (!angular.isArray(id))
        id = [id];

      return db_save({
        _id: this.cfg._id,
        delete: !0
      }, id, this.idFn);
    }
    SingleDB.prototype.addOrUpdate = function (items) {
      var cfg = this.cfg;
      if (cfg.dataType == 3)
        return db_save(this.cfg, items, this.idFn);

      if (!angular.isArray(items))
        items = [items];
      return db_save({_id: cfg._id, upload: !0}, items, this.idFn);
    }
    SingleDB.prototype.saveItems = function (result) {
      return db_save(this.cfg, result, this.idFn);
    }
    SingleDB.prototype.get = function (id) {
      var self = this;
      return self.findAll(function (item) {
        return  (id && self.idFn(item) == id) || (self.cfg.filter && self.cfg.filter(id)) ||self.cfg.single===true;
      }).then(function (r) {
        if(cfg.fileField && r.rows && r.rows[0]){
          return self.db.get(r.rows[0]._id)
        }
        return r.rows[0];
      });
    }
    SingleDB.prototype.allDocs = function () {
      return provider.$q.$q(function (resolve) {
        resolve();
      })
    }

    function get_globalDb() {
      if(!globalDb.db && provider.$window.cordova){
        globalDb.db = (function () {
          var cache = {}, locks = {};
          return {
            get: get,
            put: put,
            allDocs: function () {
              return provider.$q(function (resolve) {
                resolve();
              })
            },
            destroy: function (id) {
              delete cache[id];
              return provider.$q(function (resolve, reject) {
                lock(id, function (cb) {
                  if(!provider.$window.cordova){
                    resolve();
                  }
                  else {
                    provider.$cordovaFile.removeFile(provider.$window.cordova.file.dataDirectory, id + '.bin').then(function () {
                      resolve();
                      cb();
                    }).catch(function () {
                      resolve();
                      cb();
                    })
                  }
                })
              });
            }
          }
          function lock(id, doFn) {
            var cb = function () {
              var buff = locks[id];
              buff.shift();
              run();
            }, run = function () {
              var buff = locks[id];
              if (buff && buff.length) {
                if (!buff.find(function (fn) {
                    return fn.runing === true;
                  })) {
                  var fn = locks[id][0];
                  fn.runing = true;
                  fn(cb);
                }
              }
            };
            if (!locks[id]) {
              locks[id] = [];
            }
            locks[id].push(doFn);
            run();
          }

          function get(id, cfg) {
            return provider.$q(function (resolve, reject) {
              lock(id, function (cb) {
                provider.$cordovaFile.readAsText(provider.$window.cordova.file.dataDirectory, id + '.bin').then(function (result) {
                  var r = provider.$window.JSON.parse(result);
                  //if(!globalDb.noCache || (cfg && cfg.fileField))
                  //  cache[id] = r;
                  resolve(r);
                  cb();
                }).catch(function (result) {
                  reject(null);
                  cb();
                });
              })
              /*              if(cache[id]){
               resolve(cache[id]);
               }
               else{

               }*/
            });
          }

          function put(doc, cfg) {
            //if((!cfg || !cfg.upload) && !globalDb.noCache && !cfg.fileField)
            //  cache[doc._id] = doc;

            //if(cfg && cfg.upload && cache[doc._id])
            //  delete cache[doc._id];


            return provider.$q(function (resolve, reject) {
              lock(doc._id, function (cb) {
                provider.$cordovaFile.writeFile(provider.$window.cordova.file.dataDirectory, doc._id + '.bin', provider.$window.JSON.stringify(doc), true)
                  .then(function (result) {
                    resolve(result)
                    cb();
                  }).catch(function (result) {
                  reject(result);
                  cb();
                })
              })
            });
          }
        })();
      }
      return globalDb.db || (globalDb.db = pouchdb(globalDb.id));
    }

    function db_findAll(cfg, filter) {
      var db = get_globalDb();
      return provider.$q.$q(function (resolve, reject) {
        var result = {
          "rows": []
        };
        db.get(cfg._id,cfg).then(function (r) {
          for (var i = 0, l = r.rows.length; i < l; i++) {
            if (!filter || filter(r.rows[i]) !== false) {
              result.rows.push(r.rows[i]);
            }
          }
          resolve(result);
        }).catch(function () {
          resolve(result);
        });
      })
    }

    function copySave(obj,exFields) {
      var o = {};
      for(var k in obj){
        if(obj.hasOwnProperty(k) && exFields.indexOf(k)==-1){
          o[k] = obj[k];
        }
      }
      return o;
    }
    function db_save(cfg, result, idFn) {
      if(!result) return;
      var db = get_globalDb();
      return provider.$q.$q(function (resolve, reject) {
        db.get(cfg._id,cfg).then(save_to).catch(save_to);
        function save_to(doc) {
          provider.$q(function (resolve, reject) {
            if (cfg.fileField) {
              if (!angular.isArray(cfg.fileField)) {
                cfg.fileField = [cfg.fileField];
              }
              var _saveList = [],
                nResult;
              if (angular.isArray(result)) {
                nResult = [];
                result.forEach(function (r) {
                  r._id = idFn(r);
                  _saveList.push(db.put(r, {
                    upload: true
                  }));
                  nResult.push(copySave(r, cfg.fileField));
                })
              }
              else {
                result._id = idFn(result);
                nResult = copySave(result, cfg.fileField);
                _saveList.push(db.put(result, {
                  upload: true
                }));
              }
              provider.$q.$q.all(_saveList).then(function () {
                resolve(nResult);
              }, function () {
                resolve(nResult);
              });
            }
            else {
              resolve(result);
            }
          }).then(function (result) {
            if (!doc || doc.error)
              doc = {_id: cfg._id, rows: []};

            if (cfg.delete) {
              result.forEach(function (item) {
                delete_db(item, doc.rows, idFn);
              });
            }
            else {
              if (cfg.upload || cfg.dataType == 1) {
                if(angular.isArray(result))
                  replace_db(result, doc.rows, idFn);
                else
                  replace_db_single(result, doc.rows, idFn);
              }
              /*          else if (cfg.dataType == 1) {
               replace_db(result, doc.rows, idFn);
               }*/
              else if (cfg.dataType == 3) {
                if (cfg.single)
                  doc.rows = [result];
                else
                  replace_db_single(result, doc.rows, idFn);
              }
              else if (result.rows && angular.isArray(result.rows)) {
                replace_db(result.rows, doc.rows, idFn);
              }
              else if (result.data && angular.isArray(result.data)) {
                replace_db(result.data, doc.rows, idFn);
              }
              else if (result.Rows && angular.isArray(result.Rows)) {
                replace_db(result.Rows, doc.rows, idFn);
              }
            }
            return db.put(doc, cfg).then(resolve, reject);

          });
        }
      });

      function replace_db(src, dist, id) {
        src.forEach(function (item) {
          replace_db_single(item, dist, id);
        });
      }

      function replace_db_single(item, dist, id) {
        var _id = id(item), flag = false;
        for (var i = 0, l = dist.length; i < l; i++) {
          if (_id == id(dist[i])) {
            dist[i] = item;
            flag = true;
            break;
          }
        }
        if (!flag) {
          dist.push(item);
        }
      }
      function delete_db(item, dist, id) {
        var _id = id(item);
        for (var i = 0, l = dist.length; i < l; i++) {
          if (_id == id(dist[i])) {
            dist.splice(i, 1);
            break;
          }
        }
      }
    }
  }
})();
