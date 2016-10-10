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
              {value: 0, label: '未报验', color: 'rgba(225,225,225,1)'},
              {value: 1, label: '待验', color: 'rgba(0,150,136,1)'},
              {value: 2, label: '合格', color: 'rgba(44,157,251,1)'},
              {value: 4, label: '不合格', color: 'red'},
              //{value: 8, label: '未整改', color: 'rgba(0,150,136,1)'},
              //{value: 16, label: '已整改', color: 'rgba(249,98,78,1)'}
            ];
          function setYAxis(){
            var regions=[];
            scope.build.regions.forEach(function(k){
              regions.push(angular.extend({},k));
            });
            if (!angular.isArray(regions)||!regions.length){
                return [];
            }
            var  floors=[];

            regions.forEach(function(k){
                if (k.RegionType==8){
                  floors.push(k);
                }
            });
            var maxRoomLen=0;
            floors.forEach(function(k){
              k.rooms=[];
              regions.forEach(function(n){
                  if (n.RegionType==16&& n.RegionID.indexOf(k.RegionID)>-1){
                    n.parent=k;
                    k.rooms.push(n);
                  }
              });
              if (k.rooms.length>maxRoomLen){
                maxRoomLen=k.rooms.length;
              }
              scope.procedures.forEach(function(n){
                //AcceptanceItemID
                var st= scope.build.status.find(function(m){
                    return m.AcceptanceItemID== n.AcceptanceItemID&& k.RegionID== m.AreaId;
                })
                if (st){
                  k.status= k.status?k.status:{};
                  k.status[st.AcceptanceItemID]=st.Status>2?4:st.Status;
                }
              })
            })
            floors.maxRoomLen=maxRoomLen;
            return floors;
          }
         //y轴
          var yAxisSource=setYAxis();
          var yAxis= $.map(yAxisSource,function(k){
              return k.RegionName;
          })
         //X轴
         function setXAxis(){
           var maxRoomLen=yAxisSource.maxRoomLen;
           var xAxis=[];
           scope.procedures.forEach(function(k){
              for (var i=0;i<=maxRoomLen;i++){
                xAxis.push({
                  AcceptanceItemID: k.AcceptanceItemID,
                  AcceptanceItemName:k.AcceptanceItemName
                });
              }
           })
           return xAxis;
          }
          var xAxisSource=setXAxis();
          var xAxis= $.map(xAxisSource,function(k){
            return k.AcceptanceItemName;
          });
          //设置serial
          function  setSeries(){
            function  setStatus(i,j){
              function  setRoomStatus(room){
                if (!room){
                  return "-";
                }
                var acceptanceItemID= x.AcceptanceItemID;
                var parent=room.parent;
                if (parent.status&&(parent.status[acceptanceItemID]||parent.status[acceptanceItemID]===0)){
                    return parent.status[acceptanceItemID];
                }
                var st= scope.build.status.find(function(m){
                  return m.AcceptanceItemID== acceptanceItemID&& room.RegionID== m.AreaId;
                })
                return  st? st.Status>2?4:st.Status:0;
              }

              //0 1 2 3 4 5 6 7
              var len=yAxisSource.maxRoomLen;
              if ((i+1)%(len+1)){
                var x=xAxisSource[i];
                var y=yAxisSource[j];
                var room= y.rooms[i%len]
                return setRoomStatus(room,x);
              }
              return "-";
            }

            var serial=[[]];
            var  t;
            var len=yAxisSource.maxRoomLen;
            for (var  j=0;j<yAxisSource.length;j++){
              for (var  i=0;i<xAxisSource.length;i++){
                var status=setStatus(i,j);
                serial.push([i,j,status]);
              }
            }
            return serial;
          }
          var  serial=setSeries();
          serial.shift();
          var option = {
            tooltip: {
            },
            grid: {
            },
            xAxis: {
              type: 'category',
              data:xAxis,
              axisLabel: {
                interval: function (index, value) {
                  return index % (yAxisSource.maxRoomLen + 1) == parseInt((yAxisSource.maxRoomLen)/2);
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
              data: yAxis,
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
              itemWidth: 5,
              orient: 'horizontal'
            }],
            series: [
              {
                type: 'heatmap',
                data:serial,
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
