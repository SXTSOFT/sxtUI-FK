/**
 * Created by jiuyuong on 2016/4/11.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .factory('remote',remote);
  /** @ngInject */
  function remote(api){
    return api.xhsc;
  }
})();
