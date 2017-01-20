
(function(){
  'use strict';
  angular
    .module('app.szgc')
    .factory('tileLayer',tileLayer);
  /** @ngInject */
  function tileLayer($cordovaFile,api,map){
    map(function () {
      L.Offline = L.TileLayer.extend({
        createTile: function (coords, done) {
          var tile = document.createElement('img');

          L.DomEvent.on(tile, 'load', L.bind(this._tileOnLoad, this, done, tile));
          L.DomEvent.on(tile, 'error', L.bind(this._tileOnError, this, done, tile));

          if (this.options.crossOrigin) {
            tile.crossOrigin = '';
          }

          /*
           Alt tag is set to empty string to keep screen readers from reading URL and for compliance reasons
           http://www.w3.org/TR/WCAG20-TECHS/H67
           */
          tile.alt = '';

          //tile.src = this.getTileUrl(coords);
          if(api.getNetwork()==1 && typeof cordova !== 'undefined') {
            $cordovaFile.readAsDataURL(cordova.file.dataDirectory+'/map', 'tile_'+this._url.Id +'_' + tilePoint.z + '_' + tilePoint.x + '_' + tilePoint.y + '.jpg').then(function (success) {
              tile.src = success;
            }, function (error) {
              tile.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
              //console.log(error);
            });
          }
          else{
            tile.src = this._url.api+'/api/picMap/load/' + coords.z + '_' + coords.x + '_' + coords.y + '.png?size=256&path='+this._url.Url;
          }

          return tile;

          // tile._layer  = this;
          // tile.onload  = this._tileOnLoad;
          // tile.onerror = this._tileOnError;
          //
          // this._adjustTilePoint(tilePoint);
          // //console.log(this._url);
          // if(api.getNetwork()==1 && typeof cordova !== 'undefined') {
          //   $cordovaFile.readAsDataURL(cordova.file.dataDirectory+'/map', 'tile_'+this._url.Id +'_' + tilePoint.z + '_' + tilePoint.x + '_' + tilePoint.y + '.jpg').then(function (success) {
          //     tile.src = success;
          //   }, function (error) {
          //     tile.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
          //     //console.log(error);
          //   });
          // }
          // else{
          //   tile.src = this._url.api+'/api/picMap/load/' + tilePoint.z + '_' + tilePoint.x + '_' + tilePoint.y + '.png?size=256&path='+this._url.Url;
          // }
        }
      });
    });


    return {
      tile:function (url) {
        return new L.Offline(url,{attribution: false,noWrap: true,tileSize: 256});
      }
    }
  }
})();
