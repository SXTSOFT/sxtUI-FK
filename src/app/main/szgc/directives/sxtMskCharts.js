/**
 * Created by jiuyuong on 2016/7/31.
 */
(function () {
  'use strict';
  angular
    .module('app.szgc')
    .directive('sxtMskCharts',sxtMskCharts);

  /** @ngInject */
  function sxtMskCharts(api,$window,$timeout,$state) {
    return {
      scope: {
        value: '=sxtMskCharts',
        build:'='
      },
      link: function (scope, element) {
        $timeout(function () {
          var myChart = $window.echarts.init(element[0]);
          scope.$watch('value', function () {
            if (!scope.value) return;
            var bid = scope.value.split('>'),
              legend = [
                  { value: 0, label: '未验收', color: 'rgba(225,225,225,1)' },
                  { value: 1, label: '总包已验', color: 'rgba(44,157,251,1)' },
                  { value: 2, label: '监理已验', color: 'rgba(0,195,213,1)' },
                  { value: 3, label: '监理/总包', color: 'rgba(0,120,210,1)' },
                  { value: 4, label: '监理不合格', color: 'rgba(249,98,78,1)' }
              ],
              gx = [
                { value: 1, label: '橱柜', id: '1c419fcc-24a9-4e38-9132-ce8076051e6a', color: 'rgba(193,35,43,1)' },
                { value: 2, label: '油漆', id: 'a3776dab-9d80-4ced-b229-e6bfc51f7988', color: 'rgba(181,195,52,1)' },
                { value: 3, label: '瓷砖', id: '702d964d-cd97-4217-8038-ce9b62d7584b', color: 'rgba(252,206,16,1)' },
                { value: 4, label: '墙板', id: '8bfc6626-c5ed-4267-ab8f-cb2294885c25', color: 'rgba(193,35,43,1)' },
                { value: 5, label: '门窗', id: '51bb20e2-92a2-4c9f-85a9-c4545e710cf0', color: 'rgba(181,195,52,1)' }
              ], getNumName = function (str) {
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

            api.szgc.vanke.rooms({ building_id: bid[bid.length - 1] }).then(function (r) {
              var floors = [],
                rooms = [];
              r.data.data.sort(function (i1, i2) {
                var n1 = getNumName(i1.floor),
                  n2 = getNumName(i2.floor),
                  r1 = 0;
                if (!isNaN(n1) && !isNaN(n2))
                  r1 = n1 - n2;
                else if ((isNaN(n1) && !isNaN(n2)))
                  r1 = 1;
                else if ((!isNaN(n1) && isNaN(n2)))
                  r1 = -1;
                else
                  r1 = i1.floor.localeCompare(i2.floor);

                if (r1 != 0) return r1;

                n1 = getNumName(i1.name),
                  n2 = getNumName(i2.name);
                if (!isNaN(n1) && !isNaN(n2))
                  return n1 - n2;
                else if ((isNaN(n1) && !isNaN(n2)))
                  return 1;
                else if ((!isNaN(n1) && isNaN(n2)))
                  return -1;
                else
                  return i1.name.localeCompare(i2.name);

              });
              api.szgc.ProjectExService.building3(scope.value).then(function (r2) {
                var floors = [], maxRooms = 0;
                r.data.data.forEach(function (room) {
                  var fd = floors.find(function (f) {
                    return f.floor === room.floor;
                  });
                  if (!fd) {
                    floors.push({
                      edit: false,
                      floor: room.floor,
                      rooms: [room]
                    });
                  }
                  else {
                    fd.rooms.push(room);
                  }
                });
                floors.forEach(function (f) {
                  if (maxRooms < f.rooms.length)
                    maxRooms = f.rooms.length;
                });
                var x = [], y = [], data = [],
                  _x = 1, _y = 0, _z = 0;
                floors.forEach(function (f) {
                  y.push(f.floor + '层');
                  data.push([0, _y, '-']);
                  _x = 1;
                  gx.forEach(function (gx) {
                    for (var i = 0; i < maxRooms; i++) {
                      var room = f.rooms[i];
                      if (room) {
                        var _z = r2.data.Rows.find(function (row) {
                          return row.ProcedureId == gx.id && row.RegionId == room.room_id;
                        });
                        if (_z)
                          data.push([_x, _y, (_z.ECCheckResult == 1 || _z.ECCheckResult == 3) ? 4 :
                            _z.ZbDate && _z.JLDate ? 3:
                              _z.JLDate? 2:
                                _z.ZbDate?1: 0
                            , _z]);
                        else
                          data.push([_x, _y, 0]);
                      }
                      else {
                        data.push([_x, _y, '-']);
                      }
                      if (_y == 0) x.push(gx.label);
                      _x++;
                    }
                    //if (_y == 0) x.push(String(_x));
                    data.push([_x, _y, '-']);
                    _x++;
                  });
                  _y++;
                });

                var option = {
                  title: false,
                  tooltip: {
                    formatter: function (arg, ticket, callback) {
                      $state.go('app.szgc.project.view',{bathid:arg.value[3].Id});
                      /*var g = gx[parseInt(arg.data[0] / (maxRooms + 1))],
                        f = floors[arg.data[1]],
                        room = f.rooms[arg.data[0] % (maxRooms + 1) - 1];
                      return room.name + ' ' + g.label + ' ' + (arg.value[3] ? '(' + arg.value[3].JLDate + ')' + (
                          arg.value[3].ECCheckResult == 1 ? '初验不合格' :
                            arg.value[3].ECCheckResult == 2 ? '初验合格' :
                              arg.value[3].ECCheckResult == 3 ? '复验不合格' :
                                arg.value[3].ECCheckResult == 4 ? '复验合格' :
                                  ''
                        ) : '未验');*/
                    }
                  },
                  animation: false,
                  grid: {
                    height: '85%',
                    y: '5'
                  },
                  xAxis: {
                    type: 'category',
                    data: x,
                    axisLabel: {
                      interval: function (index, value) {
                        return index % (maxRooms + 1) == 1;
                      },
                      show: true
                    },
                    splitArea: {
                      show: false
                    }
                  },
                  dataZoom: [{
                    type: 'inside'
                  }],
                  yAxis: {
                    type: 'category',
                    data: y,
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
                  visualMap: {
                    bottom: 0,
                    right: 0,
                    type: 'piecewise',
                    pieces: legend,//gx.concat([{ value: 0, label: '未验', color: 'rgba(225,225,225,1)' }]),
                    show: true,
                    min: 0,
                    max: 5,
                    calculable: false,
                    itemWidth:5,
                    orient: 'horizontal'
                  },
                  series: [{
                    type: 'heatmap',
                    data: data,
                    label: {
                      normal: {
                        show: false,
                        textStyle:{
                          fontSize:5
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
                  }]
                };

                myChart.setOption(option);
                scope.build.loaded = true;
              });
            });

          });
        },10);

      }
    }
  }

})();
