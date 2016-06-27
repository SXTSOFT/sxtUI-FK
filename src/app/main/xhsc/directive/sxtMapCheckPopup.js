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
            if (scope.data.v.isNew) {
              scope.addPhoto();
            }
          });
        })
      };

      scope.removeLayer = function(){
        scope.isSaveData = false;
        var layer = scope.context.layer;
        layer._fg.removeLayer(layer);
      };
      scope.cancelEdit = function(saveData){
        scope.isSaveData = saveData||false;
        var layer = scope.context.layer;
        layer.editing && layer.editing.disable();
      };
      scope.addPhoto = function () {
        scope.data.v.isNew = false;
        xhUtils.photo().then(function (image) {
          if(image){
            scope.data.images.push({
              ProblemRecordFileID:sxt.uuid(),
              ProblemRecordID:scope.p.ProblemRecordID,
              CheckpointID:scope.v.CheckpointID,
              FileID:image
            });
          }
        });
      }
      mapPopupSerivce.set('mapCheckMapPopup',{
        el:element,
        scope:scope
      });
      scope.$on('$destroy',function(){
        mapPopupSerivce.remove('mapCheckMapPopup');
      });
    }
  }
})();
