/**
 * Created by zhangzhaoyong on 16/2/16.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .directive('sxtImageView',sxtImageViewDirective);

  var def;
  /** @ngInject */
  function sxtImageViewDirective($rootScope, api, $q,utils,$timeout) {
    return {
      restrict: 'EA',
      link: link,
      scope:{
        isContainer:'='
      }
    }

    function link(scope, element, attr, ctrl) {
      var viewer, o,player;
      player = function (a, e) {
        $timeout(function(){
          def = false;
        },1000);
        if(def)return;
        def=true;
        if (viewer)
          viewer.destroy();
        if (o)
          o.remove();

        $q(function(resolve) {
          if(!e)
            resolve(null);
          else{
            if(e.images){
              resolve(e);
            }
            else {
              var request = [];
              e.groups.forEach (function (g) {
                request.push (api.szgc.FilesService.group (g));
              });
              $q.all (request).then (function (results) {
                resolve (results);
              });
            }
          }
        }).then(function (results) {
          def = false;
          var defaultIndex = 0;
          var imagedata = null;

          if(results) {
            if(results.images){
              imagedata = results.images;
            }
            else {
              imagedata = [];
              results.forEach (function (result) {
                result.data.Files.forEach (function (f) {
                  imagedata.push ({date: f.CreateDate, url: sxt.app.api + f.Url.substring (1)});
                })
              })
            }
          }
          if (!imagedata) {
            imagedata = [];
            $('img', element).each(function (index, el) {
              imagedata.push({url:$(el)[0].src,date:$(el).attr('date')});
            })
            defaultIndex = $('img', element).index($(a.target))
            if (defaultIndex == -1)
              defaultIndex = 0;
          }
          if(imagedata.length==0){
            utils.alert('暂无图片')
            return;
          }
          imagedata.sort(function(s1,s2){
            if(s1.date && s2.date){
              return s2.date.localeCompare(s1.date);
            }
            return 0;
          })
          //console.log('img',img)
          var str = [];
          str.push('<ul>')
          angular.forEach(imagedata, function (data) {
            var arl = data.url;
            str.push('<li><img src="' + arl.replace('/s_','/') + '" alt="' + (data.date?'日期：'+data.date:'') + '"></li>');
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
              def =false;
            },
            build:function(){

            }
          });
          viewer.show();

        });
        scope.$on('$destroy', function () {
          if (viewer)
            viewer.destroy();
          if (o)
            o.remove();
          viewer = o=null;
          def =false;
        });
      };
      $rootScope.$on('sxtImageView',player);
      if(scope.isContainer) {
        element.on ('click', player);
      }
    }
  }
})();
