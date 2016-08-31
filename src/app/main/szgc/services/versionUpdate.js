/**
 * Created by leshuangshuang on 16/4/15.
 */
(function() {
  'use strict';

  angular
    .module('app.szgc')
    .service('versionUpdate', versionUpdate);

  function versionUpdate($mdDialog, $cordovaFileTransfer, $cordovaAppVersion, $window,$http) {

    var version = '1.7.5';
    this.version = version;
    function versionToNumber(version) {
      var n = version.split('.');
      var s = toNum(n[0])+toNum(n[1])+toNum(n[2]);
      return parseInt(s);
    }
    function toNum(n) {
      var r = parseInt(n);
      var s = '000'+new String(isNaN(r)?0:r)
      return s.substring(s.length-3);
    }
    this.check = function () {
      $http.get('http://vkde.sxtsoft.com/api/vkapi/Version')
        .then(function (data) {
          var serverAppVersion = data.data.vankeVersion;
          if (versionToNumber(version) < versionToNumber(serverAppVersion)) {
            var confirm = $mdDialog.confirm()
              .title('发现新版本'+serverAppVersion)
              .textContent('是否更新新版本？')
              .ok('更新!')
              .cancel('暂不更新');
            $mdDialog.show(confirm).then(function () {
              var u = $window.navigator.userAgent;
              var isAndroid = u.indexOf('Android') > -1 //|| u.indexOf('Linux') > -1; //android终端或者uc浏览器
              var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
              if (isAndroid) {
                window.location.replace("https://m.vanke.com/pcStore/detailsPhone/vkappcan10102_1");
              }
              if (isiOS) {
                window.location.href = "sxt://update";
              }
            });
          }
        });
    }
  }
})();
