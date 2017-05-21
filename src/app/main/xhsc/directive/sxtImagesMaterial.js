/**
 * Created by emma on 2016/5/4.
 */
(function(){
  'use strict';
  angular
    .module('app.xhsc')
    .directive('sxtImagesMaterial',sxtImagesDirective);

  /** @ngInject */
  function sxtImagesDirective($rootScope){
    return {
      restrict:'ECMA',
      scope:{
        sxtImagesMaterial:'='
      },
      link:link
    }

    function link(scope,element,attr,ctrl){
      var player,defaultIndex,viewer,delplayer,o;
      var imagedata;
      player = function(a,e){
        imagedata = scope.sxtImagesMaterial;
        defaultIndex = $('.img img').index($(a.target))
        if (defaultIndex == -1)
          defaultIndex = 0;
        var str = [];
        str.push('<ul>')
        angular.forEach(imagedata, function (data) {
          var arl = data.ImageByte;
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
          var id = scope.sxtImagesMaterial[nowIndex].Id;
          scope.sxtImagesMaterial.splice(nowIndex,1);
          viewer.hide();
          if(imagedata.length) delplayer(nowIndex);
          $rootScope.$broadcast('delete',nowIndex,id)
          //console.log('de',imagedata)
        })

      }
      delplayer = function(nowIndex){
        // console.log('element',scope)

        var str = [];
        str.push('<ul>')
        angular.forEach(imagedata, function (data) {
          var arl = data.ImageByte;
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
        viewer.view(nowIndex);
        var str1 = [];
        str1.push('<li class="viewer-delete">删除</li>');
        $(str1.join('')).appendTo('.viewer-toolbar');
        $('.viewer-delete').on('click',function(){
          var nowIndex = viewer.index;
           var id = imagedata[nowIndex].Id;
          //console.log('lenght',viewer.length,nowIndex)
          imagedata.splice(nowIndex,1);
          viewer.hide();
          if(imagedata.length) delplayer(nowIndex);
          $rootScope.$emit('delete',nowIndex,id)
        })

      }
      element.on ('click', player);
    }
  }
})();
