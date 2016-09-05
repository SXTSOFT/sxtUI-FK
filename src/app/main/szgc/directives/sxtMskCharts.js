/**
 * Created by jiuyuong on 2016/7/31.
 */
(function () {
  'use strict';
  angular
    .module('app.szgc')
    .directive('sxtMskCharts',sxtMskCharts);

  /** @ngInject */
  function sxtMskCharts(api,$window,$timeout,$state,$q) {
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
        value: '=sxtMskCharts',
        build:'=',
        procedures:'='
      },
      link: function (scope, element) {
        var query = null;
        scope.build.query = function () {
          //scope.$watch('value', function () {
            if (!scope.value) return;
            var bid = scope.value.split('>'),
              legend = [
                {value: 0, label: '未验收', color: 'rgba(225,225,225,1)'},
                {value: 1, label: '总包已验', color: 'rgba(44,157,251,1)'},
                {value: 2, label: '监理已验', color: 'rgba(0,195,213,1)'},
                {value: 3, label: '监理/总包', color: 'rgba(0,150,136,1)'}/*,
                {value: 4, label: '监理不合格', color: 'rgba(249,98,78,1)'}*/
              ],
              gx = [];
          (query||(query=$q.all([
              api.szgc.vanke.rooms({building_id: bid[bid.length - 1]}),
              api.szgc.ProjectExService.building3(scope.value)]))
          ).then(function (rs) {
              var r = rs[0], r2 = rs[1],r3 ={data:{Rows:scope.procedures}} ;
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
              var x = [], y = [], data = [],points = [],
                _x = 1, _y = 0,_p;
              r3.data.Rows.forEach(function (g) {
                if(!g.checked) return;
                var fd = {
                  id:g.ProcedureId,
                  value:gx.length+1,
                  label:(g.Remark||g.ProcedureName).substring(0,4)
                };
                gx.push(fd);
                /*r2.data.Rows.forEach(function (row) {
                  if(row.RegionId.indexOf('-')!=-1)return;

                })*/
              });
              /*r2.data.Rows.forEach(function (row) {
                if(row.RegionId.indexOf('-')!=-1)return;
                var fd = gx.find(function (g) {
                  return g.id==row.ProcedureId;
                });
                if(!fd){
                  var p = r3.data.Rows.find(function (p1) {
                    return p1.ProcedureId==row.ProcedureId;
                  });
                  fd = {
                    id:p.ProcedureId,
                    value:gx.length+1,
                    label:p.ProcedureName,
                    date:getLast(row.JLDate,row.ZbDate)
                  }
                  gx.push(fd);
                }
                else{
                  fd.date = getLast(fd.date,getLast(row.JLDate,row.ZbDate));
                }
              });*/

              /*gx.sort(function (g1,g2) {
                return g2.date.localeCompare(g1.date);
              });*/


              floors.forEach(function (f) {
                y.push(f.floor + '层');
                data.push([0, _y, '-']);
                _x = 1;
                gx.forEach(function (gx) {
                  for (var i = 0; i < maxRooms; i++) {
                    var room = f.rooms[i];
                    if (room) {
                      var _z = r2.data.Rows.find(function (row) {
                        return row.ProcedureId == gx.id && (row.RegionId == room.room_id||room.building_id+'-'+room.floor==row.RegionId );
                      });
                      if (_z) {
                        _p = _z.ZbDate && _z.JLDate ? 3 :
                            _z.JLDate ? 2 :
                              _z.ZbDate ? 1 : 0;
                        data.push([_x, _y, _p, _z]);
                        if(_z.ECCheckResult == 1 || _z.ECCheckResult == 3){
                          points.push([_x, _y, _p, _z])
                        }
                      }
                      else
                        data.push([_x, _y, 0]);
                    }
                    else {
                      data.push([_x, _y, '-']);
                    }
                    if (_y == 0) x.push(gx.label);
                    _x++;
                  }
                  if (_y == 0) x.push(gx.label);
                  data.push([_x, _y, '-']);
                  _x++;
                });
                _y++;
              });
            //console.log('point',points)
              var option = {
                tooltip: {
                  formatter: function (arg, ticket, callback) {
                    //$state.go('app.szgc.project.view',{bathid:arg.value[3].Id});
                  }
                },
                grid: {
                },
                xAxis: {
                  type: 'category',
                  data: x,
                  axisLabel: {
                    interval: function (index, value) {
                      return index % (maxRooms + 1) == parseInt((maxRooms + 1)/2);
                    },
                    show: true
                  },
                  splitArea: {
                    show: false
                  }
                },
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
/*                dataZoom: [
                  {
                    type: 'slider',
                    show: true,
                    xAxisIndex: [0],
                    startValue: 0,
                    endValue: 100//, maxRooms+1
                  },
                  {
                    type: 'slider',
                    show: true,
                    yAxisIndex: [0],
                    left: '93%',
                    start: 0,
                    end: 100
                  },
                  {
                    type: 'inside',
                    xAxisIndex: [0],
                    startValue: 0,
                    endValue: 100//maxRooms+1
                  },
                  {
                    type: 'inside',
                    yAxisIndex: [0],
                    start: 0,
                    end: 100
                  }
                ],*/
                visualMap: [{
                  /*                    bottom: 0,
                   right: 0,*/
                  top:0,
                  type: 'piecewise',
                  pieces: legend,//gx.concat([{ value: 0, label: '未验', color: 'rgba(225,225,225,1)' }]),
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
                  data: data,
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
                },
                  {
                    name:'不合格',
                    type:'scatter',
                    data:points,
                    symbolSize: function (data) {
                      return 7;
                    },
                    itemStyle:{
                      normal:{
                        color:'rgb(255,0,0)'
                      }
                    }
                  }
                ]
              };
              var myChart = $window.echarts.init(element[0]);
              myChart.setOption(option);
              scope.build.loading = false;
              /*
              scope.build.gx = gx;
              scope.build.selected = gx[0];
              scope.build.goTo = function (g) {
                var ix = gx.indexOf(g);
                if(ix!=-1){
                  myChart.dispatchAction({
                    type: 'dataZoom',
                    dataZoomIndex: 0,
                    startValue: ix * (maxRooms) + ix,
                    endValue: ix * (maxRooms) + ix + maxRooms +1
                  });
                }
              }
              scope.$watch('build.selected',function () {
                if(scope.build.selected){
                  scope.build.goTo(scope.build.selected);
                }
              })
               */
            });

          //});
        };
      }
    }
  }

})();
