/**
 * Created by emma on 2016/11/15.
 */
(function(){
  'use strict';

  angular
    .module('app.inspection')
    .component('inspectionCjwt',{
      templateUrl:'app/main/inspection/component/inspection-cjwt.html',
      controller:inspectionCjwtController,
      controllerAs:'vm'
    });

  /**@ngInject*/
  function inspectionCjwtController($scope,utils,$state,$rootScope,api){
    var vm = this;
    vm.parm={
      type:'delivery',
      parent_id:'',
      enabled:true,
      page_size:10,
      page_number:1
    }
    api.inspection.estate.issues_tree(vm.parm).then(function (r) {
      debugger;

    });
    vm.currentQ = 0
    vm.options = [
      {name:'三表',question:[
        {name:'电表',zimu:'SB'},{name:'水表',zimu:'SB'},{name:'天然气表',zimu:'SB'}
      ]},
      {name:'入户门',question:[
        {name:'sdf',zimu:'RM'},{name:'sefc',zimu:'RM'},{name:'sfd',zimu:'RM'}
      ]},
      {name:'地面',question:[
        {name:'厨房',zimu:'DM'},{name:'客厅',zimu:'DM'}
      ]},
      {name:'墙面',question:[
        {name:'墙面开裂',zimu:'QM'},{name:'墙面空鼓',zimu:'QM'}
      ]}
    ]

    $rootScope.shell.prev = '返回';
    utils.onCmd($scope,['prev'],function(cmd,e){


    })
    vm.select = function(num){
      vm.currentQ = num
    }

    vm.check = function (q) {
      $state.go('app.inspection.check',{question:q,showPopup:true})
    }
  }
})();
