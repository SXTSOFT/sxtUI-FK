/**
 * Created by shaoshun on 2017/1/22.
 */
/**
 * Created by jiuyuong on 2016/8/13.
 */
(function () {
  'use strict';
  angular
    .module('app.inspection')
    .directive('mapRef',mapRef);
  /** @inject */
  function mapRef(mapCache) {
    return {
      scope:{
        key:"@"
      },
      link:function (scope,el,api) {
        mapCache.set(scope.key,el);
      }
    }
  }
})();

