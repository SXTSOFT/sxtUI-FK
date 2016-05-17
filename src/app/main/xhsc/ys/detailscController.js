/**
 * Created by emma on 2016/5/11.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('detailscController',detailscController);

  /** @ngInject*/
  function detailscController($stateParams,remote){
    var vm = this;
    var iMax = 20;
    vm.info={
      pname: $stateParams.pname,
      name:$stateParams.name
    }
    remote.Assessment.getMeasure({
      RegionID:$stateParams.regionId,
      AcceptanceItemID:$stateParams.measureItemID,
      RecordType:4,
      RelationID:'' //$stateParams.db //TODO: 后台暂未存此数据，后面要去掉
    }).then(function (result){
      var newD = [];
      result.data.forEach(function (item) {
        item.rows = [];
        var ms = [];
        item.MeasureValueList.forEach(function (m) {
          if(ms.length<20) {
            ms.push(m)
          }
          else{
            item.rows.push(ms);
            ms = [];
          }
        });
        while (ms.length<20){
          ms.push({});
        }
        item.rows.push(ms);
        newD.push(item);
      });

      vm.scData = newD;
      console.log('res',result)
    });

  }
})();
