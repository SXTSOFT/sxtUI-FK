/**
 * Created by jiuyuong on 2016/3/15.
 */
(function(){
  'use strict';
  angular
    .module('app.szgc')
    .factory('markerCulster',function(map){
      map(function () {

      });
      return {
        markerClusterGroup:function(options){
          return L.markerClusterGroup(options);
        }
      }
    })
})();
