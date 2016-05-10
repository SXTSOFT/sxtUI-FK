/**
 * Created by jiuyuong on 2016/5/10.
 */
(function () {
  'use strict';

  angular
    .module('app.xhsc')
    .factory('pack',pack);
  /** @ngInject */
  function pack(remotePack,sxt) {
    var p ={
      sc:{
        down:function (id) {

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
                type:'data'
              }
            }
          })
        }
      }
    };
    return p;
  }
})();
