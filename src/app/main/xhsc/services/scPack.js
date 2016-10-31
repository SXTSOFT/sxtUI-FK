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
  function scPack(scLocalPack, scRemotePack,sxt,db,$cordovaFile) {
    var  localPack=scLocalPack;
    var  remotePack=scRemotePack;
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
                url:'/Api/MeasureInfo/GetMeasureItemInfo?areaID='+item.ProjectID,
              },
              {
                _id:'GetRegionTreeInfo',
                name:'获取区域信息',
                url:'/Api/ProjectInfoApi/GetRegionTreeInfo?AreaID='+item.ProjectID,
                type:'data',
                item:angular.copy(item)
              },{
                _id:'GetBaseMeasure',
                name:'获取实测项',
                url:'/api/MeasureInfo/GetBaseMeasure',
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
                url:sxt.app.api+'/Api/MeasureValueApi/CreateMeasureValue',
                type: 'data'
              },
              point: {
                url:sxt.app.api+'/Api/MeasurePointApi/CreatePoint',
                type: 'data'
              },
              scStandar:{
                url:sxt.app.api+'/api/MeasureStandardApi/Insert',
                type: 'data'
              },
              indexs:{
                url:sxt.app.api+'/Api/MeasureValueApi/MeasureIndexSubmit',
                type:'data'
              },
              stzl_item:{
                url:sxt.app.api+'/Api/AssessmentApi/SubmitAssessmentRegionItemResult',
                type:'data'
              },
              stzl_question:{
                url:sxt.app.api+'/Api/AssessmentApi/SubmitEductScoreItem',
                type:'data'
              },
              stzl_images:{
                url:sxt.app.api+'/Api/MeasureValueApi/SubmitImage',
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
        },
        removeSc:function (id,cb,progress){
          localPack.unPack(id);
          remotePack.unPack(id);
          var totalStep = 9,
            fn = function (step) {
              progress && progress(parseInt(step/totalStep*100));
            };
          fn(0);
          p.destroyDb('Pack'+id+'sc',function () {
            fn(1);
            p.destroyDb('Pack'+id+'point',function () {
              fn(2);
              p.destroyDb('Pack'+id+'indexs',function () {
                fn(3);
                p.destroyDb('Pack'+id+'pics',function () {
                  fn(4);
                  p.destroyDir(id, function () {
                    fn(5);
                    p.destroyDb('Pack'+id+'stzl_item',function () {
                      fn(6);
                      p.destroyDb('Pack'+id+'stzl_question',function () {
                        fn(7);
                        p.destroyDb('Pack'+id+'stzl_images', function () {
                          fn(8);
                        });
                      });
                    })
                  });
                });
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
