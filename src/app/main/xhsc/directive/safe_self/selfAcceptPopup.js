/**
 * Created by shaoshun on 2017/3/2.
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
    .directive('safeSelfAcceptPopup',safeSelfAcceptPopup);
  /** @ngInject */
  function safeSelfAcceptPopup(mapPopupSerivce,$timeout,sxt,xhUtils,remote){
    return {
      restrict:'E',
      scope:{
        readonly:'=',
        warter:"="
      },
      templateUrl:'app/main/xhsc/directive/safe_self/safeSelfAcceptPopup.html',
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
        if (scope.data.v){
          scope.status=scope.data.v.Status==1?false:true;
        }
        scope.$apply();
        remote.self.safe.problemRecordQuery(scope.data.v.Id).then(function (r) {
          var p = null;
          if (r.data.length) {
            p = r.data[0];
          }
          else {
            var Id=sxt.uuid();
            p = {
              Id:Id,
              inspectionId:scope.inspectionId,
              ProblemRecordID: Id,
              CheckpointID: scope.data.v.CheckpointID,
              Describe: scope.data.v.ProblemDescription,
              DescRole: 'zb'
            };
            remote.self.safe.problemRecordCreate(p);
          }
          scope.data.p = p;
          remote.self.safe.problemRecordFileQuery(p.Id).then(function (r) {
            scope.data.images = r.data;
            if (scope.data.v.isNew  && scope.data.images.length == 0) {
              scope.addPhoto(scope.warter);
            }
          });
        })
      };
      scope.onChange=function (status) {
       if (status){
         scope.data.v.Status=2;
       }else {
         scope.data.v.Status=1;
       }
        scope.context.fg.updateStatus(scope.data.v.PositionID,scope.data.v.Status);
        remote.self.safe.pointCreate(scope.data.v);
      }

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
            var Id=sxt.uuid();
            var img = {
              Id:Id,
              inspectionId:scope.inspectionId,
              ProblemRecordFileID:Id,
              FileID:sxt.uuid()+".jpg",
              ProblemRecordID:scope.data.p.ProblemRecordID,
              CheckpointID:scope.data.v.CheckpointID,
              FileContent:image
            };
            remote.self.safe.problemRecordFileCreate(img);
            scope.data.images.push(img);
          }
        });
      }
      mapPopupSerivce.set('safeSelfAcceptPopup',{
        el:element,
        scope:scope
      });
      scope.$on('$destroy',function(){
        mapPopupSerivce.remove('safeSelfAcceptPopup');
        $(element).remove();
      });
    }
  }
})();
