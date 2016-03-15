/**
 * Created by jiuyuong on 2016/3/15.
 */
(function(){
  'use strict';
  angular
    .module('app.szgc')
    .directive('sxtDplayer',sxtDplayer);

  /** @ngInject */
  function sxtDplayer($timeout,sxt){
    return {
      restrict:'A',
      scope:{
        images:'=sxtDplayer'
      },
      link:link
    }

    function link(scope,element,attr,ctrl){
      var o;
      scope.$watch('images', function () {
        if (!scope.images) return;
        if (o) element.empty();

        $timeout(function () {
          var str = [];
          str.push('<div class="flip-items" style="display:none"><ul >');
          scope.images.forEach(function (img,i) {
            str.push('<li title="' + (i + 1) + '"><div class="hs"><img src="' + sxt.app.api + img.Url.substring(1) + '" /><p>'+img.CreateDate+'('+(i+1)+'/'+scope.images.length+')</p></div></li>')
          })
          str.push('</ul></div>');
          o = $(str.join('')).appendTo(element);
          var h = element.height();
          o.find('img').height(h-50)
          o.height(h);
          o.flipster({
            start: 0,
            style: 'carousel',
            spacing: -0.5,
            nav: false,
            buttons: true,
            loop: true
          });
        }, 500);
      });
    }
  }
})();
