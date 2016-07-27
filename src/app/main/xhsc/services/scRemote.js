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
    .factory('scRemote',scRemote);
  /** @ngInject */
  function scRemote(api){
    return api.xhsc;
  }
})();
