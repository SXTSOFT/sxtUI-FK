/**
 * Created by zhangzhaoyong on 16/2/16.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .directive('sxtImageView',sxtImageView);

  /** @ngInject */
  function sxtImageView(){
    return {
      scope:{
        api:'='
      },
      link:link
    }

    function link(scope,element,attr,ctrl){
      var preview ;
      element.click(function(){

        //scope.api().then(function(result){
        //  // result = [{thumbUrl:'',Url:''}]
        //   preview = $(element).imagePreview();
        //})
      });
      scope.$on('destroy',function(){
        preview.destroy();
      });
    }
  }
})();
