/**
 * Created by zhangzhaoyong on 16/2/15.
 */
(function () {
  'use strict';

  angular
    .module('app.szgc')
    .directive('sxtImages', sxtImagesDirective);

  /** @ngInject */
  function sxtImagesDirective(api, xhUtils,sxt){
    return {
      restrict: 'E',
      require: "?ngModel",
      scope: {
        gid: '=ngModel',
        project: '=',
        edit:'@',
        files: '='
      },
      template: '<div  style="color: red;padding-bottom: 0px;padding-left: 10px;padding-top: 0px;" ng-show="imgOK">上传成功!</div><div  style="color: red;" ng-show="imgFail">上传失败!</div> <div class="imageEdit"><div class="edititem" ng-repeat="item in files" ><img style="height:150px;;margin:0 5px;" ng-click="editPic(item.file)" ng-src="{{item.Url|fileurl}}" class="img-thumbnail" /><div class="action"><a class="btn btn-white btn-xs" ng-if="edit" ng-click="remove($event,item)"><i class="fa fa-times"></i></a></div></div>\
<div  style="float:left;padding:5px;" ng-if="edit"><div class="file-drop-zone" style="height:140px;margin:0 5px;line-height:140px; padding:5px;" ng-click ="inputChange()"; >\
        </div>\
</div></div>',
      link: function (scope, element, attrs, ngModel) {
        var gid;
        scope.$watch('gid', function () {
          if (gid && gid == scope.gid) return;
          gid = scope.gid;
          scope.files = [];
          scope.inputChange = function(){
            xhUtils.photo().then(function (base64) {
              if(base64){
                var att = {
                  Id:sxt.uuid(),
                  GroupId:scope.gid,
                  Url:base64
                };
                api.szgc.FilesService.post(att);
                scope.files.push(att);
              }
            })
          }

          api.szgc.FilesService.group(scope.gid || '').then(function (result) {
            var data = result.data;
            if (data.Files) {
              data.Files.forEach(function (att) {
                  scope.files.push(att);
              });
            }
          })
        });
      }
    }
  }

})();
