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
    function getNumName(str) {
      str = str.replace('十', '10')
        .replace('九', '9')
        .replace('八', '8')
        .replace('七', '7')
        .replace('六', '6')
        .replace('五', '5')
        .replace('四', '4')
        .replace('三', '3')
        .replace('二', '2')
        .replace('一', '1')
        .replace('十一', '11')
        .replace('十二', '12')
        .replace('十三', '13')
        .replace('十四', '14')
        .replace('十五', '15')
        .replace('十六', '16')
        .replace('十七', '17')
        .replace('十八', '18')
        .replace('十九', '19')
        .replace('二十', '20');
      var n = parseInt(/[-]?\d+/.exec(str));
      return n;
    }
    function getLast(d1,d2) {
      //var arr = Array.prototype.slice.call(arguments);
      if(d1 && d2){
        return d1.localeCompare(d2)>0?d1:d2
      }
      return d1||d2;
    }
    return {
      scope: {
        build:'=',
        procedures:'='
      },
      link: function (scope, element) {
        var query = null;
        scope.build.loading = false;
        scope.build.query = function () {
          var  legend = [
              {value: 1, label: '待验', color: 'rgba(225,225,225,1)'},
              {value: 2, label: '合格', color: 'rgba(44,157,251,1)'},
              {value: 4, label: '不合格', color: 'rgba(0,195,213,1)'},
              {value: 8, label: '未整改', color: 'rgba(0,150,136,1)'},
              {value: 16, label: '已整改', color: 'rgba(249,98,78,1)'}
            ];

          var option = {
            tooltip: {
            },
            grid: {
            },
            xAxis: {
              type: 'category',
              data: [],
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
              data: [],
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
              max: 5,
              calculable: false,
              itemWidth: 5,
              orient: 'horizontal'
            }],
            series: [
              {
                type: 'heatmap',
                data: [],
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
          scope.build.loading = false;
          $timeout(function(){
            var myChart = $window.echarts.init(element[0]);
            myChart.setOption(option);
          })
          //(query||(query=$q.all([
          //  remote.Project.queryAllBulidings(projectId),
          //  remote.Procedure.getRegionStatus(projectId)]))
          //).then(function (rs) {
          //
          //  var option = {
          //    tooltip: {
          //    },
          //    grid: {
          //    },
          //    xAxis: {
          //      type: 'category',
          //      data: [],
          //      axisLabel: {
          //        interval: function (index, value) {
          //          //return index % (maxRooms + 1) == parseInt((maxRooms + 1)/2);
          //          return true;
          //        },
          //        show: true
          //      },
          //      splitArea: {
          //        show: false
          //      }
          //    },
          //    yAxis: {
          //      type: 'category',
          //      data: [],
          //      min: 0,
          //      max: 50,
          //      interval: 1,
          //      axisLabel: {
          //        textStyle: {
          //          fontSize: 8
          //        }
          //      },
          //      splitArea: {
          //        show: false
          //      }
          //    },
          //    visualMap: [{
          //      top:0,
          //      type: 'piecewise',
          //      pieces: legend,
          //      show: true,
          //      min: 0,
          //      max: 5,
          //      calculable: false,
          //      itemWidth: 5,
          //      orient: 'horizontal'
          //    }],
          //    series: [
          //      {
          //        type: 'heatmap',
          //        data: [],
          //        label: {
          //          normal: {
          //            show: false,
          //            textStyle: {
          //              fontSize: 5
          //            }
          //          }
          //        },
          //        itemStyle: {
          //          normal: {
          //            borderWidth: 1,
          //            borderColor: 'rgba(255, 255, 255, 1)'
          //          },
          //          emphasis: {
          //            shadowBlur: 10,
          //            shadowColor: 'rgba(0, 0, 0, 1)'
          //          }
          //        }
          //      },
          //      {
          //        name:'不合格',
          //        type:'scatter',
          //        data:points,
          //        symbolSize: function (data) {
          //          return 7;
          //        },
          //        itemStyle:{
          //          normal:{
          //            color:'rgb(255,0,0)'
          //          }
          //        }
          //      }
          //    ]
          //  };
          //  var myChart = $window.echarts.init(element[0]);
          //  myChart.setOption(option);
          //  scope.build.loading = false;
          //});
        };
      }
    }
  }

})();
