
(function(){
  'use strict';
  angular
    .module('app.xhsc')
    .factory('offlineTileLayer',offlineTileLayer);
  /** @ngInject */
  function offlineTileLayer($cordovaFile){
    L.Offline = L.TileLayer.extend({
      initialize:function (url,options) {
        L.TileLayer.prototype.initialize.call(this,url,options);
      },
      createTile:function (coords, done) {
        var tile = document.createElement('img');

        L.DomEvent.on(tile, 'load', L.bind(this._tileOnLoad, this, done, tile));
        L.DomEvent.on(tile, 'error', L.bind(this._tileOnError, this, done, tile));

        if (this.options.crossOrigin) {
          tile.crossOrigin = '';
        }

        var data = {
          r: L.Browser.retina ? '@2x' : '',
          s: this._getSubdomain(coords),
          x: coords.x,
          y: coords.y,
          z: this._getZoomForUrl()
        };


        /*
         Alt tag is set to empty string to keep screen readers from reading URL and for compliance reasons
         http://www.w3.org/TR/WCAG20-TECHS/H67
         */
        tile.alt = '';
        $cordovaFile.readAsDataURL(cordova.file.dataDirectory,this._url +'/'+data.z+'_'+data.x+'_'+data.y+'.png').then(function (success) {
          tile.src = 'data:image/png;base64,'+success;
        },function (error) {

        });
        //tile.src = this.getTileUrl(coords);

        return tile;
      },
      _loadTile: function (tile, tilePoint) {
        tile._layer  = this;
        tile.onload  = this._tileOnLoad;
        tile.onerror = this._tileOnError;

        this._adjustTilePoint(tilePoint);
        if(typeof cordova !== 'undefined') {
          $cordovaFile.readAsDataURL(cordova.file.dataDirectory, this._url  + tilePoint.z + '_' + tilePoint.x + '_' + tilePoint.y + '.png').then(function (success) {
            tile.src = success;
            this.fire('tileloadstart', {
              tile: tile,
              url: tile.src
            });
          }, function (error) {
            console.log(error);
          });
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
