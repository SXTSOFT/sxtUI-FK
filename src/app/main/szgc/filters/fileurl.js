/**
 * Created by zhangzhaoyong on 16/2/15.
 */
(function(){
  angular
    .module('app.szgc')
    .filter('fileurl',fileurl)
    .filter('sxtdate',sxtdate);
  /** @ngInject */
  function fileurl(sxt,api){
    return function (file,size) {
      var value = file.Url;
      if(!value){
        if(!file.loading){
          file.loading = true;
          api.szgc.FilesService.localFile(file.Id).then(function (r) {
            file.Url = r.data.Url;
            file.loading = false;
          },function () {
            file.loading = false;
          });
        }
        return '';
      }
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
