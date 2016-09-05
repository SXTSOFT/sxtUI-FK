/**
 * Created by lss on 2016/9/2.
 */
/**
 * Created by emma on 2016/3/31.
 */
(function(){
  angular
    .module('app.xhsc')
    .directive('parentFullHeight',parentFullHeight);

  /** @Inject */
  function parentFullHeight(){
    return {
      restrict:'A',
      scope:{

      },
      link:link
    }
    function  link(scope,element,attr,ctrl){
      //var  parent=element.parent();
      //parent.css("height,600px");
    }
  }
})();
