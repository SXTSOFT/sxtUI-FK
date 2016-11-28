/**
 * Created by emma on 2016/11/15.
 */
(function(){
  'use strict';

  angular
    .module('app.inspection')
    .directive('sxtProblemDate',sxtWtPop);

  /**@ngInject*/
  function sxtWtPop(xhUtils,$mdPanel,$state){
    return {
      scope:{
        show:'='
      },
      templateUrl:'app/main/inspection/statistics/sxt-problem-date.html',
      link:link
    }

    function link(scope,element,attr,ctrl){
      scope.labels=[];
      scope.series=[];
      scope.count=[
        {title:'未开始',value:20,percentage:'50%',color:'red'},
        {title:'已开始',value:20,percentage:'33%',color:'red'},
        {title:'已完成',value:10,percentage:'17%',color:'red'}
      ];

      scope.count.forEach(
        function (data) {
          scope.labels.push(data.title  +data.percentage);
          scope.series.push(data.value);
        }
      )

      scope.$watch('show',function () {
        if(scope.show){

          scope.pieChart = {
            data             : {
              labels: scope.labels,
              series:scope.series
            },
            options          : {
              labelInterpolationFnc: function (value)
              {
                return value[0];
              }
            },
            responsiveOptions: [
              ['screen and (min-width: 240px)', {
                chartPadding         : 0,
                labelOffset          : 0,
                labelDirection       : 'explode',
                labelInterpolationFnc: function (value)
                {
                  return value;
                }
              }],
              ['screen and (min-width: 100px)', {
                labelOffset : 40,
                chartPadding: 30
              }]
            ]

          };


        }
      })




      scope.cancel = function() {
        scope.show = false;

        //$(element).css('display','none')
      }
      scope.$on('$destroy',function () {
        console.log('b')
      })
    }
  }
})();
