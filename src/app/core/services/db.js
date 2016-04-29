/**
 * Created by jiuyuong on 2016/4/28.
 */
(function(){
  'use strict';

  angular
    .module('app.core')
    .provider('db',pouchDB)
/** @ngInject */
  function pouchDB() {
  var self = this;
  self.methods = {
    destroy: 'qify',
    put: 'qify',
    post: 'qify',
    get: 'qify',
    remove: 'qify',
    bulkDocs: 'qify',
    bulkGet: 'qify',
    allDocs: 'qify',
    putAttachment: 'qify',
    getAttachment: 'qify',
    removeAttachment: 'qify',
    query: 'qify',
    viewCleanup: 'qify',
    info: 'qify',
    compact: 'qify',
    revsDiff: 'qify',
    changes: 'eventEmitter',
    sync: 'eventEmitter',
    replicate: {
      to: 'eventEmitter',
      from: 'eventEmitter'
    },
    add:function(){
      console.log('add',this,arguments);
    }
  };

  self.$get = function ($window, $q) {
    var pouchDBDecorators = {
      qify: function (fn) {
        return function () {
          return $q.when(fn.apply(this, arguments));
        }
      },
      eventEmitter: function (fn) {
        return function () {
          var deferred = $q.defer();
          var emitter = fn.apply(this, arguments)
            .on('change', function (change) {
              return deferred.notify({
                change: change
              });
            })
            .on('paused', function (paused) {
              return deferred.notify({
                paused: paused
              });
            })
            .on('active', function (active) {
              return deferred.notify({
                active: active
              });
            })
            .on('denied', function (denied) {
              return deferred.notify({
                denied: denied
              });
            })
            .on('complete', function (response) {
              return deferred.resolve(response);
            })
            .on('error', function (error) {
              return deferred.reject(error);
            });
          emitter.$promise = deferred.promise;
          return emitter;
        };
      }
    };

    function wrapMethods(db, methods, parent) {
      for (var method in methods) {
        var wrapFunction = methods[method];

        if (!angular.isString(wrapFunction)) {
          wrapMethods(db, wrapFunction, method);
          continue;
        }

        if(angular.isFunction(wrapFunction)){
          db[method] = wrapFunction;
          continue;
        }

        wrapFunction = pouchDBDecorators[wrapFunction];

        if (!parent) {
          db[method] = wrapFunction(db[method]);
          continue;
        }

        db[parent][method] = wrapFunction(db[parent][method]);
      }
      return db;
    }

    return function pouchDB(name, options) {
      var db = new $window.PouchDB(name, options);
      return wrapMethods(db, self.methods);
    };
  };
}

})();
