/**
 * Created by shaoshun on 2016/11/24.
 */
/**
 * Created by jiuyuong on 2016/4/13.
 */
(function(){
  'use strict';
  angular
    .module('app.xhsc')
    .directive('sxtSafeRecheckPopup',sxtSafeRecheckPopup);
  /** @ngInject */
  function sxtSafeRecheckPopup(mapPopupSerivce,$timeout,sxt,xhUtils,remote,$q,utils){
    return {
      restrict:'E',
      scope:{
        slideShow:'=',
        slideRole:'=',
        warter:"="
      },
      templateUrl:'app/main/xhsc/directive/safe_civiliz/sxtSafeRecheckPopup.html',
      link:link
    }

    function link(scope,element,attr,ctrl){
      scope.$watch('slideRole',function(){
        scope.role = scope.slideRole;
        // console.log('role',scope.role)
      })
      $(element).appendTo('body');
      scope.apply = function(){
        //console.log('scope',scope)
        remote.safe.problemRecordQuery(scope.data.value.CheckpointID).then(function(r){
          r.data.forEach(function (p) {
            remote.safe.ProblemRecordFileQuery(p.ProblemRecordID).then(function (r2) {
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
        })

        scope.value =scope.data.value.Status;
      }

      scope.playImage = function (imgs) {
        imgs.forEach(function (img) {
          img.url = img.FileContent||img.FileUrl;
          img.alt = ' ';
        })
        xhUtils.playPhoto(imgs);
      }

      function createZb(update) {
        return $q(function (resolve) {
          if(!scope.Record.zb.ProblemRecordID||update===true){
            scope.Record.zb.ProblemRecordID = sxt.uuid();
            // scope.Record.zb.ProblemRecordID ||
            var rec=angular.extend({ },scope.Record.zb);
            delete rec.images;
            delete rec.isUpload;
            remote.safe.problemRecordCreate(rec).then(function () {
              resolve();
            })
          }
          else{
            resolve()
          }
        })
      }
      scope.addPhoto = function (warter) {
        xhUtils.photo(null,warter).then(function (image) {
          if(image){
            createZb().then(function () {
              var img = {
                ProblemRecordFileID:sxt.uuid(),
                ProblemRecordID:scope.Record.zb.ProblemRecordID,
                CheckpointID:scope.Record.zb.CheckpointID,
                FileID:sxt.uuid()+'.jpg',
                FileContent:image
              }
              remote.safe.ProblemRecordFileCreate(img).then(function () {
                var imgs = scope.Record.zb.images = (scope.Record.zb.images || []);
                imgs.push(img);
              })

            })
            scope.data.value.Status = 8;
          }
        });
      }
      scope.cancel = function(){
        scope.slideShow = false;
        scope.data.value.Status = scope.value;
      }
      scope.submit = function(){
        function convert(status) {
          switch (status){
            case 8:
                  return 1;
            case 16:
            case 4:
                  return 8;
          }
          return status;
        }
        if(scope.role=='zb'){
          scope.data.value.Status = scope.data.value.Status==16?16:8;
          if(scope.data.value.Status==8 &&(!scope.Record.zb.images || scope.Record.zb.images.length==0)){
            utils.alert('请上传整改后照片');
            return;
          }
          createZb(true).then(function () {
            remote.safe.ckPointCreate(scope.data.value).then(function () {
              scope.slideShow = false;
              scope.context.updateStatus(scope.data.value.PositionID,convert(scope.data.value.Status));
            });
          });
        }
        else if(scope.role=='jl'){
          scope.data.value.Status = scope.data.value.Status==2?2:4;
          remote.safe.ckPointCreate(scope.data.value).then(function () {
            scope.slideShow = false;
            scope.context.updateStatus(scope.data.value.PositionID,convert(scope.data.value.Status));
          }).then(function () {
              scope.Record.jl.ProblemRecordID =sxt.uuid();
            // scope.Record.jl.ProblemRecordID ||
            var rec=angular.extend({ },scope.Record.jl);
              delete rec.images;
              delete rec.isUpload;
              remote.safe.problemRecordCreate(rec);
          });
        }else{
          scope.slideShow = false;
        }
      }
      $('body').on('click',function(e){
        var evt = window.event ? window.event: e,
          target = evt.srcElement || evt.target;
        if($('.slideTop').hasClass('slidedown')){
          if(target.id == 'recheck'){
            scope.slideShow = false;
            scope.$apply()
          }
        }

      })
      mapPopupSerivce.set('sxtSafeRecheckPopup',{
        el:element,
        scope:scope
      });
      scope.$on('$destroy',function(){
        mapPopupSerivce.remove('sxtSafeRecheckPopup');
        $(element).remove();
      });
    }
  }
})();
