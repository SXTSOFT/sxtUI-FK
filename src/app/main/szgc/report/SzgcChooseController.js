/**
 * Created by emma on 2016/3/5.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .controller('SzgcChooseController',SzgcChooseController);

  /** @ngInject */
  function  SzgcChooseController(msUtils,$state){
    var vm=this;
    vm.project1 = '星河智荟';
    vm.project=['星河智荟','星河传奇'];
    vm.fenqi1='一期';
    vm.fenqi=['一期','二期'];
    vm.buildings1 = '14栋';
    vm.buildings=['14栋','15栋'];
    vm.floors1 = '15层';
    vm.floors=['15层','16层'];
    vm.rooms1 ='03';
    vm.rooms=['03','04'];
    vm.change = function(){
      msUtils.isMobile()?
        $state.go('app.szgc.xc',{pid:'1', pname: '2'}):
        $state.go('app.szgc.area',{pid:'1', pname: '2'});
    };

  }
})();
