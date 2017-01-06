/**
 * Created by shaoshun on 2017/1/5.
 */
/**
 * Created by lss on 2016/9/12.
 */
(function(){
  'use strict';

  angular
    .module('app.pcReport_ys')
    .controller('hzProblemController',hzProblemController);

  /**@ngInject*/
  function hzProblemController($scope,$stateParams ){
    var vm = this;
    var areaId= $stateParams.areaId;

    vm.source={
        head:[{
          name:"钢筋工程",
          sub:[{
            name:"检查验收次数",
            id:"00001"
          },{
            name:"验收质量问题总数",
            id:"00001"
          },{
            name:"及时整改完成率",
            id:"00001"
          }]
        },{
          name:"钢筋工程",
          sub:[{
            name:"检查验收次数",
            id:"00001"
          },{
            name:"验收质量问题总数",
            id:"00001"
          },{
            name:"及时整改完成率",
            id:"00001"
          }]
        },{
          name:"钢筋工程",
          sub:[{
            name:"检查验收次数",
            id:"00001"
          },{
            name:"验收质量问题总数",
            id:"00001"
          },{
            name:"及时整改完成率",
            id:"00001"
          }]
        }],
        body:[{
          id:"00002",
          val:[{
            id:"00001",
            value:12
          },{
            id:"00001",
            value:12
          },{
            id:"00001",
            value:12
          },{
            id:"00001",
            value:12
          },{
            id:"00001",
            value:12
          },{
            id:"00001",
            value:12
          },{
            id:"00001",
            value:12
          },{
            id:"00001",
            value:12
          },{
            id:"00001",
            value:12
          }]
        },{
          id:"00002",
          val:[{
            id:"00001",
            value:12
          },{
            id:"00001",
            value:12
          },{
            id:"00001",
            value:12
          },{
            id:"00001",
            value:12
          },{
            id:"00001",
            value:12
          },{
            id:"00001",
            value:12
          },{
            id:"00001",
            value:12
          },{
            id:"00001",
            value:12
          },{
            id:"00001",
            value:12
          }]
        },{
          id:"00002",
          val:[{
            id:"00001",
            value:12
          },{
            id:"00001",
            value:12
          },{
            id:"00001",
            value:12
          },{
            id:"00001",
            value:12
          },{
            id:"00001",
            value:12
          },{
            id:"00001",
            value:12
          },{
            id:"00001",
            value:12
          },{
            id:"00001",
            value:12
          },{
            id:"00001",
            value:12
          }]
        }]
    }
    wrap(vm.source);
    function wrap(source) {
      source.subTitle = [];
      if (source.head) {
        if (source.head){
          source.head.forEach(function (k) {
            k.sub.forEach(function (n) {
              source.subTitle.push(n);
            });
          });
        }
        if (source.body){
          var index=1;
          source.body.forEach(function (k) {
            k.num=index++;
          });
        }
      }
    }
  }
})();
