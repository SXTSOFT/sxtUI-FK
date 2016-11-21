/**
 * Created by jiuyuong on 2016/5/19.
 */
(function () {
  'use strict';
  angular
    .module('app.szgc')
    .directive('sxtImagesYbyd',sxtImagesYbyd);
  /** @ngInject */
  function sxtImagesYbyd(api) {
    return {
      restrict: 'E',
      scope: {
        regionId: '=',
        regionTree:'=',
        itemId: '=',
        itemName:'='
      },
      template: '<div class="imageEdit" sxt-image-view is-container="true">\
      <div class="edititem" ng-repeat="item in files" uib-tooltip="{{item.Remark}}">\
      <img style="height:150px;margin:0 5px;" date="{{item.CreateDate +\'-\'+itemName}}" osrc="{{item.Url && item.Url.substring(1).replace(\'s_\',\'\')}}"  ng-src="{{item|fileurl:150}}" class="img-thumbnail" />\
      </div> <div style="padding:20px" ng-if="files.length==0">\
        暂无照片\
      </div>\
      </div>',
      link: function (scope, element, attr, ctrl) {
        scope.$watch("itemId", function () {
          if (scope.regionId && scope.itemId) {
            var regionId = scope.regionTree.replace(/\>/g,'-').replace('sub-','')+(scope.regionTree.indexOf(scope.regionId)==-1?'-'+scope.regionId:''),
              fs;
            api.szgc.FilesService.group( regionId + '-' + scope.itemId).then(function (r) {
              fs = [].concat(r.data.Files);
              api.szgc.FilesService.group('sub-' + regionId + '-' + scope.itemId).then(function (r) {
                fs = fs.concat(r.data.Files);
                scope.files = fs;
              })
            })

          }
        })
      }
    }
  }
})();
