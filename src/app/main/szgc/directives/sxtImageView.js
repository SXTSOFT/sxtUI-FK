/**
 * Created by zhangzhaoyong on 16/2/16.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .directive('sxtImageView',sxtImageViewDirective);

  /** @ngInject */
  function sxtImageViewDirective($rootScope, api, $q) {
    return {
      restrict: 'EA',
      link: link
    }

    function link(scope, element, attr, ctrl) {
      var preview,o;
      $rootScope.$on('sxtImageView', function (a, e) {
        if (preview)
          preview.destroy();
        if (o)
          o.remove();
        var request = [];
        e.groups.forEach(function (g) {
          request.push(api.szgc.FilesService.group(g));
        });
        $q.all(request).then(function (results) {


          var defaultIndex = 0;
          var imagedata = [];
          results.forEach(function (result) {
            result.data.Files.forEach(function (f) {
              imagedata.push(sxt.app.api + f.Url.substring(1));
            })
          });;
          if (!imagedata) {
            imagedata = [];
            $('img', element).each(function (index, el) {
              imagedata.push($(el).attr('src'));
            })
            defaultIndex = $('img', element).index($(e.target))
            if (defaultIndex == -1)
              defaultIndex = 0;
          }
          //console.log('img',img)
          var str = [];
          str.push('<div class="piclayer">\
        <div class="swiper-container"><div class="swiper-wrapper">')
          angular.forEach(imagedata, function (data) {
            var arl = data;
            str.push('<div class="swiper-slide"><p><img src="' + arl + '"></p></div>');
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
              o.remove();
              e.preventDefault();
              preview = o = null;
            })
          }

        });
        scope.$on('$destroy', function () {
          o.remove();
          preview.destroy();
        });
      });
    }
  }
})();
