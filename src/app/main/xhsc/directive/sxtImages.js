/**
 * Created by emma on 2016/5/4.
 */
(function(){
  'use strict';
  angular
    .module('app.xhsc')
    .directive('sxtImages',sxtImagesDirective);

  /** @ngInject */
  function sxtImagesDirective(){
    return {
      restrict:'ECMA',
      scope:{
        sxtImages:'='
      },
      link:link
    }

    function link(scope,element,attr,ctrl){
      //
      var player,defaultIndex,viewer,o;
      var imagedata = scope.sxtImages;
      player = function(a,e){
        console.log('element',scope)
        defaultIndex = $('.img img').index($(a.target))
        if (defaultIndex == -1)
          defaultIndex = 0;
        var str = [];
        str.push('<ul>')
        angular.forEach(imagedata, function (data) {
          var arl = data.url;
          str.push('<li><img src="' + arl + '"></li>');
        });
        str.push('</ul>');
        o = $(str.join('')).appendTo('body')

        viewer = new Viewer(o[0],{
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
        viewer.view(defaultIndex);
        var str1 = [];
        str1.push('<li class="viewer-delete">删除</li>');
        $(str1.join('')).appendTo('.viewer-toolbar');
        $('.viewer-delete').on('click',function(){
          var nowIndex = viewer.index;
          //imagedata = imagedata.splice(nowIndex,1);
          console.log('de',imagedata.splice(nowIndex,1))
        })

      }
      element.on ('click', player);
    }
  }
})();
