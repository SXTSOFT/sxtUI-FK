/**
 * Created by jiuyuong on 2016/4/13.
 */
(function(){
  'use strict';
  angular
    .module('app.xhsc')
    .directive('sxtRecheckPopup',sxtRecheckPopup);
  /** @ngInject */
  function sxtRecheckPopup(mapPopupSerivce,$timeout,sxt,xhUtils,remote){
    return {
      restrict:'E',
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
      })
      scope.apply = function(){
        remote.Procedure.getPoints(scope.data.regionId,scope.data.procedure).then(function(res){
          console.log('res',res)
          var find = res.data.find(function(d){
            return d.IndexPointID === scope.data.indexPointID;
          })
          if(find){
            scope.disQues = find;
            scope.disQues.value = '未整改';
            scope.disQues.note='';
          }
        })
      }

      scope.playImage = function (imgs) {
        xhUtils.playPhoto(imgs);
      }
      scope.addPhoto = function () {
        //scope.data.v.isNew = false;
        xhUtils.photo().then(function (image) {
          if(image){
            scope.data.images.push({
              ProblemRecordFileID:sxt.uuid(),
              ProblemRecordID:scope.data.p.ProblemRecordID,
              CheckpointID:scope.data.v.CheckpointID,
              FileContent:image
            });
          }
        });
      }
      scope.submit = function(){
        scope.slideShow = false;
        scope.context.featureGroup.options.onUpdate()&&scope.context.featureGroup.options.onUpdate()
        var layer = scope.context.layer;
        console.log('layer',scope)
      }
      mapPopupSerivce.set('mapRecheckMapPopup',{
        el:element,
        scope:scope
      });
      scope.$on('$destroy',function(){
        mapPopupSerivce.remove('mapRecheckMapPopup');
      });
    }
  }
})();
