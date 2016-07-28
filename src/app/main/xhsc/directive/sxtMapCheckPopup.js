/**
 * Created by jiuyuong on 2016/4/13.
 */
(function(){
  'use strict';
  angular
    .module('app.xhsc')
    .directive('sxtMapCheckPopup',sxtMapCheckPopup);
  /** @ngInject */
  function sxtMapCheckPopup(mapPopupSerivce,$timeout,sxt,xhUtils,remote){
    return {
      restrict:'E',
      scope:{
        readonly:'='
      },
      templateUrl:'app/main/xhsc/directive/sxtMapCheckPopup.html',
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
        remote.Procedure.InspectionProblemRecord.query(scope.data.v.CheckpointID).then(function (r) {
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
            remote.Procedure.InspectionProblemRecord.create(p);
          }
          scope.data.p = p;
          remote.Procedure.InspectionProblemRecordFile.query(p.ProblemRecordID, scope.data.v.PositionID).then(function (r) {
            scope.data.images = r.data;
            if (scope.data.v.isNew  && scope.data.images.length == 0) {
              scope.addPhoto();
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
      scope.addPhoto = function () {
        scope.data.v.isNew = false;
        xhUtils.photo().then(function (image) {
          if(image){
            var img = {
              ProblemRecordFileID:sxt.uuid(),
              FileID:sxt.uuid()+".jpg",
              ProblemRecordID:scope.data.p.ProblemRecordID,
              CheckpointID:scope.data.v.CheckpointID,
              FileContent:image
            };
            remote.Procedure.InspectionProblemRecordFile.create(img);
            scope.data.images.push(img);
          }
        });
      }
      mapPopupSerivce.set('mapCheckMapPopup',{
        el:element,
        scope:scope
      });
      scope.$on('$destroy',function(){
        mapPopupSerivce.remove('mapCheckMapPopup');
        $(element).remove();
      });
    }
  }
})();
