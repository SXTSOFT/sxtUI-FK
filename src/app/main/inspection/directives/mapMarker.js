
(function(){
  'use strict';

  angular
    .module('app.inspection')
    .factory('mapRef',mapRef)
    .directive('mapMarker',mapMarker);

  function mapRef() {
    var cache = {};
    return {
      add:function (key,el) {
        cache[key] = el;
      },
      remove:function (key) {
        cache[key] = null;
      }
    }
  }
  /**@ngInject*/
  function mapMarker(mapRef){
    return {
      scope:{
        ref:'@mapMarker',
        link:function (scope,element) {
          mapRef.add(scope.ref,element[0]);
          scope.$on('$destroy',function () {
            mapRef.remove(scope.ref);
          })
        }
      }
    }
  }
})();
