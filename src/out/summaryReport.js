/**
 * Created by shaoshunliu on 2017/4/19.
 */
angular.module('myApp', [])
  .controller("myController",function ($scope,$http,$timeout) {
  var vm=this;

    function getPlan(key,callback) {
      callback(getQuery(key));

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
  var legend=[],data=[];
  vm.load=function (plan,callback) {
    var url="/api/v1/Enterprise/report/planWholeReport/";
    if (plan){
      url=url+"/"+plan;
    }

    function getName(categories,questionNum,curentNum) {
      var percent;
      if (curentNum){
         percent=((curentNum/questionNum)*100).toFixed(0);
         return categories+":"+percent+"%";
      }
      if (questionNum){
        percent=((categories.rate/questionNum)*100).toFixed(0);
        return (categories.fullName+":"+percent+"%");
      }
    }


    $http.get(localhost+ url).then(function (res) {
      $timeout(function () {
        $scope.data=res.data;
        console.log($scope.data);
        $scope.data.problems.forEach(function (k) {
          k.parts=k.parts.join(",");
        })
        var questionNum= $scope.data.base.questionNum;
        if (questionNum){
          var name;
          $scope.data.categories.forEach(function (w) {
            name=getName(w,questionNum);
            data.push({
              value:w.rate,
              name:name
            })
            legend.push(name);
          });
          var jslinq=window.jslinq($scope.data.categories);
          var num=questionNum-jslinq.sum(function (w) {
              return w.rate;
            });
          if (num){
            name=getName("其他",questionNum,num)
            legend.push(name);
            data.push({
              value:num,
              name:name
            })
          }
          if (callback){
            callback($scope.data)
          }
        }
      })
    })
  }


  getPlan("id",function (id) {
    vm.load(id,function (r) {
      vm.option = {
        title : {
          text: '问题分类统计',
          x:'center'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: legend
        },
        series : [
          {
            name: '访问来源',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      var myChart = echarts.init(document.getElementById('chart'));
      myChart.setOption(vm.option);
    });
  })

});

// window.localhost="http://emp.chngalaxy.com:9091";
