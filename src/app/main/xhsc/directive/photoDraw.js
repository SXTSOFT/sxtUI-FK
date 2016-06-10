(function(){
  angular
    .module('app.xhsc')
    .directive('photoDraw',photoDraw);

  /** @Inject */
  function photoDraw($cordovaCamera,$timeout,$mdDialog){
    return {
      restrict:'E',
      scope:{
        onCancel:'&',
        onAnswer:'&'
      },
      templateUrl:'app/main/xhsc/directive/photoDraw.html',
      link:link

    }
    function  link(scope,element,attr,ctrl){

      scope.color = 'red';
      scope.is = function (color) {
        return scope.color == color ?'1px':'0';
      };
      scope.setColor = function (color) {
        scope.color = color;
      }

      $timeout(function () {
        var canvas, ctx, flag = false,
          prevX = 0,
          currX = 0,
          prevY = 0,
          currY = 0,
          dot_flag = false,
          radio =1,
          parent = $('canvas',element).parent(),
          width =parent.width(),height =parent.height(),
          offset = $('#toptoolbar').height(),
          srcWidth,srcHeight,
          image;

        $('canvas',element).width(width)
          .height(height);
        canvas = $('canvas',element)[0];

        ctx = canvas.getContext("2d");
        ctx.canvas.width = width;
        ctx.canvas.height = height;
        canvas.addEventListener("mousemove", function (e) {
          findxy('move', e)
        }, false);
        canvas.addEventListener("touchmove", function (e) {
          findxy('move', e)
        }, false);
        canvas.addEventListener("mousedown", function (e) {
          findxy('down', e)
        }, false);
        canvas.addEventListener("touchstart", function (e) {
          findxy('down', e)
        }, false);
        canvas.addEventListener("mouseup", function (e) {
          findxy('up', e)
        }, false);
        canvas.addEventListener("touchend", function (e) {
          findxy('up', e)
        }, false);
        canvas.addEventListener("mouseout", function (e) {
          findxy('out', e)
        }, false);



        function draw() {
          //if(Math.abs(prevY/radio-currY/radio)>20)return;
          ctx.beginPath();
          ctx.moveTo(prevX/radio, prevY/radio);
          ctx.lineTo(currX/radio, currY/radio);
          ctx.strokeStyle = scope.color;
          //ctx.strokeStyle = x;
          //ctx.lineWidth = y;
          ctx.stroke();
          ctx.closePath();
        }
        scope.cancel = function () {
          scope.onCancel && scope.onCancel();
        }
        scope.erase = function () {
          if(image){
            ctx.clearRect(0, 0, srcWidth, srcHeight);
            ctx.drawImage(image, 0, 0,image.width,image.height,0,0,srcWidth,srcHeight);
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
            console.log('e.touches[0].x,y',e.touches[0].clientX,e.touches[0].clientY)
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
            quality: 50,
            destinationType: 0,
            sourceType: 1,
            allowEdit: false,
            encodingType: 0,
            saveToPhotoAlbum: false,
            correctOrientation: true
          }).then (function (imageData) {
            if (imageData) {
              image = new Image();
              image.onload = function() {
                if(image.width>800 || image.height>800){
                  var rd = 800/Math.max(image.width,image.height);
                  srcWidth = image.width*rd;
                  srcHeight = image.height*rd;
                }
                else{
                  srcWidth = image.width;
                  srcHeight = image.height;
                }
                radio = height/srcHeight;
                width = srcWidth * radio;
                $('canvas',element).width(width);
                ctx.canvas.width = srcWidth;
                ctx.canvas.height = srcHeight;
                ctx.lineWidth =  srcWidth*2/350;
                ctx.drawImage(image, 0, 0,image.width,image.height,0,0,srcWidth,srcHeight);
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
