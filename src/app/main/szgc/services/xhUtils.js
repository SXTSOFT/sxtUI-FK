/**
 * Created by jiuyuong on 2016/4/12.
 */
(function(){
  'use strict';
  angular
    .module('app.szgc')
    .factory('xhUtils',xhUtils);
  /** @ngInject */
  function xhUtils($mdDialog,$q){
    var o = {
      findAll:findAll,
      photo:photo,
      when:when,
      playPhoto:playPhoto,
      sort:sort,
      getMapPic:getMapPic
    };
    return o;

    function getNumName(str) {
      str = str.replace('十', '10')
        .replace('九', '9')
        .replace('八', '8')
        .replace('七', '7')
        .replace('六', '6')
        .replace('五', '5')
        .replace('四', '4')
        .replace('三', '3')
        .replace('二', '2')
        .replace('一', '1')
        .replace('十一', '11')
        .replace('十二', '12')
        .replace('十三', '13')
        .replace('十四', '14')
        .replace('十五', '15')
        .replace('十六', '16')
        .replace('十七', '17')
        .replace('十八', '18')
        .replace('十九', '19')
        .replace('二十', '20');
      var n = parseInt(/[-]?\d+/.exec(str));
      return n;
    };
    function sort(fn) {
      return function (s1,s2) {
        var a1 = fn(s1),
          a2 = fn(s2);

        var n1 = getNumName(a1),
          n2 = getNumName(a2);
        if (!isNaN(n1) && !isNaN(n2))
          return n1 - n2;
        else if ((isNaN(n1) && !isNaN(n2)))
          return 1;
        else if ((!isNaN(n1) && isNaN(n2)))
          return -1;
        else
          return a1.localeCompare(a2);
      }
    }

    function findAll(array,fn) {
      var buff=[];
      array.forEach(function (item) {
        if(fn(item)===true)
          buff.push(item);
      });
      return buff;
    }

    function getMapPic(maxZoom){
      var pics = [];
      for(var z=0;z<=maxZoom;z++){
        for(var x= 0,xl = Math.pow(2,z);x<xl;x++){
          for(var y= 0,yl = xl;y<yl;y++){
            pics.push(z+'_'+x+'_'+y)
          }
        }
      }
      return pics;
    }
    function photo($event) {
      return $mdDialog.show({
        targetEvent: $event,
        controller:['$scope', '$mdDialog',function ($scope, $mdDialog) {
          $scope.cancel = function () {
            //$mdDialog.hide('base');
            $mdDialog.cancel();
          }
          $scope.answer = function ($base64Url) {
            $mdDialog.hide($base64Url);
          }
        }],
        fullscreen:true,
        template: '<md-dialog style="width: 100%;max-width: 100%;height: 100%;max-height: 100%;" aria-label="List dialog">' +
        '  <md-dialog-content flex layout="column" style="padding: 0">' +
        '<photo-draw flex layout="column" on-cancel="cancel()" on-answer="answer($base64Url)"></photo-draw>' +
        '  </md-dialog-content>'+
        '</md-dialog>'
      });
    }

    function when(exec,result) {
      return exec().then(function (r) {
        if(result(r)!==false){
          return exec();
        }
        else
          return r;
      })
    }

    function playPhoto(images,options) {
      if(!images || !images.length)return;
      var str = [];
      str.push('<ul>')
      angular.forEach(images, function (data) {
        str.push('<li><img src="' + data.url + '" alt="'+data.alt+'"></li>');
      });
      str.push('</ul>');
      o = $(str.join('')).appendTo('body');

      var viewer = new Viewer(o[0],{
        button:true,
        scalable:false,
        hide:function(){
          viewer.destroy();
          o.remove();
          viewer = o=null;
        },
        build:function(){

        },
        view:function(){
        }
      });
      viewer.show();
      return viewer;
    }
  }
})();
