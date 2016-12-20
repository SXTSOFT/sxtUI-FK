/**
 * Created by leshuangshuang on 16/4/15.
 */
(function() {
  'use strict';

  angular
    .module('app.szgc')
    .service('versionUpdate', versionUpdate);


  function versionUpdate($mdDialog, $window,$http ,sxt) {

    var version = '1.9.16.19',versionOld = version;
    this.version = version;
    var self = this;
    function versionToNumber(version) {
      var n = version.split('.');
      var s = toNum(n[0])+toNum(n[1])+toNum(n[2])+toNum(n[3]);
      return parseInt(s);
    }
    function versionToNumber2(version) {
      var n = version.split('.');
      var s = toNum(n[0])+toNum(n[1])+toNum(n[2]);
      return parseInt(s);
    }
    function toNum(n) {
      var r = parseInt(n);
      var s = '000'+new String(isNaN(r)?0:r);
      return s.substring(s.length-3);
    }
    this.check = function () {
      return $http.get(sxt.app.version+'/version.json')
        .then(function (data) {
          var serverAppVersion = data.data.version || data.data.vankeVersion;
          if (versionToNumber2(version) < versionToNumber2(serverAppVersion)) {
            var confirm = $mdDialog.confirm()
              .title('发现新版本' + serverAppVersion)
              .htmlContent(data.data.vankeLog || '')
              .ok('更新!')
              .cancel('暂不更新');
            $mdDialog.show(confirm).then(function () {
              var u = $window.navigator.userAgent;
              var isAndroid = u.indexOf('Android') > -1;
              var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
              if (isAndroid) {
                window.location.replace("https://m.vanke.com/pcStore/detailsPhone/vkappcan10102_1");
              }
              if (isiOS) {
                window.location.href = "sxt://update";
              }
            });
          }
          else if (versionToNumber(version) < versionToNumber(serverAppVersion)) {
            version = serverAppVersion;
            self.version = versionOld + '(' + serverAppVersion + '正在更新)';
            sxt.download(function () {
              self.version = versionOld + '(' + serverAppVersion + '重启生效)';
            },function () {
              version = versionOld;
            });
          }
        });
    }
  }
})();
