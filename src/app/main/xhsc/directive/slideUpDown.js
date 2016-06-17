/**
 * Created by emma on 2016/6/15.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .directive('slideUpDown',slideUpDownDirective);

  /**@ngInject*/
  function slideUpDownDirective(){
    return{
      scope:{
        ngValue:'='
      },
      link:link
    }

    function link(scope,element,attr,ctrl){
      //console.log(scope)
      scope.$watch('ngValue',function(){
        if(scope.ngValue){
          $(element).slideDown()
        }else{
          $(element).slideUp()
        }
      })

    }
  }
})();
