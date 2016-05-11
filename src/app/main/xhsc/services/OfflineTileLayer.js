
(function(){
  'use strict';
  angular
    .module('app.xhsc')
    .factory('offlineTileLayer',offlineTileLayer);
  /** @ngInject */
  function offlineTileLayer($cordovaFile){
    L.Offline = L.TileLayer.extend({
      _loadTile: function (tile, tilePoint) {
        tile._layer  = this;
        tile.onload  = this._tileOnLoad;
        tile.onerror = this._tileOnError;

        this._adjustTilePoint(tilePoint);
        if(typeof cordova !== 'undefined') {
          $cordovaFile.readAsDataURL(cordova.file.dataDirectory, this._url +'_' + tilePoint.z + '_' + tilePoint.x + '_' + tilePoint.y + '.png').then(function (success) {
            tile.src = success;
          }, function (error) {
            tile.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
            //console.log(error);
          });
        }
        else{
        }
      }
    });

    return {
      offlineTile:function (url) {
        return new L.Offline(url,{attribution: false,noWrap: true});
      }
    }
  }
})();
