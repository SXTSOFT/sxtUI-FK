/**
 * Created by emma on 2016/5/24.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .directive('sxtNumInput', sxtNumInput);

  /** @Inject */
  function sxtNumInput($timeout){
    return {
      scope:{
        user:'=ngModel'
      },
      link:link,
      templateUrl:'app/main/szgc/directives/sxtNumInput.html'
    }

    function link(scope,element,attr,ctrl){
     // console.log('a',scope)
      scope.ck = function(cmd,$event){

        var str = (scope.user ||'').toString(),
          num = parseFloat(str);
        if(isNaN(num)){
          num = 0;
        }
        switch (cmd) {
          case 'ok':
            scope.user = isNaN(parseFloat(str))?'':parseFloat(str);
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
          case 'close':
            $('.numberpanel').css('display','none');
            $('.ybxm').css('padding-bottom','0');
            break;
          case 'next':
            $('.ybxm').animate({scrollTop:2400})
            break;
          case 'nextpoint':
            //$('.circles').children().children().eq(1).find('input').focus();
            break;
          default:
            str += cmd;
            break;
        }
        scope.user = str;
      }
    }
  }


})();
