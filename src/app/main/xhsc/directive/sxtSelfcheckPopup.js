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
        slideInspection:'='
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
      scope.$watch('slideId',function(){
        if(!scope.slideId) return;
        remote.Procedure.InspectionProblemRecord.query(scope.slideId).then(function(r){
          console.log('r',r)
          scope.data = r.data;
          r.data.forEach(function (p) {
            remote.Procedure.InspectionProblemRecordFile.query(p.ProblemRecordID).then(function (r2) {
              p.images = r2.data;
            });
          });
        })
      })
      scope.cancel = function(){
        scope.slideShow = false;
      }
      scope.submit = function(){
        scope.data.Status = scope.data.Status==2?2:4;
        var params={
          CheckpointID:scope.slideId,
          Status:scope.data.Status
        }
        remote.Procedure.updataZjPoint(scope.slideId,scope.data.Status).then(function (r) {
          if(r.data.ErrorCode == 0){
            scope.slideShow = false;
          }
        });
      }
    }
  }
  })();
