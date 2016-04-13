/**
 * Created by jiuyuong on 2016/4/12.
 */
(function(){
  angular
    .module('app.xhsc')
    .directive('sxtLineGroup',sxtLineGroup);

  /** @Inject */
  function sxtLineGroup(mapPopupSerivce){
    return {
      restrict:'E',
      scope:{
      },
      templateUrl:'app/main/xhsc/directive/sxtLineGroup.html',
      link:link
    }
    function  link(scope,element,attr,ctrl){
      scope.removeLayer = function(){
        var layer = scope.context.layer;
        layer._fg.removeLayer(layer);
      }
      scope.cancelEdit = function(){
        var layer = scope.context.layer;
        layer.editing && layer.editing.disable();
      }

      mapPopupSerivce.set('LineGroup',{
        el:element,
        scope:scope
      });
      scope.$on('$destroy',function(){
        mapPopupSerivce.remove('LineGroup');
      })
    }
  }
})();
