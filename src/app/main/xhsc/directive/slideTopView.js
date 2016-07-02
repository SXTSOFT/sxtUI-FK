/**
 * Created by emma on 2016/7/1.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .directive('slideTopView',slideTopView);

  /**@ngInject*/
  function slideTopView(xhUtils){
    return {
      scope:{
        slideShow:'=',
        slideRole:'='
      },
      templateUrl:'app/main/xhsc/directive/slideTopView.html',
      link:link
    }
    function link(scope,element,attr,ctrl){
      scope.$watch('slideRole',function(){
        scope.role = scope.slideRole;
       // console.log('role',scope.role)
      })
      scope.addPhoto = function () {
        xhUtils.photo().then(function (image) {
          if(image){
            //scope.data.images.push({
            //  ProblemRecordFileID:sxt.uuid(),
            //  ProblemRecordID:scope.data.p.ProblemRecordID,
            //  CheckpointID:scope.data.v.CheckpointID,
            //  FileID:image
            //});
          }
        });
      }
      scope.playImage = function () {
        var imgs = [{
          url:'app/main/xhsc/images/photo.png',
          alt:'aa'
        },{
          url:'app/main/xhsc/images/photo.png',
          alt:'aa'
        }];
        //scope.data.images.forEach(function (img) {
        //  imgs.push({
        //    src:img.FileID,
        //    alt:''
        //  });
        //})
        xhUtils.playPhoto(imgs);
      }
    }
  }
})();
