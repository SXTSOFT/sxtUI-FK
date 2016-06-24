/**
 * Created by emma on 2016/6/21.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxmainController',gxmainController);

  /**@ngInject*/
  function gxmainController(db,remote,localPack,xhUtils,$rootScope,$scope,pack,utils,stzlServices,$stateParams){
    var vm = this;
    remote.Assessment.Project.getMap().then(function(result){
      vm.projects = result.data;
      console.log('map',result)
    })


  }
})();
