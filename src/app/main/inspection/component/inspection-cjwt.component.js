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
  function inspectionCjwtController($scope,utils,$state,$rootScope,api,$stateParams){
    var vm = this;
    vm.parm={
      type:'delivery',
      parent_id:'',
      enabled:true,
      page_size:10,
      page_number:1
    }
    vm.currentQ = 0
      api.inspection.estate.issues_tree(vm.parm).then(function (r) {

        vm.options=r.data.data;

      });



    $rootScope.shell.prev = '返回';
    utils.onCmd($scope,['prev'],function(cmd,e){


    })
    vm.select = function(num){
      vm.currentQ = num
    }

    vm.check = function (q,id) {
      $state.go('app.inspection.check',{issues:id,question:q,publicquestion:q,showPopup:false,delivery_id:$stateParams.delivery_id})
    }
  }
})();
