/**
 * Created by shaoshun on 2016/11/29.
 */
/**
 * Created by shaoshun on 2016/11/29.
 */
/**
 * Created by lss on 2016/10/24.
 */
/**
 * Created by jiuyuong on 2016/4/13.
 */
(function(){
  'use strict';
  angular
    .module('app.xhsc')
    .directive('sxtDynamicRecheckPopup',sxtDynamicRecheckPopup);
  /** @ngInject */
  function sxtDynamicRecheckPopup(mapPopupSerivce,$timeout,sxt,xhUtils,remote){
    return {
      restrict:'E',
      scope:{
        readonly:'=',
        warter:"="
      },
      templateUrl:'app/main/xhsc/directive/sxtWeekRecheckPopup.html',
      link:link
    }

    function link(scope,element,attr,ctrl){
      scope.updateValue = function() {
        scope.cancelEdit (true);
      };
      scope.moveLayer = function () {
        scope.context.fg.changeMode('move',{ctx:true});
      };
      scope.apply = function() {
        scope.isSaveData = null;
        scope.$apply();
        remote.safe.problemRecordQuery(scope.data.v.CheckpointID).then(function (r) {
          var p = null;
          if (r.data.length) {
            p = r.data[0];
          }
          else {
            p = {
              ProblemRecordID: sxt.uuid(),
              CheckpointID: scope.data.v.CheckpointID,
              Describe: scope.data.v.ProblemDescription,
              DescRole: 'jl'
            };
            p.action="Insert";
            remote.safe.problemRecordCreate(p);
          }
          scope.data.p = p;
          remote.safe.ProblemRecordFileQuery(p.ProblemRecordID, scope.data.v.PositionID).then(function (r) {
            scope.data.images = r.data;
            if (scope.data.v.isNew  && scope.data.images.length == 0) {
              scope.addPhoto(scope.warter);
            }
          });
        })
      };

      scope.removeLayer = function(){
        scope.isSaveData = false;
        var c = scope.context;
        c.fg.delete(c.layer);
      };
      scope.cancelEdit = function(saveData){
        scope.isSaveData = saveData||false;
        var layer = scope.context.layer;
        layer.editing && layer.editing.disable();
      };
      scope.playImage = function () {
        var imgs = [];
        scope.data.images.forEach(function (img) {
          imgs.push({
            url:img.FileContent||img.FileUrl,
            alt:''
          });
        })
        xhUtils.playPhoto(imgs);
      }
      scope.addPhoto = function (waterText) {
        scope.data.v.isNew = false;
        xhUtils.photo(null,waterText).then(function (image) {
          if(image){
            var img = {
              ProblemRecordFileID:sxt.uuid(),
              FileID:sxt.uuid()+".jpg",
              ProblemRecordID:scope.data.p.ProblemRecordID,
              CheckpointID:scope.data.v.CheckpointID,
              FileContent:image
            };
            img.action="Insert";
            remote.safe.ProblemRecordFileCreate(img);
            scope.data.images.push(img);
          }
        });
      }
      mapPopupSerivce.set('dynamicRecheck',{
        el:element,
        scope:scope
      });
      scope.$on('$destroy',function(){
        mapPopupSerivce.remove('dynamicRecheck');
        $(element).remove();
      });
    }
  }
})();
