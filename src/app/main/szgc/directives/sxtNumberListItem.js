/**
 * Created by emma on 2016/5/25.
 */
(function(){
  'use strict';
  angular
    .module('app.szgc')
    .directive('sxtNumberListItem',sxtNumberListItem);

  /** @ngInject */
  function sxtNumberListItem(utils){
    function ybIsOkRow (item,value) {

      var zdpc = value;
      //var pattern = /^[0-9]+([.]\d{1,2})?$/;
      //if (zdpc) {
      //    if (!pattern.test(zdpc)) {
      //        item.isOK = false;
      //        return false;
      //    }
      //}
      zdpc = parseFloat(zdpc);
      var hgl = parseFloat(item.PassRatio),
        pc = item.DeviationLimit,
        op = pc.substring(0, 1),
        abs;
      if (isNaN(zdpc)) {
        return ;
      }
      var isIn = pc.match(/(-?[\d.])+/g); //(\.\d{2})?：

      // console.log("isIn", isIn);
      if (isIn && isIn.length > 0) {
        var min = 0,
          max = parseFloat(isIn[0]);

        if (isIn && isIn.length > 1) {
          min = parseFloat(isIn[1]);
          if (max < min) {
            max = min;
            min = parseFloat(isIn[0]);
          }
        }
        if (max < min) {
          var t11 = max;
          max = min;
          min = t11;
        }
        //abs = zdpc<min?max-zdpc:zdpc>max?zdpc-min:zdpc-min;
        abs = zdpc<min?max-zdpc:zdpc>max?zdpc-min:zdpc-min>max-zdpc?zdpc-min:max-zdpc;
        if (op == '±') {
          min = -max;
          abs = Math.abs(zdpc);
        } else if (op == '+') {
          min = 0;
          abs = Math.max( Math.abs(0-zdpc),zdpc);
        } else if (op == '-') {
          max = -max;
          abs = Math.max( Math.abs(0-zdpc),zdpc);
        } else if (op == '≥') {
          min = max;
          max = 10000000;
          abs = zdpc;
        } else if (op == '＞') {
          min = utils.math.sum(max, 0.1);
          max = 10000000;
          abs = zdpc;
        } else if (op == '≤') {
          min = -10000000;
          abs = 0 - zdpc;
        } else if (op == '＜') {
          max = utils.math.sub(max, 0.1);
          min = -10000000;
          abs = 0 - zdpc;
        }
        //if (abs < min || zdpc > max) {
        //  return {
        //    result:false,
        //    zdpc:abs
        //  };
        //}
        var max1 = max,min1=min;
        max1 = utils.math.mul(max, 1.5);
        if (min > 0)
          min1 = utils.math.mul(min, 0.5);
        else
          min1 = utils.math.mul(min, 1.5);
        //console.log(min, max, zdpc)
        if (zdpc < min1 || zdpc > max1) {
          return {
            result:false,
            allResult:false,
            zdpc:zdpc
          };
        }
        if (zdpc < min || zdpc > max) {
          return {
            result:false,
            zdpc:zdpc
          };
        }

        return {
          result:true,
          zdpc:zdpc
        };
      } else {
        return {
          result:true,
          zdpc:zdpc
        };
      }
    }

    return {
      restrict:'A',
      scope:{
        value:'=ngModel'
      },
      link:function(scope,element,attr,ctrl){


        scope.$watch(function(){
          return element.text()
        },function(){
           var  values = [],hgP= 0,maxpc=-10000,zdpc=null,els =element.find('.point span'), i= 0,l=els.length,isAllResult = true;
          els.each(function(){
            ++i;
            var v = $(this).hasClass('n')?'': parseFloat($(this).text().trim());
            if(v|| v=='0') {
              var result = ybIsOkRow(scope.value,v)
              if(result) {
                if(result.allResult===false){
                  isAllResult =false;
                }
                values.push({
                  isOK : result.result,
                  zdpc: result.zdpc,
                  value:v
                });
              }
              if(i==l){
                $(this).parent().parent().parent().append('<div flex="20" class="flex-20"><div class="point" ><span class="n">'+(values.length+1)+'</span></div></div>');
              }
            }
            else if(i>1&&i<l){
              if(!$(this).parent().hasClass('current')){
                $(this).parent().parent().remove();
                //$(this).parent().parent().parent().find('span').eq(l-1).text(l)
              }

            }


          });
          values.forEach(function(v){
            if(maxpc< v.zdpc){
              zdpc = v.value;
              maxpc = v.zdpc;
            }
            if(v.isOK){
              hgP++;
            }
          });

          scope.value.CheckNum = values.length;
          if(scope.value.CheckNum) {
            scope.value.PassRatio = utils.math.mul(utils.math.div(hgP, scope.value.CheckNum),100).toFixed(2);
            scope.value.isOK = isAllResult===false?false:scope.value.PassRatio>=80;
          }
          scope.value.MaxDeviation = (zdpc||zdpc ==0)?zdpc:null;
          scope.value.points = values;
        })
      }
    }
  }
})();
