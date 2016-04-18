/**
 * Created by jiuyuong on 2016/4/3.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .directive('sxtNumInput', sxtNumInput);

  /** @Inject */
  function sxtNumInput($timeout){
    return {
      scope:{
        value:'=ngModel',
        ok:'&',
        sliderStep:'=ngStep'
      },
      link:link,
      templateUrl:'app/main/xhsc/directive/sxtNumInput.html'
    }

    function link(scope,element,attr,ctrl){

      scope.cancel = function($event){
        $event.stopPropagation();
        $event.preventDefault();
      }
      scope.ck = function(cmd,$event){
        scope.cancel($event);
        var str = (scope.value ||'').toString(),
          num = parseFloat(str);
        if(isNaN(num)){
          num = 0;
        }
        switch (cmd) {
          case 'ok':
            scope.value = isNaN(parseFloat(str))?'':parseFloat(str);
            scope.ok && scope.ok();
            return;
          case -1:
            str = str.length > 0 ? str.substring (0, str.length - 1) : str;
            break;
          case 'ac':
            str = '';
            break;
          case '+-':
            str = (-num) + '';
            break;
          case '%':
            break;
          case '.':
            if (str.indexOf ('.') == -1)
              str += '.';
            break;
          default:
            str += cmd;
            break;
        }
        scope.value = str;

      }
      //scope.$watch('value',function(){
      // // scope.value2 =  isNaN(parseFloat(scope.value))?0:parseFloat(scope.value);
      // // scope.step = 0.1;
      //})
    }
  }


})();
