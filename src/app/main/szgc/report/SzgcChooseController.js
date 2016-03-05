/**
 * Created by emma on 2016/3/5.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .controller('SzgcChooseController',SzgcChooseController);

  /** @ngInject */
  function  SzgcChooseController(){
    var vm=this;
    vm.project=['亚奥','公园里'];
    vm.fenqi=['金茂悦一期','金茂悦二期'];
    vm.buildings=['14栋','15栋'];
    vm.floors=['15层','16层'];
    vm.rooms=['03','04'];
    vm.change = function(){

    };
  }
})();
