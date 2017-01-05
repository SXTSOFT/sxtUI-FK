/**
 * Created by shaoshun on 2017/1/5.
 */
/**
 * Created by lss on 2016/9/13.
 */
/**
 * Created by lss on 2016/9/8.
 */
/**
 * Created by emma on 2016/6/7.
 */
(function(){
  'use strict';

  angular
    .module('app.pcReport_sl')
    .controller('scJtController',scJtController);

  /**@ngInject*/
  function scJtController($scope,remote,$mdDialog,$state,$rootScope,$timeout,$window){
    var vm = this;
    vm.source={
      head:[{
        id:"00001",
        name:"深圳雅宝项目5号地块"
      },{
        id:"00002",
        name:"惠州天睿"
      },{
        id:"00003",
        name:"星河传奇"
      },{
        id:"00004",
        name:"常州国际"
      }],
     data:[{
        num:1,
        name:"砼工程",
        children:[{
          name:"砼结构垂直度",
          value:[{
            id:"00001",
            val:12
          },{
            id:"00001",
            val:12
          },{
            id:"00001",
            val:12
          },{
            id:"00001",
            val:12
          }]
        },{
          name:"砼结构平整度",
          value:[{
            id:"00001",
            val:12
          },{
            id:"00001",
            val:12
          },{
            id:"00001",
            val:12
          },{
            id:"00001",
            val:12
          }]
        },{
          name:"截面尺寸",
          value:[{
            id:"00001",
            val:12
          },{
            id:"00001",
            val:12
          },{
            id:"00001",
            val:12
          },{
            id:"00001",
            val:12
          }]
        }]
     },{
       num:2,
       name:"砼工程",
       children:[{
         name:"砼结构垂直度",
         value:[{
           id:"00001",
           val:12
         },{
           id:"00001",
           val:12
         },{
           id:"00001",
           val:12
         },{
           id:"00001",
           val:12
         }]
       },{
         name:"砼结构平整度",
         value:[{
           id:"00001",
           val:12
         },{
           id:"00001",
           val:12
         },{
           id:"00001",
           val:12
         },{
           id:"00001",
           val:12
         }]
       },{
         name:"截面尺寸",
         value:[{
           id:"00001",
           val:12
         },{
           id:"00001",
           val:12
         },{
           id:"00001",
           val:12
         },{
           id:"00001",
           val:12
         }]
       }]
     }]
    }
    wrap(vm.source);
    console.log(vm.source.data);
    function wrap(source) {
      var data=source&&source.data?source.data:null;
      if (angular.isArray(data)){
        var index=1;
        source.rows=[];
        data.forEach(function (k) {
          k.num=index;
          k.isGroup=true;
          source.rows.push(k);
          var _index=1;
          k.children.forEach(function (n) {
            n.num=index+"."+_index;
            source.rows.push(n);
            _index++;
          });
          index++;
        });
      }
    }
  }
})();
