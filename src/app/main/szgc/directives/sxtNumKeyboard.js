/**
 * Created by emma on 2016/5/24.
 */
(function () {
  'use strict';

  angular
    .module('app.szgc')
    .directive('sxtNumKeyboard', sxtNumKeyboard);

  /** @Inject */
  function sxtNumKeyboard($timeout, $rootScope) {
    return {
      scope: {
        value: '=ngModel',
        show: '=',
        onNext: '&'
      },
      link: link,
      templateUrl: 'app/main/szgc/directives/sxtNumKeyboard.html'
    }

    function link(scope, element, attr, ctrl) {
      //console.log('a',scope.value)

      $rootScope.$on('keyboard:setvalue', function (e, v) {
        scope.value = v;
      })
      scope.ck = function (cmd, $event) {

        var str = (scope.value || '').toString(),
          num = parseFloat(str);
        if (isNaN(num)) {
          num = 0;
        }
        switch (cmd) {
          case 'ok':
            scope.value = isNaN(parseFloat(str)) ? '' : parseFloat(str);
            scope.ok && scope.ok();
            return;
          case -1:
            str = str.length > 0 ? str.substring(0, str.length - 1) : str;
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
            if (str.indexOf('.') == -1)
              str += '.';
            break;
          case 'close':
            scope.show = false;
            break;
          case 'next':
            scope.value = '';
            $rootScope.$emit('keyboard:next');
            return;
            break;
          case 'nextgx':
            $rootScope.$emit('keyboard:nextgx');
            return;
            break;
          case 'del':
            $rootScope.$emit('keyboard:del');
            return;
            break;
          default:
            str += cmd;
            break;
        }
        $rootScope.$emit('keyboard:value', str);
        scope.value = str;

      }
    }
  }


})();
