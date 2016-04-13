/**
 * Created by emma on 2016/3/31.
 */
(function(){
  angular
    .module('app.xhsc')
    .directive('mapPopup',mapPopup);

  /** @Inject */
  function mapPopup(mapPopupSerivce){
    return {
      restrict:'A',
      scope:{
        popup:'@mapPopup'
      },
      link:link
    }
    function  link(scope,element,attr,ctrl){
      mapPopupSerivce.set(scope.popup,{
        el:element,
        scope:scope
      });
      scope.$on('$destroy',function(){
        mapPopupSerivce.remove(scope.popup);
      })
    }
  }
})();
