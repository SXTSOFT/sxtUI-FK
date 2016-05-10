/**
 * Created by jiuyuong on 2016/5/6.
 */
(function () {
  'use strict';

  angular
    .module('app.xhsc')
    .factory('remotePack',remotePack);

  /** @ngInject */
  function remotePack(db,$q,$http,$rootScope,$cordovaFileTransfer,sxt) {
    function Pack(config) {
      var self = this;
      self.db= {};
      self.max = config.max||20;
      self.status = 0;

      for(var k in config.db){
        self[k] = config.db[k];
        self[k].db = db('Pack'+config._id+k);
      }
    }
    Pack.prototype.upload = function () {
      var self = this;
      if(!self.config || self.isDown)return;
      self.isUp = true;
      self.tasks = [];
      var when=[],dbs=[];
      for(var k in self){
        var m = self[k];
        if(m.db){
          dbs.push[m];
          when.push(m.db.findAll());
        }
      }
      $q.all(when).then(function (results) {
        var i = 0;
        results.forEach(function (r) {
          r.rows.forEach(function (t) {
            self.tasks.push({
              data:t,
              url:dbs[i].url,
              index:dbs[i].index||0
            })
          });
          i++;
        });
        self.tasks.sort(function (s1,s2) {
          return s1.index - s2.index;
        });
        self.upTask();
      });
    };
    Pack.prototype.getNexts = function () {
      var self = this,
        url,tasks=[],type;
      self.tasks.forEach(function (task) {
        if(task.completed || (task.try && task.try>3 ) ||(type && type=='file'))
          return;
        if(!url)
          url = task.url;

        if(url==task.url &&  tasks.length<self.max && (!type || type==task.type)){
          tasks.push(task);
        }
        if(!type)
          type = task.type;
      });
      return tasks;
    }
    Pack.prototype.upTask = function () {
      var self = this,
        tasks = self.getNexts();
      if(!tasks.length){
        self.isUp = false;
        self.completed = !!self.tasks.find(function (t) {
          return !t.completed;
        });
        $rootScope.$emit('pack' + self.config._id, {
          name: 'allcomplete',
          config: self.config
        });
        return;
      }

      var url=tasks[0].url,
        type = tasks[0].data.type;
      if(type === 'file'){
        $cordovaFileTransfer.upload(url,tasks[0].data.local).then(function () {
          tasks[0].completed = true;
          self.upTask();
        },function (err) {
          tasks[0].try = (tasks[0].try||0)+1;
          self.upTask();
        },function (progress) {
          tasks[0].progress = (progress.loaded / progress.total) * 100;
          // (progress.loaded / progress.total) * 100
        });
      }
      else{
        var data=[];
        tasks.forEach(function (item) {
          data.push(item);
        });
        $http.post(url,data).then(function () {
          tasks.forEach(function (task) {
            task.completed = true;
          });
          self.upTask();
        }).catch(function (err) {
          tasks.forEach(function (task) {
            task.try = (task.try||0)+1;
          });
          self.upTask();
        });
      }
    }

    var o = {
      packages:{},
      pack:function (config) {
        var pack = o.packages[config._id] = o.packages[config._id]||new Pack(config);
        return pack;
      }
    }
    return o;
  }
})();
