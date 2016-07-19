/**
 * Created by jiuyuong on 2016/4/13.
 */
(function(){
  'use strict';
  angular
    .module('app.xhsc')
    .directive('sxtSelfcheckPopup',sxtSelfcheckPopup);
  /** @ngInject */
  function sxtSelfcheckPopup(mapPopupSerivce,$timeout,sxt,xhUtils,remote,$q,utils) {
    return {
      restrict: 'E',
      scope: {
        slideShow: '=',
        slideRole: '=',
        slideId:'=',
        slideInspection:'=',
        slideContext:'='
      },
      templateUrl: 'app/main/xhsc/directive/sxtSelfcheckPopup.html',
      link: link
    }
    function link(scope,element,attr,ctrl){
      scope.$watch('slideRole',function(){
        scope.role = scope.slideRole;
        console.log('role',scope)
      })
      $(element).appendTo('body');
      scope.apply = function(){
        remote.Procedure.InspectionProblemRecord.query(scope.slideId).then(function(r){
          scope.data = r.data;
          r.data.forEach(function (p) {
            remote.Procedure.InspectionProblemRecordFile.query(p.ProblemRecordID).then(function (r2) {
              p.images = r2.data;
            });
          });
          scope.ZjRecord = {
            zj:r.data.find(function (p) {
              return p.DescRole=='zj'
            })
          };
          scope.zjStatus = scope.ZjRecord.zj.Status;
        })
      }
      scope.$watch('slideId',function(){
        if(!scope.slideId) return;
        scope.apply();
      })
      scope.cancel = function(){
        scope.slideShow = false;
        scope.ZjRecord.zj.Status = scope.zjStatus;
      }
      scope.submit = function(){
       // scope.data[0].Status = scope.data[0].Status==2?2:4;

        scope.zjStatus = scope.ZjRecord.zj.Status = scope.ZjRecord.zj.Status == 2?2:4
        var params={
          CheckpointID:scope.slideId,
          Status:scope.data.Status
        }
        remote.Procedure.updataZjPoint(scope.slideId,scope.ZjRecord.zj.Status).then(function (r) {
          if(r.data.ErrorCode == 0){
            scope.slideShow = false;
            scope.slideContext.fg.updateStatus(scope.slideContext.layer.properties.$id,scope.ZjRecord.zj.Status);

            //scope.slideContext.layer.redraw();
          }
        });
      }
      scope.$on('$destroy',function(){
        $(element).remove();
      });
    }
  }
  })();
