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
    .directive('sxtWeekRecheckPopup',sxtWeekRecheckPopup);
  /** @ngInject */
  function sxtWeekRecheckPopup(mapPopupSerivce,$timeout,sxt,xhUtils,remote,$q,utils){
    return {
      restrict:'E',
      scope:{
        slideShow:'=',
        slideRole:'=',
        warter:"="
      },
      templateUrl:'app/main/xhsc/directive/safe_civiliz/sxtWeekRecheckPopup.html',
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
        remote.safe.weekproblemRecordQuery(scope.data.value.CheckpointID).then(function(r){
          scope.images={
            zb:[],
            jl:[]
          }

          r.data.forEach(function (p) {
            remote.safe.weekProblemRecordFileQuery(p.ProblemRecordID).then(function (r2) {
              if (p.DescRole=="jl"){
                scope.images.jl=scope.images.jl.concat(r2.data)
              }else{
                scope.images.zb=scope.images.zb.concat(r2.data);
              }
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

          if(!scope.Record.jl){
            scope.Record.jl = {
              CheckpointID:scope.data.value.CheckpointID,
              Describe:'',
              DescRole:"jl",
              Remark:''
            };
          }
          if(!scope.Record.zb){
            scope.Record.zb = {
              CheckpointID:scope.data.value.CheckpointID,
              Describe:'',
              DescRole:"zb",
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
        return $q(function (resolve,reject) {
          var rec="";
          remote.safe.weekproblemRecordQuery.cfgSet({
            filter: function (item, CheckpointID) {
              var t=item.CheckpointID == CheckpointID&&!item.isUpload&&item.DescRole=="zb";
              if (t){
                rec=rec?rec:item.RectificationID;
              }
              return t;
            },
          })(scope.data.value.CheckpointID).then(function (r) {
            if (!r||!r.data||!r.data.length){
              // scope.Record.zb.ProblemRecordID = sxt.uuid()
              var rec={
                CheckpointID:scope.data.value.CheckpointID,
                RectificationID:rec,
                Describe:'',
                DescRole:"zb",
                Remark:''
              };
              rec.ProblemRecordID = sxt.uuid();
              rec._id=rec.ProblemRecordID;
              remote.safe.weekproblemRecordCreate(rec).then(function () {
                resolve(rec);
              })
            }else {
              resolve(r.data[0]);
            }

          });
        })
      }
      scope.addPhoto = function (warter) {
        xhUtils.photo(null,warter).then(function (image) {
          if(image){
            createZb().then(function (res) {
              var img = {
                ProblemRecordFileID:sxt.uuid(),
                ProblemRecordID:res.ProblemRecordID,
                CheckpointID:scope.Record.zb.CheckpointID,
                FileID:sxt.uuid()+'.jpg',
                FileContent:image
              }
              remote.safe.weekProblemRecordFileCreate(img).then(function () {
                // var imgs = scope.Record.zb.images = (scope.Record.zb.images || []);
                scope.images.zb=scope.images.zb.concat([img]);
              })

            })
            scope.data.value.Status = 16;
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
            case 4:
              return 1;
            case 16:
              return 8;
          }
          return status;
        }
        if(scope.role=='zb'){
          if(convert(scope.data.value.Status)==8 &&(!scope.images.zb || scope.images.zb.length==0)){
            utils.alert('请上传整改后照片');
            return;
          }
          createZb(true).then(function () {
            remote.safe.weekPointCreate(scope.data.value).then(function () {
              scope.slideShow = false;
              scope.context.updateStatus(scope.data.value.PositionID,convert(scope.data.value.Status));
            });
          });
        }
        else if(scope.role=='jl'){
          scope.data.value.Status = scope.data.value.Status==2?2:4;
          remote.safe.weekPointCreate(scope.data.value).then(function () {
            scope.slideShow = false;
            scope.context.updateStatus(scope.data.value.PositionID,convert(scope.data.value.Status));
          }).then(function () {
            var rec="";
            remote.safe.weekproblemRecordQuery.cfgSet({
              filter: function (item, CheckpointID) {
                var t=item.CheckpointID == CheckpointID&&!item.isUpload&&item.DescRole=="jl";
                if (t){
                  rec=rec?rec:item.RectificationID;
                }
                return t;
              },
            })(scope.data.value.CheckpointID).then(function (r) {
              if (!r||!r.data||!r.data.length){
                var rec={
                  CheckpointID:scope.data.value.CheckpointID,
                  RectificationID:rec,
                  Describe:'',
                  DescRole:"jl",
                  Remark:''
                };
                rec.ProblemRecordID = sxt.uuid();
                rec._id=rec.ProblemRecordID;
                remote.safe.weekproblemRecordCreate(rec)
              }
            });
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
      mapPopupSerivce.set('weekRecheckPopup',{
        el:element,
        scope:scope
      });
      scope.$on('$destroy',function(){
        mapPopupSerivce.remove('weekRecheckPopup');
        $(element).remove();
      });
    }
  }
})();
