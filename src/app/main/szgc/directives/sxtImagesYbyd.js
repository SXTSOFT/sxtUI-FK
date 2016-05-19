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
        itemId: '='
      },
      template: '<div class="imageEdit" sxt-image-view is-container="true">\
      <div class="edititem" ng-repeat="item in files" uib-tooltip="{{item.Remark}}">\
      <img style="height:150px;margin:0 5px;" osrc="{{item.Url.substring(1).replace(\'s_\',\'\')}}"  ng-src="{{item.Url|fileurl:150}}" class="img-thumbnail" />\
      </div>\
      </div>',
      link: function (scope, element, attr, ctrl) {
        scope.$watch("itemId", function () {
          if (scope.regionId && scope.itemId) {
            var regionId = scope.regionId.replace(/\>/g,'-'),
              fs;
            api.szgc.FilesService.group(regionId + '-' + scope.itemId).then(function (r) {
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
