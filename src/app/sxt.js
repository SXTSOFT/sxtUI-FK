/**
 * Created by jiuyuong on 2016/1/21.
 */
window.sxt = (function(win)
{
  'use strict';

  var db,sxt;

  sxt = {
    version: '1.1.12',
    app: {
      appDir: appDir,
      serve: 'http://10.245.9.151:3000/',
      getUrl: getUrl,
      download: download
    },
    connection:{
      getNetwork:getNetwork
    },
    cache:{
      db:getDb,
      get:getCache,
      set:setCache,
      getProfile:getProfile,
      setProfile:setProfile
    },
    angular:{

    }
  };

  return sxt;

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
  function getDb(){
    if(db)return db;
    db = openDatabase('sxtdb', '1.0', 'Sxt app DB', 2 * 1024 * 1024);
    db.transaction(function(tx){
      tx.executeSql('CREATE TABLE IF NOT EXISTS Profile (pf)');//当前人信息库
      tx.executeSql('CREATE TABLE IF NOT EXISTS Profiles (id unique,pf)');//所有登录过的用户信息库
      tx.executeSql('CREATE TABLE IF NOT EXISTS Syncs (id unique,log ,path)');//同步库
    });
    return db;
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
    getDb().transaction(function(tx){
      if(user){
        tx.executeSql ('SELECT * FROM Profiles WHERE id =?', [user.username], function (tx, results) {
          for(var i= 0, l = results.rows.length;i<l;i++) {
            var p = JSON.parse(results.rows[i].pf);
            if(p && p.password == user.password){
              callback(results.rows[i].pf);
              return;
            }
          }
          callback();
        }, null);
      }
      else {
        tx.executeSql ('SELECT * FROM Profile', [], function (tx, results) {
          if (results.rows.length) {
            callback (results.rows[0].pf);
          }
          else {
            callback ();
          }
        }, null);
      }
    })
  }

  function setProfile(user,callback){
    getDb().transaction(function(tx){
      tx.executeSql('DELETE FROM Profile', [], function(tx, results){
        tx.executeSql('INSERT INTO Profile (pf) VALUES(?)',[JSON.stringify(user)],function(tx,results){
          tx.executeSql('DELETE FROM Profiles WHERE id=?',[user.username],function(tx,results){
            tx.executeSql('INSERT INTO Profiles (id,pf) VALUES(?,?)',[user.username,JSON.stringify(user)],function(tx,results){
              callback && callback();
            });
          });
        });
      })
    },null);
  }
})(window);
