/**
 * Created by leshuangshuang on 16/4/15.
 */
(function() {
  'use strict';

  angular
    .module('app.szgc')
    .service('versionUpdate', versionUpdate);

  function versionUpdate($ionicLoading, $cordovaFileTransfer, $cordovaFile, $cordovaFileOpener2){

    //服务器上保存版本信息
    $http.get('http://localhost/app/ver.json')
      .then(function(data){
        var serverAppVersion = data.data.verInfo;//服务器 版本
        console.log("====>>服务器"+serverAppVersion);
        $cordovaAppVersion.getVersionNumber().then(function(version) {
          console.log("version=====本机>>>"+version+"====>>服务器"+serverAppVersion);
          if (version != serverAppVersion) {
            $ionicLoading.show({
              template: "已经下载：0%"
            });
            var url = "http://192.168.1.77:8080/app/android-debug.apk";
            var targetPath = "file:///mnt/sdcard/Download/android-debug.apk";
            var trustHosts = true
            var options = {};
            $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
              $cordovaFileOpener2.open(targetPath, 'application/vnd.android.package-archive'
              ).then(function () {
              }, function (err) {
              });
              $ionicLoading.hide();
            }, function (err) {
              alert('下载失败');
            }, function (progress) {
              $timeout(function () {
                var downloadProgress = (progress.loaded / progress.total) * 100;
                $ionicLoading.show({
                  template: "已经下载：" + Math.floor(downloadProgress) + "%"
                });
                if (downloadProgress > 99) {
                  $ionicLoading.hide();
                }
              })
            });
          }
        });
      });




}



})()
