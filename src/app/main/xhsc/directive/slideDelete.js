/**
 * Created by emma on 2016/6/8.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .directive('slideDelete',slideDeleteDirective);

  /**@ngInject*/
  function slideDeleteDirective(){
    return {
      link:link
    }

    function link(scope,element,attr,ctrl){
      //var touch = function(event){
      //
      //  console.log(event.type)
      //  case 'touchstart':
      //
      //  break;
      //}
      var istartx,istarty,iendx,idiff;
      function touchstart(event){
        console.log(event)
        istartx = event.touches[0].clientX;
        istarty=event.touches[0].clientY;
      }
      function touchmove(event){
        iendx = event.touches[0].clientX;
      }
      function touchend(event){
        idiff = istartx - iendx;
        if(Math.abs(idiff)>100){
          console.log('idiff',idiff)
          if(idiff>100){
            $(event.target).parents('md-list-item').css('transform','translate3d(-160px,0,0)')
          }else{
            $(event.target).parents('md-list-item').css('transform','translate3d(0,0,0)')
          }
        }

        //event.stopPropagation();
        //event.preventDefault();
      }
      document.addEventListener('touchstart',touchstart)
      document.addEventListener('touchmove',touchmove)
      document.addEventListener('touchend',touchend)
    }
  }
})();
