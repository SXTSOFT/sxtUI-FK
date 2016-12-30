/**
 * Created by shaoshunliu on 2016/11/13.
 */
/**
 * Created by lss on 2016/10/20.
 */
/**
 * Created by emma on 2016/6/12.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('standarRegionController',standarRegionController);

  /**@ngInject*/
  function standarRegionController($scope,db,api,$q,remote,$state,$timeout,$stateParams,xhscService){
    var vm = this;
    var projectID=$stateParams.projectID;

    remote.Project.getRegionWithRight(projectID).then(function (res) {
      var result= xhscService.buildRegionTree(res.data,1);
      vm.souce=result&&result.Children;
      vm.show=true;
    });

  }
})();
