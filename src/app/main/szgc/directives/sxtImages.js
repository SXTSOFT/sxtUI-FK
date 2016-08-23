/**
 * Created by zhangzhaoyong on 16/2/15.
 */
(function () {
  'use strict';

  angular
    .module('app.szgc')
    .directive('sxtImages', sxtImagesDirective);

  /** @ngInject */
  function sxtImagesDirective(api, xhUtils,sxt,$cordovaCamera,$window,$q){
    return {
      restrict: 'E',
      require: "?ngModel",
      scope: {
        gid: '=ngModel',
        project: '=',
        edit:'@',
        files: '='
      },
      template: '<div  style="color: red;padding-bottom: 0px;padding-left: 10px;padding-top: 0px;" ng-show="imgOK">上传成功!</div><div  style="color: red;" ng-show="imgFail">上传失败!</div> <div class="imageEdit"><div class="edititem"  ng-repeat="item in files" ><img style="height:150px;;margin:0 5px;" ng-src="{{item.Url|fileurl}}" class="img-thumbnail" /><div class="action"><md-button class="md-fab md-mini"  ng-if="edit"  ng-click="remove($event,item)"><md-icon md-font-icon="icon-delete" ></md-icon></md-button></div></div>\
<div  style="float:left;padding:5px;" ng-if="edit"><div class="file-drop-zone" layout="column" layout-align="space-around center" style="height:140px;margin:0 5px;line-height:140px; padding:5px;border-width:1px;" >\
<md-button ng-click ="inputChange(0)" class="md-raised">照片库</md-button>\
<md-button ng-click ="inputChange(1)" class="md-raised">拍照</md-button>\
        </div>\
</div></div>',
      link: function (scope, element, attrs, ngModel) {
        var gid;
        scope.$watch('gid', function () {
          if (gid && gid == scope.gid) return;
          gid = scope.gid;
          scope.files = [];
          scope.remove = function ($event,item) {
            api.szgc.FilesService.delete(item.Id).then(function () {
              scope.files.splice(scope.files.indexOf(item),1);
              api.uploadTask(function (up) {
                return up._id==item.Id;
              },null)
            });
          }
          scope.inputChange = function(s) {
            $cordovaCamera.getPicture({
              quality: 50,
              destinationType: 0,
              sourceType: s,
              allowEdit: false,
              encodingType: 0,
              saveToPhotoAlbum: (s===0? false : true),
              correctOrientation: true
            }).then(function (base64) {
              if (base64) {
                compress("data:image/jpeg;base64," + base64, function (newBase64) {
                  var att = {
                    Id: sxt.uuid(),
                    GroupId: scope.gid,
                    Url: newBase64
                  };
                  api.szgc.FilesService.post(att);
                  var d = new Date();
                  api.uploadTask({
                    _id: att.Id,
                    name: '照片 (' + d.getMonth() + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ')'
                  });
                  scope.files.push(att);
                })
              }
            }, function (err) {
            });
          }

          api.szgc.FilesService.group(scope.gid || '').then(function (result) {
            var data = result.data;
            if (data.Files) {
              data.Files.forEach(function (att) {
                  scope.files.push(att);
              });
            }
          });
        });
      }
    }

    function compress(base64,callback){
      var image = new Image();
      image.onload = function () {
        var srcWidth,
          srcHeight,
          ctx = $window.document.createElement('canvas');
        if(image.width>600 || image.height>600){
          var rd = 600/Math.max(image.width,image.height);
          srcWidth = image.width*rd;
          srcHeight = image.height*rd;
        }
        else{
          srcWidth = image.width;
          srcHeight = image.height;
        }
        ctx.width = srcWidth;
        ctx.height = srcHeight;
        ctx.getContext("2d").drawImage(image, 0, 0,image.width,image.height,0,0,srcWidth,srcHeight);
        callback(ctx.toDataURL('image/jpeg',1));
      };
      image.src = base64;
    }
  }

})();
