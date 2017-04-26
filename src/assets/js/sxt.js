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
window.sxt = (function(win,angular)
{
  'use strict';

  var sxt,js = 'app.js';

  sxt = {
    js:js,
    requireSSL:true,
    version: '1.1.12',
    app: {
      appDir: appDir,
      serve: 'http://10.245.9.151:3000',
      api:'http://szdp.vanke.com:8088',
      //api:'http://10.245.9.116:8090',
      //api:'http://10.245.9.89:8088',
      //api:'http://vkde.sxtsoft.com',
      //api:'http://localhost:46844',
      version:'https://app.ricent.com/vanke'
    },
    download:download
  };

  angular.element(document).ready(function () {
    if (win.cordova) {
      document.addEventListener('deviceready', function () {
        load();
      }, false);
    }
    else {
      bootstrap();
    }
  });

  return sxt;

  //是否在线
  // 获取本地缓存路径
  function appDir(dir){
      return cordova.file.dataDirectory+(dir===true?'':js);
  }


  //下载远程至本地缓存
  function download(win, fail, progress) {
    if(typeof FileTransfer === 'undefined') return;
    $('#loading').html('首次进入初始化中');
    var versionTransFer = new FileTransfer ();
    versionTransFer.onprogress = function (progressEvent) {
      var ps = (progressEvent.loaded * 100 / progressEvent.total)+'%';
      $('#loading').html('首次进入初始化中('+ps+')');
      progress && progress(ps);
    };
    versionTransFer.download (sxt.app.version+'/'+js, appDir(true)+'bak_'+js, function () {
      try {
        resolveLocalFileSystemURL(appDir(true), function (fileSystem) {
          fileSystem.getFile('bak_'+js, {create: false}, function (fileEntry) {
            resolveLocalFileSystemURL(appDir(true), function (newFileEntry) {
              fileEntry.moveTo(newFileEntry, js, function (result) {
                win(result);
              }, fail);
            }, fail);
          }, fail);
        }, fail);
      } catch (e) {
        fail && fail(e);
      }
      //win();
    }, fail, false, {
      headers: {
        "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
      }
    });
  }


  //获取缓存
  function getCache(win,fail){
    window.resolveLocalFileSystemURL(appDir(),function(entry){
      entry.file(function(file){
        var reader = new FileReader();
        reader.onloadend = function(evt){
          win && win(evt.target.result);
        };
        reader.readAsText(file,'utf-8');
      },fail)
    },fail);
  }

  function load() {
    evalJS(function () {
      download(function () {
        evalJS(function () {
          alert('-- 请检查网络 -- ')
        })
      },fail)
    });
  }
  function evalJS(fail) {
    getCache(function (r) {
      try {
        win.eval(r);
        bootstrap();
      }catch(ex){
        fail(ex.message || ex);
      }
    },fail);
  }

  function fail(err) {
    alert(err||'发生错误');
  }

  function bootstrap() {
    angular.bootstrap(document, ['sxt']);
  }

})(window,angular);
