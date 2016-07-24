/**
 * Created by lss on 2016/7/24.
 */
/**
 * Created by jiuyuong on 2016/5/10.
 */
(function () {
  'use strict';

  angular
    .module('app.xhsc')
    .factory('scPack',scPack);
  /** @ngInject */
  function scPack(scLocalPack, remotePack,sxt,db,$cordovaFile) {
    var  localPack=scLocalPack;
    var p ={
      sc:{
        down:function (item) {
          return localPack.pack({
            _id:item.AssessmentID,
            name:item.AssessmentSubject,
            tasks:[
              {
                _id:'GetMeasureItemInfoByAreaID',
                name:'获取分期下所有指标',
                url:'/Api/MeasureInfo/GetMeasureItemInfo?areaID='+item.AreaID
              },
              {
                _id:'GetRegionTreeInfo',
                name:'获取区域信息',
                url:'/Api/ProjectInfoApi/GetRegionTreeInfo?AreaID='+item.AreaID,
                type:'data',
                item:angular.copy(item)
              },
              {
                _id:'GetDrawingByAreaID',
                name:'获取区域图纸',
                url:'/Api/ProjectInfoApi/GetDrawingByAreaID?AreaID='+item.AreaID,
                type:'data'
              }
            ]
          });
        },
        up:function (id) {
          return remotePack.pack({
            _id:id,
            db:{
              sc: {
                url:sxt.app.scApi+'/Api/MeasureValueApi/CreateMeasureValue',
                type: 'data'
              },
              point: {
                url:sxt.app.scApi+'/Api/MeasurePointApi/CreatePoint',
                type: 'data'
              },
              indexs:{
                url:sxt.app.scApi+'/Api/MeasureValueApi/MeasureIndexSubmit',
                type:'data'
              },
              stzl_item:{
                url:sxt.app.scApi+'/Api/AssessmentApi/SubmitAssessmentRegionItemResult',
                type:'data'
              },
              stzl_question:{
                url:sxt.app.scApi+'/Api/AssessmentApi/SubmitEductScoreItem',
                type:'data'
              },
              stzl_images:{
                url:sxt.app.scApi+'/Api/MeasureValueApi/SubmitImage',
                type:'fileurl'
              }
            }
          })
        },
        remove:function (id,cb,progress){
          localPack.unPack(id);
          remotePack.unPack(id);
          var totalStep = 9,
            fn = function (step) {
              progress && progress(parseInt(step/totalStep*100));
            };
          fn(0);
          p.destroyDb('pack'+id,function () {
            fn(1);
            p.destroyDb('Pack'+id+'sc',function () {
              fn(2);
              p.destroyDb('Pack'+id+'point',function () {
                fn(3);
                p.destroyDb('Pack'+id+'indexs',function () {
                  fn(4);
                  p.destroyDb('Pack'+id+'pics',function () {
                    fn(5);
                    p.destroyDir(id, function () {
                      fn(6);
                      p.destroyDb('Pack'+id+'stzl_item',function () {
                        fn(7);
                        p.destroyDb('Pack'+id+'stzl_question',function () {
                          fn(8);
                          p.destroyDb('Pack'+id+'stzl_images', function () {
                            fn(9);
                            cb();
                          });
                        });
                      })
                    });
                  });
                })
              })
            })
          })
        }

      },
      destroyDb:function (dbKey,cb) {
        db(dbKey).destroy().then(function () {
          cb();
        }).catch(function (err) {
          cb(err);
        })
      },
      destroyDir:function (path,cb) {
        if(typeof cordova !== 'undefined') {
          $cordovaFile.removeDir(cordova.file.dataDirectory, path)
            .then(function (success) {
              cb();
            }, function (error) {
              cb(error);
            });
        }
        else{
          cb();
        }
      }
    };
    return p;
  }
})();
