/**
 * Created by emma on 2016/5/25.
 */
(function(){
  'use strict';
  angular
    .module('app.szgc')
    .directive('sxtNumberList',sxtNumberList);

  /** @ngInject */
  function sxtNumberList($rootScope){
    return {
      restrict:'A',
      scope:{
        show:'=',
        value:'=ngModel'
      },
      link:function(scope,element,attr,ctrl){
        element.on('click',' div.point',function(e){
          var idx = element.find('div.point').index($(e.target).parent());
          scope.show = true;
          scope.length = $(element).find('div.point').length;
          scope.$apply();
          pontTo(idx);
        });
        var currentPoint = null;
        function pontTo(index){
          if(currentPoint){
              currentPoint.removeClass('current').addClass('done');
          }
          scope.index = index;

          var p = currentPoint = $('div.point',element).eq(index),span = p.find('span');
          if(span.hasClass('n'))
           span.removeClass('n').empty();
          console.log('p', p.hasClass('point'))
          if(!p){
          }
          else{
            if(p.hasClass('point')){
              currentPoint.addClass('current');
              $rootScope.$emit('keyboard:setvalue',currentPoint.text());
              element.animate({
                scrollTop: Math.abs($('.addform').position().top- p.position().top+100)
              });
            }
          }
        }
        $rootScope.$on('keyboard:next',function(){
          var datas = $('.datas',element),eq=datas.index($(currentPoint.parents('.datas')[0]))+1;
          var nextItem = datas.eq(eq);
          if(currentPoint.parent().parent().find('.point').length>1){
            if(currentPoint && ((currentPoint.hasClass('current')))&&  !currentPoint.text().trim()){
              currentPoint.parent().remove();
            }
          }else{
            if(currentPoint && ((!currentPoint.hasClass('current')))&&  !currentPoint.text().trim()){
              currentPoint.parent().remove();
            }
          }

          if(eq<datas.length){
            pontTo($('div.point',element).index(nextItem.find('div.point').eq(0)));
          }else{
           // currentPoint.removeClass('current');
            scope.show = false;
          }
        });
        $rootScope.$on('keyboard:nextpoint',function(){
          pontTo(scope.index+1);
        });
        $rootScope.$on('keyboard:value',function($event,value){
          currentPoint && currentPoint.find('span').text(value);
        });
      }
    }
  }
})();
