/**
 * Created by jiuyuong on 2016/4/3.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .directive('sxtNumInput', sxtNumInput);

  /** @Inject */
  function sxtNumInput($timeout,utils){
    return {
      scope:{
        value:'=ngModel',
        ok:'&'
      },
      link:link,
      templateUrl:'app/main/xhsc/directive/sxtNumInput.html'
    }

    function link(scope,element,attr,ctrl){
      scope.ck = function(cmd){
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
      scope.$watch('value',function(){
        if(!scope.value)return;
        var ds = scope.value.split('.');
        if(ds.length==2 && ds[1]){
          scope.min = parseFloat( ds[0]+'.'+ds[1].substring(0,ds[1].length-1));
          scope.step = utils.math.div(1,Math.pow(10,ds[1].length));
          scope.max = utils.math.sum(scope.min,utils.math.mul(scope.step,10));
        }
        else{
          var c = parseInt(ds[0]),
            cl = 0,cn = Math.pow(10,cl);
          while (c>cn && c%cn==0){
            cn = Math.pow(10,++cl);
          }
          cn = Math.pow(10,cl-1);
          scope.min = parseInt(ds[0].substring(0,ds[0].length-cl))*cn*10;
          scope.step = cn;
          scope.max = scope.min+(scope.step*10);
        }
        console.log('s',scope.min,scope.step,scope.max);
      });
      scope.$watch('value2',function(){
        scope.value = scope.value2;
      })
    }
  }


})();
