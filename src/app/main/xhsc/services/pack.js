/**
 * Created by jiuyuong on 2016/5/10.
 */
(function () {
  'use strict';

  angular
    .module('app.xhsc')
    .factory('pack',pack);
  /** @ngInject */
  function pack(localPack, remotePack,sxt,db,$cordovaFile) {
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
                url:'/Api/MeasureInfo/GetMeasureItemInfoByAreaID?areaID='+item.AreaID
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
                url:sxt.app.api+'/Api/MeasureValueApi/CreateMeasureValue',
                type: 'data'
              },
              point: {
                url:sxt.app.api+'/Api/MeasurePointApi/CreatePoint',
                type: 'data'
              },
              indexs:{
                url:sxt.app.api+'/Api/MeasureValueApi/MeasureIndexSubmit',
                type:'data'
              }
            }
          })
        },
        remove:function (id,cb,progress){
          localPack.unPack(id);
          remotePack.unPack(id);
          var totalStep = 5,
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
                  p.destroyDir(id,function () {
                    fn(5);
                    cb();
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
