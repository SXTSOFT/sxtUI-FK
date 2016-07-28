/**
 * Created by jiuyuong on 2016/7/20.
 */
(function () {
  'use strict';

  angular
    .module('app.xhsc')
    .directive('sxtShowMap',sxtShowMap);
  /** @ngInject */
  function sxtShowMap(remote,$window) {
    return {
      restrict: 'A',
      scope: {
        imageId: '=sxtShowMap',
        ct:'='
      },
      link: function (scope, element) {
        scope.ct && (scope.ct.loading = true);
        var map;
        scope.$watch('imageId', function () {
          if (scope.imageId) {
            if (map)
              map.remove();
            remote.Project.getDrawing(scope.imageId).then(function (result2) {
              if (!result2.data.DrawingContent) {
                scope.ct && (scope.ct.loading = false);
                utils.alert('未找到图纸,请与管理员联系!(2)');
                return;
              }
              map = new $window.L.glProject(element[0]);
              map.loadSvgXml(result2.data.DrawingContent);
              scope.ct && (scope.ct.loading = false);
            });
          }
        })
      }
    }
  }
})();
