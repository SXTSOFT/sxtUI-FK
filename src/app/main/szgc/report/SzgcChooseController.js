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
    vm.project1 = '亚奥';
    vm.project=['亚奥','公园里'];
    vm.fenqi1='金茂悦一期';
    vm.fenqi=['金茂悦一期','金茂悦二期'];
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
