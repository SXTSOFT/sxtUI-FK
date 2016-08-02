/**
 * Created by emma on 2016/7/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxzgreportController',gxzgreportController);

  /**@ngInject*/
  function gxzgreportController(remote,$stateParams){
    var vm = this;
      vm.Inspection = '9396569306a040558453daf06e11e09e';
    vm.reflectionId = '355370c6bc7e4f9a8f4707589155dd39';
    remote.Procedure.getZGById(vm.reflectionId).then(function (r) {
      console.log('r1',r)
      vm.Rectification = r.data[0];
      vm.pareaList = vm.Rectification.Children;
      vm.regionSelect = vm.pareaList[0];
      vm.regionSelect.hasCheck=true;
      //load();
    });
    vm.info = {

    }
    remote.Procedure.getZgReport().then(function(result){
      console.log('r2',result)

      result.data.Areas.forEach(function(item){
        item.rowspan = item.Children.length;
        item.Children.forEach(function(t){
          //if(t.inspection == 2){
          //  t.inspectionStatus ='合格';
          //}
          t.inspectionStatus = t.Inspection == 2?'合格':'不合格';
          t.reinspectionStatus = t.ReInspection == 2?'合格':'不合格';
        })
      })
      var pics=[];
      vm.pics=[];
      result.data.Picture.forEach(function(pic){
        //if(ms.length<20){
        //  ms.push(m);
        //}
        //else{
        //  item.rows.push(ms);
        //  ms=[m];
        //}
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
      console.log(vm.pics)
    })
  }
})();
