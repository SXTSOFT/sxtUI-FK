/**
 * Created by lss on 2016/7/24.
 */
/**
 * Created by jiuyuong on 2016/4/11.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .config(config);

  /** @ngInject */
  function config(apiWrapProvider){
    var $http = apiWrapProvider.$http,
      $q = apiWrapProvider.$q;
    var r = function(data) {
      return $q(function (resolve) {
        resolve({
          data: data
        })
      });
    }

  }
})();
