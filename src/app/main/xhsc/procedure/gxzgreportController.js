/**
 * Created by emma on 2016/7/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxzgreportController',gxzgreportController);

  /**@ngInject*/
  function gxzgreportController(remote,$stateParams,xhUtils){
    var vm = this;
      vm.Inspection = $stateParams.InspectionId;
      vm.AcceptanceName = $stateParams.acceptanceItemName;
    //vm.reflectionId = '355370c6bc7e4f9a8f4707589155dd39';
    remote.Project.getInspectionList(vm.Inspection).then(function(r){
      console.log('r1',r)
      vm.Rectification = r.data[0];
      vm.pareaList = vm.Rectification.Children;
      vm.regionSelect = vm.pareaList[0];
      vm.regionSelect.hasCheck=true;
    })
    //remote.Procedure.getZGById(vm.reflectionId).then(function (r) {
    //  console.log('r1',r)
    //  vm.Rectification = r.data[0];
    //  vm.pareaList = vm.Rectification.Children;
    //  vm.regionSelect = vm.pareaList[0];
    //  vm.regionSelect.hasCheck=true;
    //  //load();
    //});
    vm.info = {

    }
    vm.Regions = [];
    remote.Procedure.getZgReport(vm.Inspection).then(function(result){
      console.log('r2',result)

      result.data.Areas&&result.data.Areas.forEach(function(item){
        vm.Regions.push(item.AreaId);
        item.Classification.forEach(function(_it){
          _it.rowspan = _it.Children.length;
          //item.rowspan +=_it.rowspan;
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

      //result.data.Detaileds&&result.data.Detaileds.forEach(function(pic){
      //  if(details.length<2){
      //    details.push(pic)
      //  }else{
      //    vm.details.push(details);
      //    details = [pic];
      //  }
      //})
      //vm.details.push(details)
      //vm.details.forEach(function(p){
      //  while(p.length<2){
      //   // p.push({});
      //  }
      //})
      vm.result = result.data;
      //console.log(vm.result)
    })

  }
})();
