/**
 * Created by guowei on 2016/2/1.
 */
(function()
  {
    'use strict';
    angular
      .module('app.szgc')
      .service('showEcherts', function() {
        /**
         *echarts的饼图 这个方法有5个参数 :
         *@param {idMsg}     表示要在哪个div显示 的id值
         *@param {projectName}      表示项目名
         *@param {XdataMsg}   表示X轴信息
         *@param {yNCount, yOKCount}   表示y轴不合格合格数据
         */
        var showEchert = function(idMsg, projectName, XdataMsg, yNCount, yOKCount) {


            function ec(ec1) {
              // 基于准备好的dom，初始化echarts图表
              var myChart = ec1.init(document.getElementById(idMsg));
              var zrColor = require('zrender/tool/color');
              var colorList = [
                '#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
                '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
                '#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
                '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0'
              ];
              var itemStyle = {
                normal: {
                  color: function(params) {
                    if (params.dataIndex < 0) {
                      // for legend
                      return zrColor.lift(
                        colorList[colorList.length - 1], params.seriesIndex * 0.1
                      );
                    } else {
                      // for bar
                      return zrColor.lift(
                        colorList[params.dataIndex], params.seriesIndex * 0.1
                      );
                    }
                  }
                }
              };

              var option = {
                title: {
                  text: projectName + '报表',
                  x: 'center'
                  // subtext: '数据来自国家统计局',
                  //sublink: 'http://data.stats.gov.cn/search/keywordlist2?keyword=%E5%9F%8E%E9%95%87%E5%B1%85%E6%B0%91%E6%B6%88%E8%B4%B9'
                },

                tooltip: {
                  trigger: 'axis',
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  axisPointer: {
                    type: 'shadow',

                  },
                  itemGap: 10, // 主副标题纵向间隔，单位px，默认为10，

                  formatter: function(params) {
                    // for text color

                    /*
                     长字符串中插入换行符
                     str:需要换行的字符串
                     n:换行间隔字符数
                     */
                    function insertEnter(str, n) {
                      var len = str.length;
                      var strTemp = '';
                      if (len > n) {
                        strTemp = str.substring(0, n);
                        str = str.substring(n, len);
                        return strTemp + '<br />' + insertEnter(str, n);
                      } else {
                        return str;
                      }
                    }
                    var color = colorList[params[0].dataIndex];
                    var res = '<div style="color:' + color + '">';
                    res += '<strong>' + insertEnter(params[0].name, 15) + '</strong>'
                    for (var i = 0, l = params.length; i < l; i++) {
                      res += '<br/>' + params[i].seriesName + ' : ' + params[i].value
                    }
                    res += '</div>';
                    return res;
                  }
                },
                //legend: {
                //    x: 'right',
                //    data: ['2010', '2011', '2012', '2013']
                //},
                toolbox: {
                  show: true,
                  orient: 'vertical',
                  y: 'center',
                  feature: {
                    mark: {
                      show: true
                    },
                    dataView: {
                      show: true,
                      readOnly: false
                    },
                    restore: {
                      show: true
                    },
                    saveAsImage: {
                      show: true
                    }
                  }
                },
                calculable: true,

                xAxis: [{

                  type: 'category',
                  //坐标轴文本标签选项,当x轴的数据多余3条的时候字体就旋转20
                  axisLabel: {
                    rotate: XdataMsg.length > 3 ? -20 : 0,
                    show: true,
                    max: 10,
                    // formatter: function(values) {
                    //     //X坐标的显示太长了，格式化一下
                    //     var dataMsgC = values.substring(0,10);
                    //     return values = dataMsgC;
                    // },
                  },
                  data: XdataMsg
                }],

                grid: { // 控制图的大小，调整下面这些值就可以，
                  x: 3,
                  x2: 50,
                  y2: 50, // y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
                },

                yAxis: [{
                  type: 'value'
                }],
                series: [

                  {
                    name: '合格',
                    type: 'bar',
                    barWidth: 20,//控制柱子宽度
                    itemStyle: itemStyle,
                    barCategoryGap:40,//
                    data: yOKCount,

                  }, {
                    name: '不合格',
                    type: 'bar',
                    barWidth: 20,//控制柱子宽度
                    barCategoryGap:40,
                    itemStyle: itemStyle,
                    data: yNCount,

                  }

                ]

              };

              // 为echarts对象加载数据
              return myChart.setOption(option);

            };

        }
        return {
          showEchert: showEchert
        }
      });

  }
)();
