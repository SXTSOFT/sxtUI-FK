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
