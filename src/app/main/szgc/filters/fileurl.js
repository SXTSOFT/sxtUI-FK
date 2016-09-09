/**
 * Created by zhangzhaoyong on 16/2/15.
 */
(function(){
  angular
    .module('app.szgc')
    .filter('fileurl',fileurl)
    .filter('sxtdate',sxtdate);
  /** @ngInject */
  function fileurl(sxt){
    return function (value) {
      return value.indexOf('base64')!=-1?value:
      sxt.app.api + (value && value.substring(0, 1) == '~' ? value.substring(1) : value);
    }
  }

  function sxtdate() {
    return function (value) {
      return (value||'').replace(/-/g,'');
    }
  }
})();
