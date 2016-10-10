/**
 * Created by lss on 2016/10/7.
 */
(function () {
  'use strict';
  angular
    .module('app.pcReport_sl')
    .directive('sxtMskCharts',sxtMskCharts);

  /** @ngInject */
  function sxtMskCharts(api,$window,$timeout,$state,$q,remote) {
    return {
      scope: {
        build:'=',
        procedures:'='
      },
      link: function (scope, element) {
        var query = null;
        scope.build.query = function () {
          var  legend = [
              {value: 1, label: '待验', color: 'rgba(225,225,225,1)'},
              {value: 2, label: '合格', color: 'rgba(44,157,251,1)'},
              {value: 4, label: '不合格', color: 'rgba(0,195,213,1)'},
              {value: 8, label: '未整改', color: 'rgba(0,150,136,1)'},
              {value: 16, label: '已整改', color: 'rgba(249,98,78,1)'}
            ];
          function setYAxis(){
            var regions=scope.build.regions;
            if (!angular.isArray(regions)||!regions.length){
                return [];
            }
            var  floors=[];
            regions.forEach(function(k){
                if (k.RegionType==8){
                  floors.push(k.RegionName);
                }
            });
            return floors;
          }
          var option = {
            tooltip: {
            },
            grid: {
            },
            xAxis: {
              type: 'category',
              data:["02钢筋绑扎","03钢筋捆绑","地面"],
              axisLabel: {
                interval: function (index, value) {
                  //return index % (maxRooms + 1) == parseInt((maxRooms + 1)/2);
                  return true;
                },
                show: true
              },
              splitArea: {
                show: false
              }
            },
            yAxis: {
              type: 'category',
              data: setYAxis(),
              min: 0,
              max: 50,
              interval: 1,
              axisLabel: {
                textStyle: {
                  fontSize: 8
                }
              },
              splitArea: {
                show: false
              }
            },
            visualMap: [{
              top:0,
              type: 'piecewise',
              pieces: legend,
              show: true,
              min: 0,
              max: 32,
              calculable: false,
              //itemWidth: 5,
              orient: 'horizontal'
            }],
            series: [
              {
                type: 'heatmap',
                data: [[0,1,2],[1,2,4],[1,15,4]],
                label: {
                  normal: {
                    show: false,
                    textStyle: {
                      fontSize: 5
                    }
                  }
                },
                itemStyle: {
                  normal: {
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 1)'
                  },
                  emphasis: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 1)'
                  }
                }
              }
            ]
          };
          $timeout(function(){
            var myChart = $window.echarts.init(element[0]);
            myChart.setOption(option);
          })
        };
      }
    }
  }

})();
