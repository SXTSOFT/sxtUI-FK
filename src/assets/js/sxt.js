/**
 * Created by jiuyuong on 2016/1/21.
 */
(function(){
  'use strict';
  if(!Array.prototype.find) {
    Array.prototype.find = function (fn) {
      for (var i = 0, l = this.length; i < l; i++) {
        if (fn(this[i],i,this) === true) {
          return this[i];
        }
      }
    };
  }
  Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "h+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
})();
// (function(win) {
//   'use strict';
//   win.sxt = {
//     version: '1.1.12',
//     app: {
//       api:'http://emp.chngalaxy.com:9091',
//       // api: 'http://10.0.9.79:7091',
//
//       fs:'http://emp.chngalaxy.com:9090'
//       // fs:'http://10.0.9.79:7090'
//     },
//     angular:{
//
//     }
//   };
// })(window);
//


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
       api:'http://vkde.sxtsoft.com:9091',
       fs:'http://vkde.sxtsoft.com:9090',
      //api:'http://emp.chngalaxy.com:9091',
      //fs:'http://emp.chngalaxy.com:9090',
      version:'http://app.ricent.com/galaxy'
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
