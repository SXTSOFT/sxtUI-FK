/**
 * Created by emma on 2016/6/6.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxtestController',gxtestController);

  /**@ngInject*/
  function gxtestController($scope){
    var vm = this;



    vm.procedureData = [{
      procedureName:'机电1',
      children:[{
        name:'消防',
        procedureCh:[{
          name:'铝合金1'
        },{
          name:'铝合金2'
        },{
          name:'铝合金2'
        },{
          name:'铝合金2'
        },{
          name:'铝合金2'
        },{
          name:'铝合金2'
        },{
          name:'铝合金2'
        },{
          name:'铝合金2'
        },{
          name:'铝合金2'
        },{
          name:'铝合金2'
        },{
          name:'铝合金2'
        },{
          name:'铝合金2'
        }]
      },{
        name:'空调',
        procedureCh:[{
          name:'空调1'
        },{
          name:'空调2'
        },{
          name:'空调2'
        },{
          name:'空调2'
        },{
          name:'空调2'
        },{
          name:'空调2'
        }]
      },{
        name:'弱电',
        procedureCh:[{
          name:'空调1'
        },{
          name:'空调2'
        }]
      }]
    },{
      procedureName:'土建',
      children:[{
        name:'幕墙',
        procedureCh:[{
          name:'空调1'
        },{
          name:'空调2'
        }]
      },{
        name:'钢筋',
        procedureCh:[{
          name:'空调1'
        },{
          name:'空调2'
        }]
      },{
        name:'栏杆',
        procedureCh:[{
          name:'空调1'
        },{
          name:'空调2'
        }]
      }]
    }]
  }
})();
