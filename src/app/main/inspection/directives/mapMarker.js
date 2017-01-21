
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
  function mapMarker(mapRef,$compile,$timeout){
    return {
      scope:{
        ref:'@mapMarker',
        event:'=',
        added:'&',
        removed:'&'
      },
      link:function (scope,element) {
        mapRef.add(scope.ref,element[0]);

        if(scope.event) scope.added({marker:element[0]});
        scope.$on('$destroy',function () {
          mapRef.remove(scope.ref);
          if(scope.event) scope.removed({marker:scope.event});
        })
      }
    }
  }
})();
