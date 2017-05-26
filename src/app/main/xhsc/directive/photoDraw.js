(function(){
  angular
    .module('app.xhsc')
    .directive('photoDraw',photoDraw);

  /** @Inject */
  // function photoDraw($cordovaCamera,$timeout,$mdDialog){
  //   return {
  //     restrict:'E',
  //     scope:{
  //       onCancel:'&',
  //       onAnswer:'&',
  //       waterText:'='
  //     },
  //     templateUrl:'app/main/xhsc/directive/photoDraw.html',
  //     link:link
  //
  //   }
  //   function  link(scope,element,attr,ctrl){
  //
  //     scope.color = 'red';
  //     scope.is = function (color) {
  //       return scope.color == color ?'1px':'0';
  //     };
  //     scope.setColor = function (color) {
  //       scope.color = color;
  //     }
  //
  //
  //     var canvas, ctx, flag = false,
  //       prevX = 0,
  //       currX = 0,
  //       prevY = 0,
  //       currY = 0,
  //       dot_flag = false,
  //       radio =1,
  //       parent,
  //     width,
  //       height,
  //     offset,
  //     srcWidth,srcHeight,
  //       image;
  //
  //     canvas = $('canvas',element)[0];
  //
  //     ctx = canvas.getContext("2d");
  //
  //     canvas.addEventListener("mousemove", function (e) {
  //       findxy('move', e)
  //     }, false);
  //     canvas.addEventListener("touchmove", function (e) {
  //       findxy('move', e)
  //     }, false);
  //     canvas.addEventListener("mousedown", function (e) {
  //       findxy('down', e)
  //     }, false);
  //     canvas.addEventListener("touchstart", function (e) {
  //       findxy('down', e)
  //     }, false);
  //     canvas.addEventListener("mouseup", function (e) {
  //       findxy('up', e)
  //     }, false);
  //     canvas.addEventListener("touchend", function (e) {
  //       findxy('up', e)
  //     }, false);
  //     canvas.addEventListener("mouseout", function (e) {
  //       findxy('out', e)
  //     }, false);
  //
  //
  //
  //     function draw() {
  //       //if(Math.abs(prevY/radio-currY/radio)>20)return;
  //       ctx.beginPath();
  //       ctx.moveTo(prevX/radio, prevY/radio);
  //       ctx.lineTo(currX/radio, currY/radio);
  //       ctx.strokeStyle = scope.color;
  //       //ctx.strokeStyle = x;
  //       //ctx.lineWidth = y;
  //       ctx.stroke();
  //       ctx.closePath();
  //     }
  //     scope.cancel = function () {
  //      scope.onCancel && scope.onCancel();
  //     }
  //     scope.erase = function () {
  //       if(image){
  //         ctx.clearRect(0, 0, srcWidth, srcHeight);
  //         ctx.drawImage(image, 0, 0,image.width,image.height,0,0,srcWidth,srcHeight);
  //       }
  //     }
  //     scope.save =  function () {
  //       var dataURL = canvas.toDataURL('image/jpeg');
  //       scope.onAnswer && scope.onAnswer({$base64Url:dataURL});
  //     }
  //
  //     function findxy(res, e) {
  //       if(!e.clientX &&(!e.touches || !e.touches[0] ||!e.touches[0].clientX))return;
  //       if (res == 'down') {
  //         prevX = currX;
  //         prevY = currY;
  //         currX = (e.clientX || e.touches[0].clientX)- canvas.offsetLeft;
  //         currY = (e.clientY || e.touches[0].clientY) - canvas.offsetTop-offset;
  //         flag = true;
  //
  //       }
  //       if (res == 'up' || res == "out") {
  //         flag = false;
  //       }
  //       if (res == 'move') {
  //         //console.log('e.touches[0].x,y',e.touches[0].clientX,e.touches[0].clientY)
  //         if (flag) {
  //           prevX = currX;
  //           prevY = currY;
  //           currX = (e.clientX || e.touches[0].clientX) - canvas.offsetLeft;
  //           currY = (e.clientY || e.touches[0].clientY) - canvas.offsetTop - offset;
  //           draw();
  //         }
  //       }
  //     }
  //     $timeout(function () {
  //         parent = $('canvas',element).parent();
  //         width =parent.width();
  //       height =parent.height();
  //         offset = $('#toptoolbar').height();
  //       $('canvas',element).width(width)
  //         .height(height);
  //       ctx.canvas.width = width;
  //       ctx.canvas.height = height;
  //     },1000);
  //     scope.photo = function ($event) {
  //       if ($event) {
  //         $event.preventDefault ();
  //         $event.stopPropagation ();
  //       }
  //       $cordovaCamera.getPicture ({
  //         targetWidth: 600,
  //         targetHeight: 600,
  //         destinationType: 0,
  //         sourceType: 1,
  //         allowEdit: false,
  //         encodingType: 0,
  //         saveToPhotoAlbum: true,
  //         correctOrientation: true
  //
  //
  //       }).then (function (imageData) {
  //         if (imageData) {
  //           image = new Image();
  //           image.onload = function() {
  //             if(image.width>600 || image.height>600){
  //               var rd = 600/Math.max(image.width,image.height);
  //               srcWidth = image.width*rd;
  //               srcHeight = image.height*rd;
  //             }
  //             else{
  //               srcWidth = image.width;
  //               srcHeight = image.height;
  //             }
  //             radio = height/srcHeight;
  //             width = srcWidth * radio;
  //             //$('canvas',element).width(width);
  //             ctx.canvas.width = srcWidth;
  //             ctx.canvas.height = srcHeight;
  //             ctx.lineWidth =  srcWidth*2/350;
  //             ctx.drawImage(image, 0, 0,image.width,image.height,0,0,srcWidth,srcHeight);
  //             if (scope.waterText){
  //               ctx.font="20px microsoft yahei";
  //               ctx.fillStyle = "rgba(255,255,255,0.5)";
  //               ctx.textAlign="right"
  //               ctx.fillText(scope.waterText,srcWidth-10,srcHeight-10);
  //             }
  //           }
  //           image.src = "data:image/jpeg;base64," + imageData;
  //         }
  //         else{
  //           scope.cancel();
  //         }
  //       }, function (err) {
  //         scope.cancel();
  //
  //       });
  //     }
  //     scope.photo();
  //   }
  // }

  function photoDraw($cordovaCamera,$timeout,$mdDialog){
    return {
      restrict:'E',
      scope:{
        onCancel:'&',
        onAnswer:'&',
        waterText:'='
      },
      templateUrl:'app/main/xhsc/directive/photoDraw.html',
      link:link

    }
    function  link(scope,element,attr,ctrl){

      var canvas=$('#sketchpad',element)[0];
      $timeout(function () {
        var sketchpad=new window.Sketchpad({
          element: '#sketchpad',
          width: $("#sketchpad").width(),
          height: $("#sketchpad").height(),
        })
        sketchpad.color = '#DE3031'
        sketchpad.penSize = 3;

        scope.color = 'red';
        scope.is = function (color) {
          return scope.color == color ?'1px':'0';
        };
        scope.setColor = function (color) {
          sketchpad.color=scope.color = color;
        }
        // var canvas, ctx, flag = false,
        //   prevX = 0,
        //   currX = 0,
        //   prevY = 0,
        //   currY = 0,
        //   dot_flag = false,
        //   radio =1,
        //   parent = $('canvas',element).parent(),
        //   width =parent.width(),height =parent.height(),
        //   offset = $('#toptoolbar').height(),
        //   srcWidth,srcHeight,
        var image;
        //
        // $('canvas',element).width(width)
        //   .height(height);
        // canvas = $('canvas',element)[0];

        ctx = $('#sketchpad',element)[0].getContext("2d");
        // ctx.canvas.width = width;
        // ctx.canvas.height = height;
        // canvas.addEventListener("mousemove", function (e) {
        //   findxy('move', e)
        // }, false);
        // canvas.addEventListener("touchmove", function (e) {
        //   findxy('move', e)
        // }, false);
        // canvas.addEventListener("mousedown", function (e) {
        //   findxy('down', e)
        // }, false);
        // canvas.addEventListener("touchstart", function (e) {
        //   findxy('down', e)
        // }, false);
        // canvas.addEventListener("mouseup", function (e) {
        //   findxy('up', e)
        // }, false);
        // canvas.addEventListener("touchend", function (e) {
        //   findxy('up', e)
        // }, false);
        // canvas.addEventListener("mouseout", function (e) {
        //   findxy('out', e)
        // }, false);


        //
        // function draw() {
        //   //if(Math.abs(prevY/radio-currY/radio)>20)return;
        //   ctx.beginPath();
        //   ctx.moveTo(prevX/radio, prevY/radio);
        //   ctx.lineTo(currX/radio, currY/radio);
        //   ctx.strokeStyle = scope.color;
        //   //ctx.strokeStyle = x;
        //   //ctx.lineWidth = y;
        //   ctx.stroke();
        //   ctx.closePath();
        // }
        scope.cancel = function () {
          scope.onCancel && scope.onCancel();
        }
        scope.erase = function () {
          if(image){
            sketchpad.undo()

            // ctx.clearRect(0, 0, srcWidth, srcHeight);
            // ctx.drawImage(image, 0, 0,image.width,image.height,0,0,srcWidth,srcHeight);
            ctx.drawImage(image, 0, 0,$("#sketchpad").width(), $("#sketchpad").height());
          }
        }
        scope.save =  function () {
          var dataURL = canvas.toDataURL('image/jpeg',1);
          scope.onAnswer && scope.onAnswer({$base64Url:dataURL});
        }

        function findxy(res, e) {
          if(!e.clientX &&(!e.touches || !e.touches[0] ||!e.touches[0].clientX))return;
          if (res == 'down') {
            prevX = currX;
            prevY = currY;
            currX = (e.clientX || e.touches[0].clientX)- canvas.offsetLeft;
            currY = (e.clientY || e.touches[0].clientY) - canvas.offsetTop-offset;
            flag = true;

          }
          if (res == 'up' || res == "out") {
            flag = false;
          }
          if (res == 'move') {
            //console.log('e.touches[0].x,y',e.touches[0].clientX,e.touches[0].clientY)
            if (flag) {
              prevX = currX;
              prevY = currY;
              currX = (e.clientX || e.touches[0].clientX) - canvas.offsetLeft;
              currY = (e.clientY || e.touches[0].clientY) - canvas.offsetTop - offset;
              draw();
            }
          }
        }
        scope.photo = function ($event) {
          if ($event) {
            $event.preventDefault ();
            $event.stopPropagation ();
          }
          $cordovaCamera.getPicture ({

            targetWidth: 700,
            targetHeight: 700,
            destinationType: 0,
            sourceType: 1,
            allowEdit: false,
            encodingType: 0,
            saveToPhotoAlbum: true,
            correctOrientation: true



            //
            // quality: 50,
            // destinationType: 0,
            // sourceType: 1,
            // allowEdit: false,
            // encodingType: 0,
            // saveToPhotoAlbum: true,
            // correctOrientation: true
          }).then (function (imageData) {
            if (imageData) {
              image = new Image();
              image.onload = function() {
                // if(image.width>600 || image.height>600){
                //   var rd = 600/Math.max(image.width,image.height);
                //   srcWidth = image.width*rd;
                //   srcHeight = image.height*rd;
                // }
                // else{
                //   srcWidth = image.width;
                //   srcHeight = image.height;
                // }
                // radio = height/srcHeight;
                // width = srcWidth * radio;
                // $('canvas',element).width(width);
                // ctx.canvas.width = srcWidth;
                // ctx.canvas.height = srcHeight;
                // ctx.lineWidth =  srcWidth*2/350;
                // ctx.drawImage(image, 0, 0,image.width,image.height,0,0,srcWidth,srcHeight);
                ctx.drawImage(image, 0, 0,$("#sketchpad").width(), $("#sketchpad").height());
                if (scope.waterText){
                  ctx.font="20px microsoft yahei";
                  ctx.fillStyle = "rgba(255,255,255,0.5)";
                  ctx.textAlign="right"
                  ctx.fillText(scope.waterText,srcWidth-10,srcHeight-10);
                }
              }
              image.src = "data:image/jpeg;base64," + imageData;

            }
            else{
              scope.cancel();
            }
          }, function (err) {
            scope.cancel();

          });
        }
        scope.photo();

      },500);
    }
  }
})();
