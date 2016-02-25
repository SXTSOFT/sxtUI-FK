/**
 * Created by zhangzhaoyong on 16/2/3.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .controller('SzgcyhydController', SzgcyhydController);

  /** @ngInject */
  function SzgcyhydController()
  {

    var vm = this;
    vm.link = 'http://vkde.sxtsoft.com/yhyd/';
    vm.picUrl = '/upload/floor-img.jpg';
    vm.images=[
      'http://szdp.vanke.com:8088/upload/2015/12/s_f43c8cb8-9360-4612-b6dd-9272d07a296d.jpg',
      'http://szdp.vanke.com:8088/upload/2015/12/s_f43c8cb8-9360-4612-b6dd-9272d07a296d.jpg',
      'http://szdp.vanke.com:8088/upload/2016/01/324503ea-3d4c-4cc4-934a-fe162bfa73a5.png',
      'http://szdp.vanke.com:8088/upload/2016/01/b2ec1d61-995a-4c21-a138-e135d1837a83.png'
    ];
    vm.back = function(){
      history.back();
    }

  }

})();
