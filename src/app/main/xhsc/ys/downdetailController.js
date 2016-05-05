/**
 * Created by emma on 2016/5/5.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('downdetailController',downdetailController);

  /** @ngInject*/
  function downdetailController(db,remote){
    var vm = this;
    var pk = db('xcpk');
    pk.get('xcpk').then(function (result) {
      vm.offlines = result.rows;
      queryOnline();
    }).catch(function (err) {
      vm.offlines = [];
      queryOnline();
    });
    function queryOnline() {
      remote.Assessment.query().then(function (result) {
        pk.addOrUpdate({_id:'xcpk',rows:result.data});
        vm.onlines = result.data;
      }).catch(function () {
        
      });
    }


  }
})();
