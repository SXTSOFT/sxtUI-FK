/**
 * Created by jiuyuong on 2016/4/13.
 */
(function(){
  'use strict';
  angular
    .module('app.xhsc')
    .directive('sxtMapCheckPopup',sxtMapCheckPopup);
  /** @ngInject */
  function sxtMapCheckPopup(mapPopupSerivce,$timeout,sxt,xhUtils){
    return {
      restrict:'E',
      scope:{
        readonly:'='
      },
      templateUrl:'app/main/xhsc/directive/sxtMapCheckPopup.html',
      link:link
    }

    function link(scope,element,attr,ctrl){
      scope.updateValue = function() {
        scope.cancelEdit (true);
      };
      scope.apply = function() {
        scope.isSaveData = null;
        var context = scope.context;
        scope.$apply();
      };

      scope.removeLayer = function(){
        scope.isSaveData = false;
        var layer = scope.context.layer;
        layer._fg.removeLayer(layer);
      };
      scope.cancelEdit = function(saveData){
        scope.isSaveData = saveData||false;
        var layer = scope.context.layer;
        layer.editing && layer.editing.disable();
      };
      mapPopupSerivce.set('mapCheckMapPopup',{
        el:element,
        scope:scope
      });
      scope.$on('$destroy',function(){
        mapPopupSerivce.remove('mapCheckMapPopup');
      })
    }
  }
})();
