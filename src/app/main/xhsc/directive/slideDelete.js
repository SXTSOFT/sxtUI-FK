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

      var istartx,istarty,iendx,idiff,flag;
      //function touchstart(event){
      //  istartx = event.touches[0].clientX;
      //  istarty=event.touches[0].clientY;
      //}
      //function touchmove(event){
      //  iendx = event.touches[0].clientX;
      //}
      //function touchend(event){
      //  idiff = istartx - iendx;
      //  if(idiff>0){
      //    $(event.target).parents('md-list-item').css('transform','translate3d(0,0,0)')
      //  }else{
      //    var l = Math.abs(idiff);
      //    $(event.target).parents('md-list-item').css('transform','translate3d(' + -l + 'px)');
      //    if(l>160){
      //      l=160;
      //      $(event.target).parents('md-list-item').css('transform','translate3d(' + -l + 'px)');
      //    }
      //  }
      //}
      //document.addEventListener('touchstart',touchstart,false)
      //document.addEventListener('touchmove',touchmove,false)
      //document.addEventListener('touchend',touchend,false)
      var initX;
      var moveX;
      var X = 0;
      var objX = 0;
      window.addEventListener('touchstart',function(event){
        var obj= $(event.target).parents('md-list-item.slideli');
        if(obj[0]){
          //event.preventDefault();
          initX = event.targetTouches[0].pageX;
          objX =(obj[0].style.WebkitTransform.replace(/translateX\(/g,"").replace(/px\)/g,""))*1;
        }
        if( objX == 0){
          window.addEventListener('touchmove',function(event) {
            var obj= $(event.target).parents('md-list-item.slideli');
            if (obj[0]) {
              moveX = event.targetTouches[0].pageX;
              X = moveX - initX;
              if(Math.abs(X)>10){
                event.preventDefault();
              }
              if (X > 0) {
                obj[0].style.WebkitTransform = "translateX(" + 0 + "px)";
              }
              else if (X < 0) {
                var l = Math.abs(X);
                obj[0].style.WebkitTransform = "translateX(" + -l + "px)";
                if(l>160){
                  l=160;
                  obj[0].style.WebkitTransform = "translateX(" + -l + "px)";
                }
              }
            }
          });
        }
        else if(objX<0){
          window.addEventListener('touchmove',function(event) {
            var obj= $(event.target).parents('md-list-item.slideli');
            if (obj[0]) {

              moveX = event.targetTouches[0].pageX;
              X = moveX - initX;
              if(Math.abs(X)>10){
                event.preventDefault();
              }
              if (X > 0) {
                var r = -160 + Math.abs(X);
                obj[0].style.WebkitTransform = "translateX(" + r + "px)";
                if(r>0){
                  r=0;
                  obj[0].style.WebkitTransform = "translateX(" + r + "px)";
                }
              }
              else {
                obj[0].style.WebkitTransform = "translateX(" + -160 + "px)";
              }
            }
          });
        }

      })
      window.addEventListener('touchend',function(event){
        var obj= $(event.target).parents('md-list-item.slideli');
        if(obj[0]){
         // event.preventDefault();
          objX =(obj[0].style.WebkitTransform.replace(/translateX\(/g,"").replace(/px\)/g,""))*1;
          if(objX>-40){
            obj[0].style.WebkitTransform = "translateX(" + 0 + "px)";
          }else{
            obj[0].style.WebkitTransform = "translateX(" + -160 + "px)";
          }
        }
      })
    }
  }
})();
