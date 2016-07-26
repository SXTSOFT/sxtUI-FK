/**
 * Created by lss on 2016/7/25.
 */
/**
 * Created by emma on 2016/6/12.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('sclistController',sclistController);

  /**@ngInject*/
  function sclistController($scope,scRemote,$stateParams,db){
    var vm=this;
    var remote=  scRemote;
    vm.projectId = $stateParams.projectId;
    vm.assessmentID=$stateParams.assessmentID;
    vm.role=$stateParams.role;
    //离线待实现
    var _db=db('pack'+ vm.assessmentID);
    _db.get("GetBaseMeasure").then(function(result){
      vm.procedureData = [];
      result.data.forEach(function(it){
        it.SpecialtyChildren.forEach(function(t){
          t.WPAcceptanceList.forEach(function(_t){
            _t.AcceptanceItemName=_t.MeasureItemName;
            //_t.AcceptanceItemID=_t;
            var max = 0,arr=[];
            var idx = _t.SplitRule.indexOf(',');
            if(idx == -1){
              _t.maxRegion = _t.SplitRule;
            }else{
              arr = _t.SplitRule.split(',');
              for(var i=0;i<arr.length;i++){
                if(parseInt(arr[i])>max){
                  max = arr[i];
                }
              }
              _t.maxRegion = max;
            }
          })
        })
        vm.procedureData.push(it);
      })
    }).catch(function(r){

    });
  }
})();
