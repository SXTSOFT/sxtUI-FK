/**
 * Created by jiuyuong on 2016/4/26.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .factory('Db',Db);
  /** @ngInject */
  function Db(pouchDB,sxt,$window) {


    var dbs = {};
    bindDb('area', 0, 'me/area');
    return dbs;

    function bindDb(name, flag, remote) {
      var local = pouchDB(name),
        remote = pouchDB('http://localhost:5984/areas',{
          ajax:{
            withCredentials:false
          }
        }),
        sync, syncOpt = {
          live: true,
          retry: true
        };
      if (!flag) {
        sync = local.sync(remote, syncOpt);
      }
      else if (flag == 1) {
        sync = local.replicate.from(remote, syncOpt);
      }
      else {
        sync = local.replicate.to(remote, syncOpt);
      }
      sync.on('change', function (info) {
        // handle change
        console.log('change',info);
      }).on('paused', function (err) {
        // replication paused (e.g. replication up to date, user went offline)
        console.log('paused',err);
        //sync.cancel();
      }).on('active', function () {
        console.log('active','active');
        // replicate resumed (e.g. new changes replicating, user went back online)
      }).on('denied', function (err) {
        console.log('denied',err);
        // a document failed to replicate (e.g. due to permissions)
      }).on('complete', function (info) {
        console.log('complete',info);
        // handle complete
      }).on('error', function (err) {
        console.log('error',err);
        // handle error
      });
      var db = {
        local: local,
        remote: remote,
        sync: sync
      };
      dbs[name] = local;
      dbs[name + 'Context'] = db;
    }
  }
})();
