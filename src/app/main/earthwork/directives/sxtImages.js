/**
 * Created by HuangQingFeng on 2016/11/24.
 */

(function (angular, undefined) {
  'use strict';
  angular.module('app.earthwork')
    .controller('FilesCtrl',FilesCtrl)
    .directive('sxtImages2',sxtImages2)

  /**@ngInject*/
  function FilesCtrl($scope, FileUploader, FilesService, tokenInjector, utils, appConfig, $q){
    var dataURItoBlob = function (dataURI) {
      // base64转换/ url编码数据组件在一个字符串保持原始二进制数据
      var byteString;
      if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
      else
        byteString = unescape(dataURI.split(',')[1]);

      // separate out the mime component/分离出的MIME部件
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      // 将字符串的字节写入类型数组
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

            //使用画布调整图像的大小
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

            //调整图像的使用canvaschange的dataurl为BLOB数据上传到服务器
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
      onSuccessItem: function (item, response, status, headers) {
        console.log('-----')
        item.file.Id = response.Files[0].Id;
        item.file.Url = response.Files[0].Url;
        item.file.Remark = response.Files[0].Remark;
        console.log('status', status)
        if (angular.isArray($scope.files))
          $scope.files.push(response.Files[0].Url);
        item.remove = function () {
          var me = this;
          FilesService.delete(me.file.Id).then(function (r) {
            uploader.queue.splice(uploader.queue.indexOf(me), 1);
          });
        }
      },

      onAfterAddingFile: function (item) {
        if (item.file.type.indexOf('image/') != -1) {
          resizeFile(item._file).then(function (blob_data) {
            item._file = blob_data
            $scope.ImageSize = blob_data.size / 1024 / 1024
            console.log('$scope.ImageSize', $scope.ImageSize)
            item.upload();
          })
        }
        else {
          item.upload();
        }
      },
    });
    var gid;
    $scope.$watch(function () { return $scope.gid; }, function () {
      if (gid && gid == $scope.gid) return;
      if ($scope.gid == '-1') { uploader.queue.length = 0; $scope.gid = ''; }
      gid = $scope.gid;

      if (gid != '') {
        uploader.url = appConfig.apiUrl + '/api/Files/' + gid;
        angular.forEach(uploader.queue, function (item) { item.url = uploader.url });
      }
      uploader.queue.length = 0;

      FilesService.group($scope.gid || '').success(function (data) {
        if (gid != data.Group) {
          gid = $scope.gid = data.Group;
          uploader.url = appConfig.apiUrl + '/api/Files/' + gid;
          angular.forEach(uploader.queue, function (item) { item.url = uploader.url });
        }
        if (data.Files) {
          if (angular.isArray($scope.files)) {
            $scope.files = [];
          }
          data.Files.forEach(function (att) {
            if (angular.isArray($scope.files))
              $scope.files.push(att.Url);

            uploader.queue.push({
              file: {
                Id: att.Id,
                name: att.FileName,
                size: att.FileSize,
                Url: att.Url,
                UserID: att.UserID,
                Remark: att.Remark,
                CreateDate: att.CreateDate
              },
              remove: function () {
                var me = this;
                FilesService.delete(me.file.Id).then(function (r) {
                  uploader.queue.splice(uploader.queue.indexOf(me), 1);
                });
              },
              progress: 100,
              isServer: true,
              isSuccess: true,
              isCancel: false,
              isError: false,
              isReady: false,
              isUploading: true,
              isUploaded: true,
              index: null
            });
          });
        }
      })
    });
  }

  /**@ngInject*/
  function sxtImages2($scope,$timeout, sxt, utils, api, FileUploader, FilesService, tokenInjector, appConfig, $q) {
    return {
      restrict: 'E',
      require: "?ngModel",
      scope: {
        gid: '=ngModel',
        project: '=',
        edit: '@',
        files: '=',
        single: '@',
        isPartions: '@'
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
          headers: {'Authorization': tokenInjector.getToken()},
          autoUpload: false,
          onSuccessItem: function (item, response, status, headers) {

            if (status == 200) {
              $scope.imgOK = true;

            } else {
              $scope.imgFail = true;
            }

            item.file.Id = response.Files[0].Id;
            item.file.Url = response.Files[0].Url;
            item.file.Remark = response.Files[0].Remark;
            if (angular.isArray($scope.files))
              $scope.files.push(response.Files[0].Url);
            item.remove = function () {
              var me = this;

              FilesService.delete(me.file.Id).then(function (r) {
                var ix = uploader.queue.indexOf(me);
                uploader.queue.splice(ix, 1);
                if (angular.isArray($scope.files))
                  $scope.files.splice(ix, 1);
              });
            }
            item.save = function () {
              var me = this;
              FilesService.update(me.file).then(function () {
                me.isEditing = false;
              })
            }
            if ($scope.single && uploader.queue.length > 1) {
              uploader.queue[0].remove();
            }
          },
          onAfterAddingFile: function (item) {
            if (!$scope.single && item.file.type.indexOf('image/') != -1) {
              resizeFile(item._file).then(function (blob_data) {
                item._file = blob_data;
                $scope.ImageSize = blob_data.size / 1024 / 1024
                console.log('$scope.ImageSize', $scope.ImageSize)
                item.upload();
              })
            }
            else {
              item.upload();
            }

          }
        });
        $scope.editPic = function (file) {
          if (!$scope.edit || utils.isApp()) return;
          var url;
          if (file.Url.indexOf('data:app/main/earthwork/images/png') != -1) {
            url = file.Url && file.Url.substring(0, 1) == '~' ? file.Url.substring(1) : file.Url;

          } else {
            url = appConfig.apiUrl + (file.Url && file.Url.substring(0, 1) == '~' ? file.Url.substring(1) : file.Url);
          }
          utils.imgEdit(url.replace('/s_', '/'), function (data) {
            FilesService.update({Id: file.Id,file: file, Url: data}).then(function (result) {
              file.Url = result.data.Url;
              //console.log('scope', data,file.Id)
              // uploader.queue.push(item);
              utils.alert('更新成功');
            });
          });
        }
        $scope.remove = function ($event, file) {

          $scope.imgOK = false;
          $event.preventDefault();
          utils.confirm(null, '确定删除些图片吗？', function () {
            file.remove();
          });
        }

        if ($scope.isPartions == "true") {
          FilesService.GetPartionId().then(function (r) {
            $scope.partions = r.data.Rows;
          })
          //$scope.partions = $scope.partions ? $scope.partions : [{ Id: 1, desc: '卫生间' }, { Id: 2, desc: '厨房' }, { Id: 4, desc: '主卧' }, { Id: 8, desc: '次卧' }, { Id: 16, desc: '儿童房' }, { Id: 32, desc: '卫生间1' }, { Id: 64, desc: '卫生间2' }];

          $scope.setParDes = $scope.setParDes ? $scope.setParDes : function (partionID, item) {
            var findParbyId = function () {
              for (var i = 0; i < $scope.partions.length; i++) {
                if ($scope.partions[i].Id == partionID) {
                  return $scope.partions[i];
                }
              }
            }
            if (item) {
              var partion = findParbyId();
              item.showPartion = partion ? partion.desc : '';
            }
          }

          $scope.modify = function (partionID, item) {
            $scope.setParDes && $scope.setParDes(partionID, item);
            FilesService.modifyPartion(partionID, item.file.Id);
          }

        }
      },
      templateUrl: "/dp/dataGathering/sxtImages_Template2.html",
      link: function (scope, element, attrs, ngModel) {
        var uploader = scope.uploader;
        var gid;
        scope.$watch('gid', function () {
          if (gid && gid == scope.gid) return;
          if (angular.isArray(scope.files)) {
            scope.files.splice(0, scope.files.length);
          }
          uploader.queue.length = 0;
          gid = scope.gid;
          if (gid != '') {
            uploader.url = appConfig.apiUrl + '/api/Files/' + gid + '?project=' + (scope.project || '');
            angular.forEach(uploader.queue, function (item) {
              item.url = uploader.url
            });
          }
          scope.inputChange = function () {
            scope.imgOK = false;
            scope.imgFail = false;
          }

          FilesService.group(scope.gid || '').success(function (data) {
            if (gid != data.Group) {
              gid = scope.gid = data.Group;
              uploader.url = appConfig.apiUrl + '/api/Files/' + gid + '?project=' + (scope.project || '');
              angular.forEach(uploader.queue, function (item) {
                item.url = uploader.url
              });
            }
            if (data.Files) {
              if (angular.isArray(scope.files)) {
                scope.files = [];
              }
              data.Files.forEach(function (att) {
                if (angular.isArray(scope.files))
                  scope.files.push(att.Url);
                var item = {
                  file: {
                    Id: att.Id,
                    name: att.FileName,
                    size: att.FileSize,
                    Url: att.Url,
                    UserID: att.UserID,
                    Remark: att.Remark,
                    CreateDate: att.CreateDate,
                    PartionID: att.PartionID
                  },
                  remove: function () {
                    var me = this;
                    FilesService.delete(me.file.Id).then(function (r) {
                      uploader.queue.splice(uploader.queue.indexOf(me), 1);
                    });
                  },
                  save: function () {
                    var me = this;
                    FilesService.update(me.file).then(function () {
                      me.isEditing = false;
                    })
                  },
                  progress: 100,
                  isServer: true,
                  isSuccess: true,
                  isCancel: false,
                  isError: false,
                  isReady: false,
                  isUploading: true,
                  isUploaded: true,
                  index: null
                };
                scope.setParDes && scope.setParDes(att.PartionID, item);
                uploader.queue.push(item);
              });
            }
          })
        });
      }
    }
  }

})(angular,undefined);
