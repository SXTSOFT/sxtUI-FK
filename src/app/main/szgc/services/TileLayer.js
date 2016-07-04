
(function(){
  'use strict';
  angular
    .module('app.szgc')
    .factory('tileLayer',tileLayer);
  /** @ngInject */
  function tileLayer($cordovaFile){
    L.Offline = L.TileLayer.extend({
      _loadTile: function (tile, tilePoint) {
        tile._layer  = this;
        tile.onload  = this._tileOnLoad;
        tile.onerror = this._tileOnError;

        this._adjustTilePoint(tilePoint);
        //console.log(this._url);
        if(typeof cordova !== 'undefined') {
          $cordovaFile.readAsDataURL(cordova.file.dataDirectory+'/map', 'tile_'+this._url.Id +'_' + tilePoint.z + '_' + tilePoint.x + '_' + tilePoint.y + '.jpg').then(function (success) {
            tile.src = success;
          }, function (error) {
            tile.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
            //console.log(error);
          });
        }
        else{
          tile.src = this._url.api+'/api/picMap/load/' + tilePoint.z + '_' + tilePoint.x + '_' + tilePoint.y + '.png?size=256&path='+this._url.Url;
        }
      }
    });

    return {
      tile:function (url) {
        return new L.Offline(url,{attribution: false,noWrap: true,tileSize: 256});
      }
    }
  }
})();
