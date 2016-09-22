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
      var initX,initY;
      var moveX,moveY;
      var X = 0,Y=0;
      var objX = 0,objY=0;
      var isScrolling,isMoved,isTouched;
      function touchstart(event){
        // console.log(e)
        var obj= $(event.target).parents('md-list-item');
        if(obj[0]){
          isMoved = false;
          isTouched = true;
          isScrolling = undefined;
          initX = event.targetTouches[0].pageX;
          initY = event.targetTouches[0].pageY;
          objX =(obj[0].style.WebkitTransform.replace(/translateX\(/g,"").replace(/px\)/g,""))*1;
        }
      }
      function touchmove(event){
        if (!isTouched) return;
        moveX = event.targetTouches[0].pageX;
        moveY = event.targetTouches[0].pageY;
        if (typeof isScrolling === 'undefined') {
          isScrolling = !!(isScrolling || Math.abs(moveY - initY) > Math.abs(moveX - initX));
        }
        if (isScrolling) {
          isTouched = false;
          return;
        }
        var obj= $(event.target).parents('md-list-item');
        if(objX==0){
          if(obj[0] && !isMoved){

            X = moveX - initX;
            Y=moveY - initY;
            //console.log(Y)
            // isMoved = true;
            event.preventDefault();
            //X<0 往左
            //console.log(Y)
            if(X>0){
              obj[0].style.WebkitTransform = "translateX(" + 0 + "px)";
            }else{
              var l = Math.abs(X);
              obj[0].style.WebkitTransform = "translateX(" + -l + "px)";
              if(l>160){
                l=160;
                obj[0].style.WebkitTransform = "translateX(" + -l + "px)";
              }
            }

          }
        }else if(objX<0){
          if(obj[0] && !isMoved){
            moveX = event.targetTouches[0].pageX;
            moveY = event.targetTouches[0].pageY;
            X = moveX - initX;
            Y=moveY - initY;
            // isMoved = true;
            event.preventDefault();
            if(X>0){
              var r = -160 + Math.abs(X);
              obj[0].style.WebkitTransform = "translateX(" + r + "px)";
              if(r>0){
                r=0;
                obj[0].style.WebkitTransform = "translateX(" + r + "px)";
              }
            }else{
              obj[0].style.WebkitTransform = "translateX(" + -160 + "px)";
            }

          }
        }

      }
      function touchend(event){
        if (!isTouched || !isMoved) {
          isTouched = false;
          isMoved = false;
          return;
        }

        isTouched = false;
        isMoved = false;
        var obj= $(event.target).parents('md-list-item');
        if(obj[0]){
          // event.preventDefault();
          objX =(obj[0].style.WebkitTransform.replace(/translateX\(/g,"").replace(/px\)/g,""))*1;
          if(objX>-40){
            obj[0].style.WebkitTransform = "translateX(" + 0 + "px)";
          }else{
            obj[0].style.WebkitTransform = "translateX(" + -160 + "px)";
          }
        }
      }

      window.addEventListener('touchstart',touchstart,false);
      window.addEventListener('touchmove',touchmove,false);
      window.addEventListener('touchend',touchend,false);

    }
  }
})();
