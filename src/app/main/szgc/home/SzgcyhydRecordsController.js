/**
 * Created by zhangzhaoyong on 16/2/3.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .controller('SzgcyhydRecordsController', SzgcyhydRecordsController);

  /** @ngInject */
  function SzgcyhydRecordsController(api,$scope,$q,$stateParams)
  {
    var vm = this;
    var projectId = $stateParams.idTree.split('>')[0];
    api.szgc.addProcessService.queryByProjectAndProdure3(projectId,{isGetChilde:1,regionIdTree:$stateParams.idTree}).then(function (result) {
      vm.Rows = result.data.Rows.filter(function (item) {

        return item.RegionType==8||item.RegionId==$stateParams.pid;
      });
      //console.log('vm.Rows',vm.Rows)
    });

  }

})();
