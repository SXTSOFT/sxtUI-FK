/**
 * Created by zhangzhaoyong on 16/2/15.
 */
(function () {
  'use strict';

  angular
    .module('app.szgc')
    .directive('sxtImages', sxtImagesDirective);

  /** @ngInject */
  function sxtImagesDirective($http){
    return {
      restrict: 'A',
      require: "?ngModel",
      scope: {
        gid: '=sxtImages'
      },
      controller: function ($scope) {


        $scope.remove = function ($event, file) {
          $scope.imgOK = false;
          $event.preventDefault();
          file.remove();
        }
      },
      template: '<div  style="color: red;padding-bottom: 0px;padding-left: 10px;padding-top: 0px;" ng-show="imgOK">上传成功!</div><div  style="color: red;" ng-show="imgFail">上传失败!</div> <div class="imageEdit"><div class="edititem" ng-repeat="item in uploader.queue" uib-tooltip="{{item.file.Remark}}"><div ng-if="!item.isSuccess" class="proc" >{{item.progress}}%</div><img style="height:150px;;margin:0 5px;" ng-click="editPic(item.file)" ng-src="{{item.file.Url|fileurl}}" class="img-thumbnail" /><div class="action"><a class="btn btn-white btn-xs" ng-if="edit" ng-click="remove($event,item)"><i class="fa fa-times"></i></a></div></div>\
<div  style="float:left;padding:5px;" ng-if="edit"><div class="file-drop-zone" style="height:140px;margin:0 5px;line-height:140px; padding:5px;" >\
            \
        </div>\
</div></div>',
      link: function (scope, element, attrs, ngModel) {
        var gid;
        scope.$watch('gid', function () {
          if (gid && gid == scope.gid) return;

          scope.inputChange = function(){
            scope.imgOK = false;
            scope.imgFail = false;
          }


        });
      }
    }
  }

})();
