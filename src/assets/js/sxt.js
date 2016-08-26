/**
 * Created by jiuyuong on 2016/1/21.
 */
if(!Array.prototype.find)
  Array.prototype.find = function(fn){
    for(var i= 0,l=this.length;i<l;i++){
      if(fn(this[i])===true){
        return this[i];
      }
    }
  }
window.sxt = (function(win)
{
  'use strict';

  var db,sxt;

  sxt = {
    version: '1.1.12',
    app: {
      appDir: appDir,
      serve: 'http://10.245.9.151:3000',
      api:'http://szdp.vanke.com:8088',
      logger:'http://localhost:46844/api/logger',
      //api:'http://10.245.9.118:8090',
      //api:'http://localhost:46844',
      getUrl: getUrl,
      download: download
    },
    connection:{
      isOnline:isOnline,
      getNetwork:getNetwork
    },
    cache:{
      db:getDb,
      get:getCache,
      set:setCache,
      getProfile:getProfile,
      setProfile:setProfile,
      removeProfile:removeProfile
    },
    angular:{

    }
  };

  return sxt;

  //是否在线
  function isOnline(){
    return true;
  }

  // 获取本地缓存路径
  function appDir(userid){
      return cordova.file.dataDirectory+'app'+(userid?'/'+userid:'');
  }

  // 获取下载完整地址
  function getUrl(url){
      return encodeURI(sxt.app.serve+url);
  }

  //下载远程至本地缓存
  function download(url, win, fail) {
    var versionTransFer = new FileTransfer ();
    versionTransFer.download (app.getUrl (url), app.appDir () + '/' + url, win, fail, false, {
      headers: {
        "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
      }
    });
  }

  //获取网络状态
  function getNetwork(){
    return 'online'
  }

  //获取DB
  function getDb(callback){


    if(db){ callback && callback(db);return;}

    if (!localStorage.customerRevision) {
      localStorage.customerRevision = -1;
    }

    db = new window.linq2indexedDB.DbContext('sxtdb.db',{
      version:1,
      definition: [{
        version: 1,
        objectStores: [
          { name: 'profile',objectStoreOptions: { autoIncrement: true, keyPath: "username"}},
          { name: 'profiles',objectStoreOptions: { autoIncrement: false, keyPath: "username"}},
          { name: 'syncs',objectStoreOptions: { autoIncrement: true,keyPath: "Id"}}
        ],
        indexes: [
          {objectStoreName: 'syncs',propertyName: "username",indexOptions: {unique: false,multirow: false}}
        ]
      }]
    },true);
    db.initialize().then(function(){
      callback && callback(db);
    });
  }

  //获取缓存
  function getCache(url,userid,win,fail){
    window.resolveLocalFileSystemURL(appDir(userid)+'/'+url,function(entry){
      entry.file(function(file){
        var reader = new FileReader();
        reader.onloadend = function(evt){
          win && win(evt.target.result);
        };
        reader.readAsText(file,'utf-8');
      },fail)
    },fail);
  }

  //存储至本地
  function setCache(url,content,userid,win,fail){
    window.resolveLocalFileSystemURL(appDir(userid),function(dir){
      dir.getFile(url, { create:true }, function(file) {
        file.createWriter(function(fileWriter) {
          fileWriter.seek(fileWriter.length);
          var blob = new Blob([content], {type:'text/plain'});
          fileWriter.write(blob);
          win && win();
        }, fail);
      },fail);
    },fail);
  }

  //获取登录人信息
  function getProfile(callback,user){
    return callback();
    getDb(function(db){
      if(user) {
        db.profiles.get(user.username).then(cb(callback),cb(callback,false));
      }
      else{
        db.profile.select().then(function(us){
          callback && callback(us.length?us[0]:null);
        },cb(callback));
      }
    })

  }

  function setProfiles(user,callback){
    return callback();
    getDb(function(db){
      db.profiles.get(user.username).then(function(user2){
        if(user2){
          db.profiles.update(user).then(cb(callback),cb(callback));
        }
        else{
          db.profiles.insert(user).then(cb(callback),cb(callback));
        }
      })
    });

  }

  function removeProfile(profile,callback){
    return callback();
    getDb(function(db) {
      db.profile.clear ().then (cb (callback), cb (callback));
    });
  }

  function cb(callback,b){
     return function (){
       console.log('cb',arguments);
       if(b===false)
        callback && callback();
       else
         callback && callback.call(this,Array.prototype.slice.call(arguments,0));
     }
  }

  function setProfile(user,callback){
    return callback();
    getDb(function(db) {
      console.log('setProfile', user);
      db.profile.select().then(function(data){
        if(data.length){
          if(data[0].username==user.username){
            db.profile.update(user).then(cb(callback),cb(callback))
          }
          else{
            db.profile.remove(data[0].username).then(function(){
              db.profile.insert(user).then(cb(callback),cb(callback))
            },cb(callback))
          }
        }
        else{
          db.profile.insert(user).then(cb(callback),cb(callback))
        }
      },function(er){
        console.log('insert user er', arguments);
      })
      //console.log('setProfile',db,user);
      //callback && callback();
    });
    setProfiles(user,function(){});
  }
})(window);
