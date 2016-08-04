/**
 * Created by emma on 2016/7/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxzgreportController',gxzgreportController);

  /**@ngInject*/
  function gxzgreportController(remote,$stateParams,$scope,$timeout){
    var vm = this;
      vm.Inspection = $stateParams.InspectionId;
      vm.AcceptanceName = $stateParams.acceptanceItemName;
      vm.acceptanceItemId = $stateParams.acceptanceItemID;

    vm.Regions = [];
    vm.info = {

    }
    remote.Procedure.getZgReport(vm.Inspection).then(function(result){
      console.log('r2',result)
      result.data.Areas&&result.data.Areas.forEach(function(item){
        vm.Regions.push({AreaId:item.AreaId});
        item.Classification.forEach(function(_it){
          _it.rowspan = _it.Children.length;
        })
      })

      var pics=[];
      vm.pics=[];

      result.data.AcceptancePicture && result.data.AcceptancePicture.forEach(function(pic,index){
        pic.index = index+1;
        if(pics.length<4){
          pics.push(pic)
        }else{
          vm.pics.push(pics);
          pics = [pic];
        }
      })
      vm.pics.push(pics)
      vm.pics.forEach(function(p){
        while(p.length<4){
          p.push({});
        }
      })
      vm.result = result.data;
    })

  }
})();
