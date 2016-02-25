/**
 * Created by emma on 2016/2/19.
 */

var zoom=30;
var scrollFunc=function(e){
  var direct=0;
  e=e || window.event;
  console.log('a')
  var t1=document.getElementById("wheelDelta");
  var t2=document.getElementById("detail");
  var d = e.wheelDelta||e.detail;

  zoom += (d<0 ?-10:10);
  if(zoom<20)zoom=20;
  if(zoom>100)zoom=100;
  document.body.style.zoom = zoom+'%';
  e.preventDefault();
  return false;
}
//$('.item').addEventListener('DOMMouseScroll', function () { alert('a  ') }, false);
//$('.item').on('mousewheel DOMMouseScroll', function (e) {
//  //WebKit内核，Trident内核 => mousewheel
//  //Gecko内核 => DOMMouseScroll
//  e.preventDefault();
//  var value = e.originalEvent.wheelDelta || -e.originalEvent.detail;
//  //e.originalEvent.wheelDelta => 120(up) or -120(down) 谷歌IE内核
//  //e.originalEvent.detail => -3(up) or 3(down) 火狐内核
//  var delta = Math.max(-1, Math.min(1, value));
//  console.log(delta < 0 ? 'down' : 'up');
//});
/*注册事件*/
//if(document.addEventListener){
//  document.addEventListener('DOMMouseScroll',scrollFunc,false);
//}
//window.onmousewheel=document.onmousewheel=scrollFunc;//IE/Opera/Chrome
function bbimg(o){
  //var zoom=parseInt(o.style.zoom, 10)||100;
  console.log('a')
  var zoom=30;
  zoom+=event.wheelDelta/12;
  if (zoom>0) o.style.zoom=zoom+'%';
  return false;
}




