/**
 * Created by shaoshunliu on 2017/4/19.
 */
/**
 * Created by shaoshunliu on 2017/4/19.
 */
var app = angular.module('myApp', []);
app.controller("myController", function ($scope, $http) {
  var vm = this;

  var legend = [
    {value: 0, label: '未验', color: 'rgba(225,225,225,1)'},
    {value: 1, label: '不合格', color: 'red'},
    {value: 2, label: '合格', color: 'green'},
    {value: 4, label: '已确认', color: 'blue'},
    {value: -1, label: '不参与验收', color: '#555555'}
  ];


  getY = function (source, callbck) {
    var max = 1;
    source.forEach(function (w) {
      if (w.children) {
        var k = w.children.filter(function (q) {
          return q.length;
        });
        if (k.length) {
          var u = w.children;
          u.forEach(function (q) {
            if (q.length > max) {
              max = q.length;
            }
          });
          isRoom = true;
        } else {
          if (max < w.children.length) {
            max = w.children.length;
          }
        }
      }
    });
    callbck && callbck(max)
  }


  function getX(source, callback) {
    var x = [];
    source.forEach(function (k) {
      x.push({
        name: "",
        lst: []
      });
      k.children.forEach(function (q) {
        x.push({
          name: k.name,
          lst: q
        });
      })
    })
    return callback && callback(x);
  }



  function getSeries(souce) {
    var serial = [];
    var x = [];
    getX(souce, function (r) {
      x = r;
      x.forEach(function (q, i) {
        if (q.name) {
          q.lst && q.lst.forEach(function (m, j) {
            serial.push([i, j, m.status]);
          })
        }
      })
    })

    var linq = window.jslinq(x);
    var va = linq.select(function (o) {
      return o.name;
    })
    return {
      x: va.toList(),
      series: serial
    }
  }


  function getQuery(key) {
    var val;
    var href=window.location.href;
    var url= new window.URI(href);
    var query= url.query();
    query=query?query.split("&"):[];
    query.forEach(function (t) {
      t=t.split("=");
      if (t[0]==key){
        val=t[1];
      }
    })
    return val;
  }

  $scope.subject=decodeURI(getQuery("des"));
  window.localhost=getQuery('localhost');

  function getPlan(key,callback) {
    callback(getQuery(key));

  }


  function load(plan, callback) {
    var url = "/api/v1/Enterprise/report/AcceptanceDay/";
    if (plan) {
      url = url + "/" + plan;
    }
    $http.get(window.localhost + url).then(function (res) {
      $scope.data = res.data;
      var y = [];
      getY($scope.data.source, function (floors) {
        for (var i = 1; i <= floors; i++) {
          y.push(i + "层");
        }
      });
      var se = getSeries($scope.data.source)

      callback && callback({
        y: y,
        x: se.x,
        series: se.series
      });
      console.log($scope.data);
    })
  }

  getPlan("id",function (id) {
    load(id, function (option) {
      vm.option = {
        tooltip: {
          position: 'top',
          show: false
        },
        animation: false,
        grid: {
          // height: '50%',
          // y: '10%'
        },
        xAxis: {
          type: 'category',
          data: option.x,
          axisLabel: {
            interval: function (index, value) {
              var start = option.x.indexOf(value);
              var end = option.x.lastIndexOf(value);
              if (start == end) {
                return true;
              } else {
                var middle = (start + end) / 2;
                if (index == parseInt(middle)) {
                  return true;
                } else {
                  return false;
                }
              }
            },
            show: true
          },
          splitArea: {
            show: false
          }
        },
        yAxis: {
          type: 'category',
          data: option.y,
          splitArea: {
            show: false
          }
        },
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: [0],
            start:0,
            end:50
            // filterMode: 'filter'
          },
          {

            type: 'slider',
            xAxisIndex: [0],
            start:0,
            end:50
            // filterMode: 'empty'
          }
        ],
        visualMap: {
          top: 0,
          type: 'piecewise',
          pieces: legend,
          show: true,
          min: 0,
          max: 50,
          calculable: false,
          itemWidth: 5,
          orient: 'horizontal'
          // bottom: '15%'
        },
        series: [{
          name: 'Punch Card',
          type: 'heatmap',
          data: option.series,
          label: {
            normal: {
              show: false
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
        }]
      };
      var myChart = echarts.init(document.getElementById('chart'));
      myChart.setOption(vm.option);
    })
  })
});







