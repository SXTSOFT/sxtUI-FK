/**
 * Created by zhangzhaoyong on 16/2/15.
 */
(function () {
  'use strict';

  angular
    .module('app.szgc')
    .directive('sxtImages', sxtImagesDirective);

  /** @ngInject */
  function sxtImagesDirective(FileUploader,api, authToken,sxt,$q,$timeout){
    return {
      restrict: 'E',
      require: "?ngModel",
      scope: {
        gid: '=ngModel',
        project: '=',
        edit:'@',
        files: '='
      },
      controller: function ($scope) {

        var dataURItoBlob = function (dataURI) {
          var byteString;
          if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
          else
            byteString = unescape(dataURI.split(',')[1]);
          var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
          var ia = new Uint8Array(byteString.length);
          for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }

          return new Blob([ia], {
            type: mimeString
          });
        };

        var resizeFile = function (file) {
          var deferred = $q.defer();
          var img = new Image();
          try {
            var reader = new FileReader();
            reader.onload = function (e) {
              img.src = e.target.result;
              img.onload = function () {
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                var MAX_WIDTH = 800;
                var MAX_HEIGHT = 800;
                var width = img.width;
                var height = img.height;
                if (width > height) {
                  if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                  }
                } else {
                  if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                  }
                }
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                var dataURL = canvas.toDataURL('image/jpeg');
                var blob = dataURItoBlob(dataURL);

                deferred.resolve(blob);
              }
            };
            reader.readAsDataURL(file);
          } catch (e) {
            deferred.resolve(e);
          }
          return deferred.promise;

        };

        var uploader = $scope.uploader = new FileUploader({
          headers: { 'Authorization': authToken.getToken() },
          autoUpload: false,
          onSuccessItem: function (item, response, status, headers) {
            if (status==200) {
              $scope.imgOK = true;
            }else{
              $scope.imgFail = true;
            }
            $timeout(function(){
              $scope.imgOK = false;
              $scope.imgFail = false;
            },1000)
            item.file.Id = response.Files[0].Id;
            item.file.Url = response.Files[0].Url;
            item.file.Remark = response.Files[0].Remark;
            if (angular.isArray($scope.files))
              $scope.files.push(response.Files[0].Url);
            item.remove = function () {
              var me = this;
              api.szgc.FilesService.delete(me.file.Id).then(function (r) {
                uploader.queue.splice(uploader.queue.indexOf(me), 1);
              });
            }
          },
          onAfterAddingFile: function (item) {
            if (item.file.type.indexOf('image/') != -1) {
              resizeFile(item._file).then(function (blob_data) {
                item._file = blob_data;
                $scope.ImageSize = blob_data.size/1024/1024
                console.log('$scope.ImageSize',$scope.ImageSize)
                item.upload();
              })
            }
            else {
              item.upload();
            }

          }
        });
        $scope.editPic = function (file) {

        }
        $scope.remove = function ($event, file) {
          $scope.imgOK = false;
          $event.preventDefault();
          file.remove();
        }
      },
      template: '<div  style="color: red;padding-bottom: 0px;padding-left: 10px;padding-top: 0px;" ng-show="imgOK">上传成功!</div><div  style="color: red;" ng-show="imgFail">上传失败!</div> <div class="imageEdit"><div class="edititem" ng-repeat="item in uploader.queue" uib-tooltip="{{item.file.Remark}}"><div ng-if="!item.isSuccess" class="proc" >{{item.progress}}%</div><img style="height:150px;;margin:0 5px;" ng-click="editPic(item.file)" ng-src="{{item.file.Url|fileurl}}" class="img-thumbnail" /><div class="action"><a class="btn btn-white btn-xs" ng-if="edit" ng-click="remove($event,item)"><i class="fa fa-times"></i></a></div></div>\
<div  style="float:left;padding:5px;" ng-if="edit"><div class="file-drop-zone" style="height:140px;margin:0 5px;line-height:140px; padding:5px;" nv-file-drop uploader="uploader">\
            <input type="file" nv-file-select uploader="uploader" multiple ng-click ="inputChange()"; />\
        </div>\
</div></div>',
      link: function (scope, element, attrs, ngModel) {
        var uploader = scope.uploader;
        var gid;
        scope.$watch('gid', function () {
          if (gid && gid == scope.gid) return;
          gid = scope.gid;

          scope.inputChange = function(){
            scope.imgOK = false;
            scope.imgFail = false;
          }

          api.szgc.FilesService.group(scope.gid || '').then(function (result) {
            var data = result.data;
            if (data.Files) {
              data.Files.forEach(function (att) {
                if (angular.isArray(scope.files))
                  scope.files.push(att.Url);
              });
            }
          })
        });
      }
    }
  }

})();
