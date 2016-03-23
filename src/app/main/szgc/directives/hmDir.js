/**
 * Created by emma on 2016/3/1.
 */
(function() {
  'use strict';

  angular
    .module('app.szgc')
    .directive('hmDir', hmDirDirective);

  /** @ngInject */
  function hmDirDirective($timeout) {
    return {
      restrict: 'AE',
      link: link
    }

    function link(scope, element, attrs, ctrl) {
      //console.log('scope', element[0].children[0])
      var currentScale =1;
      scope.pinch = function(e){
        var scale = getRelativeScale(e.gesture.scale);
        $.Velocity.hook($('#floorlayer'), 'scale', scale);
        e.preventDefault();
       //$('#floorlayer').css('zoom',scale);
        //console.log('pinch',e)
      }
      scope.pinchmove = function(e){
        //console.log('pinchevent')
        var scale = getRelativeScale(e.gesture.scale);
       // $('#floorlayer').css('zoom',scale);
        $.Velocity.hook($('#floorlayer'), 'scale', scale);
        e.preventDefault();
        //console.log('pinchmove')
        //var scale = $(element).css();
      }
      scope.pinchend = function(e){
        currentScale = getRelativeScale(e.gesture.scale);
        e.preventDefault();
        //console.log('pinchend')
      }

      function getRelativeScale(scale) {
        var newscale = scale * currentScale;
        if(newscale <=1){
          newscale =1;
        }
        return newscale;//scale * currentScale;
      }
      var deltax= 0,deltay=0;
      var lastx= 0,lasty=0;
      scope.dragEvent=function(e){
        //var x = e.center.x - 250,
        //  y = e.center.y - 250;
        //e.gesture.deltaX
        //var x= $('#floorlayer').width(),y= $('#floorlayer').height();
        //var mx=$
        deltax=lastx + e.gesture.deltaX;
        deltay=lasty + e.gesture.deltaY;
        //var x1=$(e.gesture.center.clientX),y1=$(e.gesture.center.clientY);
        //var left=e.gesture.center.clientX- e.gesture.deltaX;
        //var top=e.gesture.center.clientY- e.gesture.deltaY;
        $.Velocity.hook($('#floorlayer'), 'translateX', deltax + 'px');
        $.Velocity.hook($('#floorlayer'), 'translateY', deltay + 'px');
        //$('#floorlayer').css({
        //  left:left+'px',
        //  top:top+'px'
        //})
        //console.log('xx',x,y)
        //console.log('x',e,e.gesture.deltaX,deltax)
        e.preventDefault();
        //element.children().css({
        //  'left' : x + 'px',
        //  'top' : y + 'px'
        //});
      }

      scope.dragend=function(e){
        lastx = deltax;
        lasty=deltay;// + e.gesture.deltaX;
        //console.log('dragend',deltax)
        e.preventDefault();
      }
    }
  }
})();
