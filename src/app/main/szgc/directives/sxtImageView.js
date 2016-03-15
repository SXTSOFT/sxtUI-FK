/**
 * Created by zhangzhaoyong on 16/2/16.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .directive('sxtImageView',sxtImageViewDirective);

  /** @ngInject */
  function sxtImageViewDirective($rootScope, api, $q,utils) {
    return {
      restrict: 'EA',
      link: link,
      scope:{
        isContainer:'='
      }
    }

    function link(scope, element, attr, ctrl) {
      var preview, o,def,player;
      player = function (a, e) {
        if(def)return;
        def=true;
        if (preview)
          preview.destroy();
        if (o)
          o.remove();

        $q(function(resolve) {
          if(!e)
            resolve(null);
          else{
            var request = [];
            e.groups.forEach(function (g) {
              request.push(api.szgc.FilesService.group(g));
            });
            $q.all(request).then(function(results){
              resolve(results);
            });
          }
        }).then(function (results) {
          def = false;
          var defaultIndex = 0;
          var imagedata = null;

          if(results) {
            imagedata = [];
            results.forEach (function (result) {
              result.data.Files.forEach (function (f) {
                imagedata.push ({date: f.CreateDate, url: sxt.app.api + f.Url.substring (1)});
              })
            })
          };
          if (!imagedata) {
            imagedata = [];
            $('img', element).each(function (index, el) {
              imagedata.push({url:$(el)[0].src});
            })
            defaultIndex = $('img', element).index($(a.target))
            if (defaultIndex == -1)
              defaultIndex = 0;
          }
          if(imagedata.length==0){
            utils.alert('暂无图片')
            return;
          }
          //console.log('img',img)
          var str = [];
          str.push('<div class="piclayer">\
        <div class="swiper-container"><div class="swiper-wrapper">')
          angular.forEach(imagedata, function (data) {
            var arl = data.url;
            str.push('<div class="swiper-slide"><p><img src="' + arl + '"></p><div style="position:absolute;top:20px;left:20px; font-size:20px; color:white;text-shadow:2px 2px 3px #ff0000">' + (data.date?'日期：'+data.date:'') + '</div></div>');
          });
          str.push('</div><div class="swiper-pagination"></div></div></div>');
          o = $(str.join('')).appendTo('body')
          //$('body').append(o);

          var iWidth = $(window).width();
          var iHeight = $(window).height();

          var iSh = iHeight;//-150;

          $('.swiper-container').width(iWidth + 'px');
          $('.swiper-container').height(iSh + 'px');
          $('.swiper-slide').height(iSh + 'px');
          $('.swiper-slide p').height(iSh + 'px');//.css('line-height',iSh+'px');

          preview = new Swiper(o.find('.swiper-container')[0], {
            initialSlide: defaultIndex,
            pagination: '.swiper-pagination',
            paginationClickable: true
          });//'.swiper-container'
          o.find('.pic_close button').click(function () {
            //preview.destroy();
            //o.remove();
          })

          //$('.picplayer').is(':visible')
          if ($(o).css('display')) {
            $(o.find('.swiper-container')[0]).click(function (e) {
              preview.destroy();
              $('.piclayer').remove();
              o.remove();
              e.preventDefault();
              preview = o = null;
            })
          }

        });
        scope.$on('$destroy', function () {
          $('.piclayer').remove();
          preview.destroy();
        });
      };
      $rootScope.$on('sxtImageView',player);
      if(scope.isContainer) {
        element.on ('click', player);
      }
    }
  }
})();
