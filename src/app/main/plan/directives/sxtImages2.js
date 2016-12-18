/**
 * Created by emma on 2016/12/16.
 */
(function(){
  'use strict';

  angular
    .module('app.plan')
    .directive('sxtImages2',sxtImages2)

  /**@ngInject*/
  function sxtImages2(FileUploader,utils,tokenInjector,$q){
    return {
        restrict: 'E',
        require: "?ngModel",
        scope: {
            gid: '=ngModel',
            img:'='
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
                        $scope.img = img.src;
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
                headers: { 'Authorization': tokenInjector.getToken() },
                autoUpload: false,
                //onSuccessItem: function (item, response, status, headers) {
                //
                //    if (status == 200) {
                //        $scope.imgOK = true;
                //
                //    } else {
                //        $scope.imgFail = true;
                //    }
                //
                //    item.file.Id = response.Files[0].Id;
                //    item.file.Url = response.Files[0].Url;
                //    item.file.Remark = response.Files[0].Remark;
                //    if (angular.isArray($scope.files))
                //        $scope.files.push(response.Files[0].Url);
                //    item.remove = function () {
                //        var me = this;
                //
                //        FilesService.delete(me.file.Id).then(function (r) {
                //            var ix = uploader.queue.indexOf(me);
                //            uploader.queue.splice(ix, 1);
                //            if (angular.isArray($scope.files))
                //                $scope.files.splice(ix, 1);
                //        });
                //    }
                //    item.save = function () {
                //        var me = this;
                //        FilesService.update(me.file).then(function () {
                //            me.isEditing = false;
                //        })
                //    }
                //    if ($scope.single && uploader.queue.length > 1) {
                //        uploader.queue[0].remove();
                //    }
                //},
                onAfterAddingFile: function (item) {
                    //console.log(JSON.stringify(item))
                    if (!$scope.single && item.file.type.indexOf('image/') != -1) {
                        resizeFile(item._file).then(function (blob_data) {
                          console.log(blob_data)
                            item._file = blob_data;
                            $scope.ImageSize = blob_data.size / 1024 / 1024
                            console.log('$scope.ImageSize', $scope.ImageSize)
                           // item.upload();
                        })
                      console.log($scope)
                    }
                    else {
                       // item.upload();
                    }

                },
              onBeforeUploadItem :function(item){
                //console.log(item)
              }
            });
            //$scope.editPic = function (file) {
            //    if (!$scope.edit || utils.isApp()) return;
            //    var url;
            //    if (file.Url.indexOf('data:image/png') != -1) {
            //        url = file.Url && file.Url.substring(0, 1) == '~' ? file.Url.substring(1) : file.Url;
            //
            //    } else {
            //        url = appConfig.apiUrl + (file.Url && file.Url.substring(0, 1) == '~' ? file.Url.substring(1) : file.Url);
            //    }
            //    utils.imgEdit(url.replace('/s_', '/'), function (data) {
            //        FilesService.update({ Id: file.Id, file, Url: data }).then(function (result) {
            //            file.Url = result.data.Url;
            //            //console.log('scope', data,file.Id)
            //            // uploader.queue.push(item);
            //            utils.alert('更新成功');
            //        });
            //    });
            //}
            $scope.remove = function ($event, file) {
                $scope.imgOK = false;
                $event.preventDefault();
                //file.remove();
                $scope.img = null;
                //utils.confirm(null, '确定删除些图片吗？', function () {
                //    file.remove();
                //});
            }
        },
        templateUrl: "app/main/plan/directives/sxt-images2.html",
        link: function (scope, element, attrs, ngModel) {
            var uploader = scope.uploader;
            var gid;
          //console.log(scope)
          scope.$watch('gid',function(){
            if (gid && gid == scope.gid) return;
            uploader.queue.length = 0;
            gid = scope.gid;

                if (gid != '') {
                  //console.log(uploader.queue)
                    //angular.forEach(uploader.queue, function (item) { item.url = uploader.url });
                }
                scope.inputChange = function () {
                    scope.imgOK = false;
                    scope.imgFail = false;
                }
          })
            //scope.$watch('gid', function () {
            //    if (gid && gid == scope.gid) return;
            //    uploader.queue.length = 0;
            //    gid = scope.gid;
            //    //if (gid != '') {
            //    //    uploader.url = appConfig.apiUrl + '/api/Files/' + gid + '?project=' + (scope.project || '');
            //    //    angular.forEach(uploader.queue, function (item) { item.url = uploader.url });
            //    //}
            //    scope.inputChange = function () {
            //        scope.imgOK = false;
            //        scope.imgFail = false;
            //    }
            //
            //    //FilesService.group(scope.gid || '').success(function (data) {
            //    //    if (gid != data.Group) {
            //    //        gid = scope.gid = data.Group;
            //    //        uploader.url = appConfig.apiUrl + '/api/Files/' + gid + '?project=' + (scope.project || '');
            //    //        angular.forEach(uploader.queue, function (item) { item.url = uploader.url });
            //    //    }
            //    //    if (data.Files) {
            //    //        if (angular.isArray(scope.files)) {
            //    //            scope.files = [];
            //    //        }
            //    //        data.Files.forEach(function (att) {
            //    //            if (angular.isArray(scope.files))
            //    //                scope.files.push(att.Url);
            //    //            var item = {
            //    //                file: {
            //    //                    Id: att.Id,
            //    //                    name: att.FileName,
            //    //                    size: att.FileSize,
            //    //                    Url: att.Url,
            //    //                    UserID: att.UserID,
            //    //                    Remark: att.Remark,
            //    //                    CreateDate: att.CreateDate,
            //    //                    PartionID: att.PartionID
            //    //                },
            //    //                remove: function () {
            //    //                    var me = this;
            //    //                    FilesService.delete(me.file.Id).then(function (r) {
            //    //                        uploader.queue.splice(uploader.queue.indexOf(me), 1);
            //    //                    });
            //    //                },
            //    //                save: function () {
            //    //                    var me = this;
            //    //                    FilesService.update(me.file).then(function () {
            //    //                        me.isEditing = false;
            //    //                    })
            //    //                },
            //    //                progress: 100,
            //    //                isServer: true,
            //    //                isSuccess: true,
            //    //                isCancel: false,
            //    //                isError: false,
            //    //                isReady: false,
            //    //                isUploading: true,
            //    //                isUploaded: true,
            //    //                index: null
            //    //            };
            //    //            scope.setParDes && scope.setParDes(att.PartionID, item);
            //    //            uploader.queue.push(item);
            //    //        });
            //    //    }
            //    //})
            //});
        }
    }
  }
})();
