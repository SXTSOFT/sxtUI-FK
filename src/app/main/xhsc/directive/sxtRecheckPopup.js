/**
 * Created by jiuyuong on 2016/4/13.
 */
(function(){
  'use strict';
  angular
    .module('app.xhsc')
    .directive('sxtRecheckPopup',sxtRecheckPopup);
  /** @ngInject */
  function sxtRecheckPopup(mapPopupSerivce,$timeout,sxt,xhUtils,remote,$q,utils){
    return {
      restrict:'E',
      scope:{
        slideShow:'=',
        slideRole:'='
      },
      templateUrl:'app/main/xhsc/directive/sxtRecheckPopup.html',
      link:link
    }

    function link(scope,element,attr,ctrl){
      scope.$watch('slideRole',function(){
        scope.role = scope.slideRole;
        // console.log('role',scope.role)
      })
      $(element).appendTo('body');
      scope.apply = function(){
        remote.Procedure.InspectionProblemRecord.query(scope.data.value.CheckpointID).then(function(r){
          r.data.forEach(function (p) {
            remote.Procedure.InspectionProblemRecordFile.query(p.ProblemRecordID).then(function (r2) {
              p.images = r2.data;
            });
          });

          scope.Record = {
            jl:r.data.find(function (p) {
              return p.DescRole=='jl'
            }),
            zb:r.data.find(function (p) {
              return p.DescRole=='zb'
            })
          };
          if(!scope.Record.zb){
            scope.Record.zb = {
              CheckpointID:scope.data.value.CheckpointID,
              RectificationID:scope.data.item,
              Describe:'',
              DescRole:scope.role,
              Remark:''
            };
          }
          //remote.Procedure.
        })
      }

      scope.playImage = function (imgs) {
        imgs.forEach(function (img) {
          img.url = img.FileUrl || img.FileContent;
          img.alt = ' ';
        })
        xhUtils.playPhoto(imgs);
      }
      function createZb(update) {
        return $q(function (resolve) {
          if(!scope.Record.zb.ProblemRecordID||update===true){
            scope.Record.zb.ProblemRecordID = scope.Record.zb.ProblemRecordID || sxt.uuid();
            remote.Procedure.InspectionProblemRecord.create(scope.Record.zb).then(function () {
              resolve();
            })
          }
          else{
            resolve()
          }
        })
      }
      scope.addPhoto = function () {
        xhUtils.photo().then(function (image) {
          if(image){
            createZb().then(function () {
              var img = {
                ProblemRecordFileID:sxt.uuid(),
                ProblemRecordID:scope.Record.zb.ProblemRecordID,
                CheckpointID:scope.Record.zb.CheckpointID,
                FileID:sxt.uuid()+'.jpg',
                FileContent:image
              }
              remote.Procedure.InspectionProblemRecordFile.create(img).then(function () {
                var imgs = scope.Record.zb.images = (scope.Record.zb.images || []);
                imgs.push(img);
              })

            })

          }
        });
      }
      scope.cancel = function(){
        scope.slideShow = false;
        //scope.apply();
      }
      scope.submit = function(){
        if(scope.role=='zb'){
          scope.data.value.Status = scope.data.value.Status==8?8:1;
          if(scope.data.value.Status==8 &&(!scope.Record.zb.images || scope.Record.zb.images.length==0)){
            utils.alert('请上传整改后照片');
            return;
          }
          createZb(true).then(function () {
            remote.Procedure.InspectionCheckpoint.create(scope.data.value).then(function () {
              scope.slideShow = false;
            });
          });
        }
        else{
          scope.data.Status = scope.data.Status==2?2:4;
          remote.Procedure.InspectionCheckpoint.create(scope.data.value).then(function () {
            scope.slideShow = false;
          });
        }
      }
      $('body').on('click',function(e){
        if($(e.target).closest('.recheck').length == 1){
          scope.slideShow = false;
        }
      })
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
