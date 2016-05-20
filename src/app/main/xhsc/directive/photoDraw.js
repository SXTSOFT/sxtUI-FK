(function(){
  angular
    .module('app.xhsc')
    .directive('photoDraw',photoDraw);

  /** @Inject */
  function photoDraw($cordovaCamera){
    return {
      restrict:'E',
      scope:{
      },
      templateUrl:'app/main/xhsc/directive/photoDraw.html',
      link:link
    }
    function  link(scope,element,attr,ctrl){


     var image = new Image();

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

            image.src = "data:image/jpeg;base64," + imageData;
            //element.append (image);
          //  imageData = imageData.replace('data:image/jpeg;base64,', '').replace('data:image/png;base64,', '');

          }


        }, function (err) {


        });
      }

      scope.photo();


      var canvas, ctx, flag = false,
        prevX = 0,
        currX = 0,
        prevY = 0,
        currY = 0,
        dot_flag = false;

      var x = "black",
        y = 2;


      canvas = document.getElementById('can');
      ctx = canvas.getContext("2d");
     // var image = new Image();
     // image.src = 'app/main/xhsc/images/bg1.jpg';
      image.onload = function() {
        ctx.drawImage(image, 10, 10);
      }
      w = canvas.width;
      h = canvas.height;
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



      scope.color = function (obj) {
        switch (obj.id) {
          case "green":
            x = "green";
            break;
          case "blue":
            x = "blue";
            break;
          case "red":
            x = "red";
            break;
          case "yellow":
            x = "yellow";
            break;
          case "orange":
            x = "orange";
            break;
          case "black":
            x = "black";
            break;
          case "white":
            x = "white";
            break;
        }
        if (x == "white") y = 14;
        else y = 2;

      }

      function draw() {
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(currX, currY);
        ctx.strokeStyle = x;
        ctx.lineWidth = y;
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
          currY = (e.clientY || e.touches[0].clientY) - canvas.offsetTop-44;
          console.log('a',canvas.offsetLeft, e)
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
          if (flag) {
            prevX = currX;
            prevY = currY;
            currX = (e.clientX || e.touches[0].clientX) - canvas.offsetLeft;
            currY = (e.clientY || e.touches[0].clientY) - canvas.offsetTop-44;
            draw();
          }
        }
      }

    }

  }
})();
