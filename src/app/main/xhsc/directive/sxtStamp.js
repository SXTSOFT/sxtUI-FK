/**
 * Created by jiuyuong on 2016/4/12.
 */
(function(){
  angular
    .module('app.xhsc')
    .directive('sxtStamp',sxtStamp);

  /** @Inject */
  function sxtStamp(mapPopupSerivce){
    return {
      restrict:'E',
      scope:{
      },
      templateUrl:'app/main/xhsc/directive/sxtStamp.html',
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

      mapPopupSerivce.set('Stamp',{
        el:element,
        scope:scope
      });
      scope.$on('$destroy',function(){
        mapPopupSerivce.remove('Stamp');
      })
    }
  }
})();
