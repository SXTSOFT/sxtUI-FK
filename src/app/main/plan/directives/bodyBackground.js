/**
 * Created by emma on 2016/10/11.
 */
(function(){
  'use strict';

  angular
    .module('app.plan')
    .directive('bodyBackground',bodyBackground);

  /**@ngInject*/
  function bodyBackground($mdSidenav,utils){
    return {
      scope:{
        value:'=bodyShow',
        data:'=bodyData'
      },
      link:link
    }

    function link(scope,element,ctrl,attr){
      scope.$watch('value',function(){
        if(scope.value){
          $('.body-background').css('display','block');
          $(element).addClass('on')
        }else{
          $('.body-background').css('display','none');
          $(element).removeClass('on');
        }
      })

      $(element).on('click',function(){
        if(scope.data){
          utils.alert('工期大于');
          return;
        }
        if(scope.$parent.vm.current.selectedTask&&!scope.$parent.vm.current.selectedTask.Duration&&!scope.$parent.vm.current.selectedTask.duration){
          utils.alert('工期大于0')
          return;
        }else{
          scope.value = false;
          $('.body-background').css('display','none');
          $(element).removeClass('on');
          $mdSidenav('right')
            .close();
        }
      })

      scope.$on('$destroy',function(){
        scope.value = false;
        $('.body-background').css('display','none');
        $(element).removeClass('on');
        $mdSidenav('right')
          .close();
      })
    }
  }
})();
