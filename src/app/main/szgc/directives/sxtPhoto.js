/**
 * Created by jiuyuong on 2016/3/4.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .directive('sxtPhoto',sxtPhoto);

  /** @ngInject */
  function sxtPhoto($timeout,$http,$cordovaCamera) {
    return {
      scope: {},
      link: link
    }

    function link(scope, element, attr, ctrl) {
      var options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 100,
        targetHeight: 100,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false,
        correctOrientation:true
      };

      var getP = function() {
        $cordovaCamera.getPicture (options).then (function (imageData) {
          var image = document.getElementById ('myImage');
          alert(imageData);
          image.src = "data:image/jpeg;base64," + imageData;
          element.append(image);
        }, function (err) {
          alert (err);
        });
      }
      getP();
      element.on('click',function(){
        getP();
      })
      //element.append('<video id="video" width="100%" height="100%"></video>');
      //var video = document.getElementById("video"),
      //  videoObj = { "video": true },
      //  errBack = function(error) {
      //    console.log("Video capture error: ", error.code);
      //  };

      // 设置video监听器
      //if(navigator.getUserMedia) { // Standard
      //  navigator.getUserMedia(videoObj, function(stream) {
      //    video.src = stream;
      //    video.play();
      //  }, errBack);
      //} else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
      //  navigator.webkitGetUserMedia(videoObj, function(stream){
      //    video.src = window.webkitURL.createObjectURL(stream);
      //    video.play();
      //  }, errBack);
      //}
      scope.$on('$destroy',function(){
        //element.remove();
      })
    }
  }
})();
