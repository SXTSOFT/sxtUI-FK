(function(){
  angular
    .module('app.xhsc')
    .directive('photoDraw',photoDraw);

  /** @Inject */
  function photoDraw($cordovaCamera,$timeout){
    return {
      restrict:'E',
      scope:{
      },
      templateUrl:'app/main/xhsc/directive/photoDraw.html',
      link:link
    }
    function  link(scope,element,attr,ctrl){

      scope.color = 'black';
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
          parent = $('canvas',element).parent(),
          width =parent.width(),height =parent.height(),
          offset = $('#toptoolbar').height();

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
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(currX, currY);
          ctx.strokeStyle = scope.color;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.closePath();
        }

        scope.erase = function () {
          var m = confirm("确定删除?");
          if (m) {

            ctx.clearRect(0, 0, w, h);
            //document.getElementById("canvasimg").style.display = "none";

          }
        }

        scope.save =  function () {
          document.getElementById("img").style.border = "1px solid";
          var dataURL = canvas.toDataURL();
          document.getElementById("img").src = dataURL;
          document.getElementById("img").style.display = "inline";
        }

        function findxy(res, e) {
          if (res == 'down') {
            prevX = currX;
            prevY = currY;
            currX = (e.clientX || e.touches[0].clientX)- canvas.offsetLeft;
            currY = (e.clientY || e.touches[0].clientY) - canvas.offsetTop;
            flag = true;
            dot_flag = true;
            if (dot_flag) {
              ctx.beginPath();
              ctx.fillStyle = x;
              ctx.fillRect(currX, currY, 2, 2);
              ctx.closePath();
              dot_flag = false;
            }
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
            allowEdit: true,
            encodingType: 0,
            saveToPhotoAlbum: false,
            correctOrientation: true
          }).then (function (imageData) {
            if (imageData) {
              var image = new Image();

              //element.append (image);
              //  imageData = imageData.replace('data:image/jpeg;base64,', '').replace('data:image/png;base64,', '');

              image.onload = function() {
                ctx.drawImage(image, 0, 0);
              }
              image.src = "data:image/jpeg;base64," + imageData;
            }


          }, function (err) {


          });
        }

        scope.photo();

      },500)


    }

  }
})();
