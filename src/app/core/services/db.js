/**
 * Created by jiuyuong on 2016/4/28.
 */
(function(){
  'use strict';

  angular
    .module('app.core')
    .provider('db',pouchDB);
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
    add:function () {
      var args = Array.prototype.slice.call(arguments);
      this.create(args);
    },
    addOrUpdate:function(obj){
      var self = this;
      if(obj._id){
        return self.get(obj._id).then(function(doc){
          obj._rev = doc._rev;
          return self.put(obj);
        }).catch(function(){
          return self.put(obj);
        });
      }
    },
    bulkAddOrUpdate:function(arr){
     var self=this;
     return this.findAll().then(function(o){
         var  rows= o.rows,tmp;
         arr.forEach(function(t){
            if (t._id){
              tmp=rows.find(function(e){ return t._id= e._id });
              if (tmp){
                t._rev=tmp._rev
              }
            }
         })
         return self.bulkDocs(arr);
      });
    },
    getOrAdd:function (obj) {
      var self = this;
      if(obj._id){
        return self.get(obj._id).then(function(doc){
          return doc;
        }).catch(function(){
          return self.put(obj).then(function () {
            return obj;
          });
        });
      }
    },
    update:function (obj) {
      var self = this;
      if(obj._id){
        return self.get(obj._id).then(function(doc){
          obj._rev = doc._rev;
          return self.put(obj);
        });
      }
      //this.create(Array.prototype.slice.call(arguments));
    },
    create:function(obj){
      if(!angular.isArray(obj)){
        obj = [obj];
      }
      obj.forEach(function (o) {
        if(!o._id)
          o._id = o.id;
      });
      return this.bulkDocs(obj);
    },
    delete:function (id) {
      var db = this;
      return db.get(id).then(function (doc) {
        return db.remove(doc);
      });
    },
    findAll:function (filter,startKey) {
      return this.allDocs({include_docs:true,startKey:startKey}).then(function (result) {
        var r = {
          "total_rows":result.total_rows,
          "offset":result.offset,
          "rows":[],
          "_id":result._id,
          "_rev":result._rev
        }
        for(var i=0,l=result.rows.length;i<l;i++){
          if(!filter || filter(result.rows[i].doc)!==false){
            r.rows.push(result.rows[i].doc);
          }
        }
        return r;
      })
    },
    find:function (filter) {
      return this.allDocs({include_docs:true}).then(function (result) {
        for(var i=0,l=result.rows.length;i<l;i++){
          if(!filter || filter(result.rows[i].doc)!==false){
            return result.rows[i].doc;
          }
        }
      })
    }
  };

  self.$get = $get;

  /** @ngInject */
  function $get($window, $q) {
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


        if(angular.isFunction(wrapFunction)){
          db[method] = wrapFunction;
          continue;
        }

        if (!angular.isString(wrapFunction)) {
          wrapMethods(db, wrapFunction, method);
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
      if($window.cordova){
        options = options||{};
        options.adapter = 'websql';
        options.iosDatabaseLocation = 'default';
      }
      var db = new $window.PouchDB(name, options);
      return wrapMethods(db, self.methods);
    };
  };

  function toDoc(doc) {
    if(doc instanceof Error)
      return doc;
    return doc;
  }
  function now() {
    return new Date().toISOString();
  }

  function addTimestamps(object) {
    object.updatedAt = now();
    object.createdAt = object.createdAt || object.updatedAt

    if (object._deleted) {
      object.deletedAt = object.deletedAt || object.updatedAt
    }

    return object
  }
}

})();
