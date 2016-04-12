/**
 * Created by leshuangshuang on 16/4/12.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .controller('fileDownController',fileDownController);

  /** @ngInject */
  function fileDownController($scope, $timeout, $cordovaFileTransfer){

    var url = "http://cdn.wall-pix.net/albums/art-space/00030109.jpg";
    var targetPath = cordova.file.documentsDirectory + "testImage.png";
    var trustHosts = true;
    var options = {};

    $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
      .then(function(result) {
        // Success!
        console.log('点击了我');

      }, function(err) {
        // Error
      }, function (progress) {
        $timeout(function () {
          $scope.downloadProgress = (progress.loaded / progress.total) * 100;
        });
      });
};
})();
