/**
 * Created by jiuyuong on 2016/8/13.
 */
(function () {
  'use strict';
  angular
    .module('app.core')
    .factory('require',require)
    .factory('map',map);
  /** @inject */
  function require($window,pbf,gzip) {
    var ef = {};
    ef.read = function (pbf, end) {
      var buff = {
      }
      pbf.readFields(ef._readField, buff, end);
      return buff;
    };
    ef._readField = function (tag, obj, pbf) {
      if (tag === 1) obj.id = pbf.readVarint();
      else if (tag === 2) obj.js = pbf.readBytes();
    };
    return function (url,cb) {
      if(ef[url]){
        cb && cb();
      }
      else{
        ef[url] = url;
        pbf.load(url).then(function (data) {
          var d = ef.read(data),
            js = pbf.buffer(gzip.unzip(d.js)).toString('UTF-8');
          $window.eval(js);
          cb && cb();
        })
      }
    }
  }

  /** @ngInject */
  function map(require,$window) {
    return function (fn) {
      require('assets/res.pbf',function () {
        $window.L.Icon.Default.imagePath = 'assets/images/';
        var L = $window.L;
        L.LabelIcon = L.Icon.extend({
          options: {
            //iconSize: [12, 12], // also can be set through CSS
            /*
             iconAnchor: (Point)
             popupAnchor: (Point)
             html: (String)
             bgPos: (Point)
             */
            className: 'leaflet-div-label',
            html: false
          },

          createIcon: function (oldIcon) {
            var div = this._div = (oldIcon && oldIcon.tagName === 'DIV') ? oldIcon : document.createElement('div'),
              options = this.options;

            if (options.html !== false) {
              div.innerHTML = options.html;
            } else {
              div.innerHTML = '';
            }

            if(options.color){
              div.style.color = options.color;
            }

            if (options.bgPos) {
              div.style.backgroundPosition =
                (-options.bgPos.x) + 'px ' + (-options.bgPos.y) + 'px';
            }

            this._setIconStyles(div, 'icon');
            return div;
          },
          setText:function(text){
            this._div.innerHTML = text;
          },
          createShadow: function () {
            return null;
          }
        });
        L.GeoJSON.API = L.GeoJSON.extend({
          defaultOptions: {
            get: function (cb) {
              cb({});
            },
            post: function (cb) {
              cb({});
            }
          },
          initialize: function (options) {
            var self = this;
            self._layers = {};
            L.Util.setOptions(self, options);

            self.getData();
            this.on('contextmenu',function(e){
              self.onContextMenu(e,function(){
                this.save(e);
              });
            })
          },
          getData: function () {
            var self = this;
            self.options.get(function (data) {
              self.onData(data);
            });
          },
          _find: function (array, fn) {
            for (var i = 0, l = array.length; i < l; i++) {
              if (fn(array[i]) === true)
                return array[i];
            }
          },
          onClick:function(layer){
            var self = this;
            self.options.click(layer, function (data) {
              self.save();
            });
          },
          onContextMenu:function(layer){
            var self = this;
            self.options.contextMenu && self.options.contextMenu(layer, function (data) {
              self.save();
            });
          },
          onData: function (data) {
            if (data)
              this.addData(data);

          },
          addData: function (geojson) {
            var self = this;
            var features = L.Util.isArray(geojson) ? geojson : geojson.features,
              i, len, feature;

            if (features) {
              for (i = 0, len = features.length; i < len; i++) {
                feature = features[i];
                if (feature.geometries || feature.geometry || feature.features || feature.coordinates) {
                  this.addData(feature);
                }
              }
              return self;
            }

            var options = L.Util.setOptions({}, geojson.options);
            if(options.saved === false) return this;

            if (options.filter && !options.filter(geojson)) { return self; }

            var layer = L.GeoJSON.geometryToLayer(geojson, options.pointToLayer, options.coordsToLatLng, options);
            if (!layer) {
              return this;
            }
            if (geojson.geometry.type =='Point' && options.icon && options.icon.options && options.icon.options.iconUrl) {
              var iconOpt = options.icon.options;
              if(iconOpt.iconUrl) {
                layer.setIcon(this.options.icon ? this.options.icon(iconOpt) : new L.Icon(iconOpt));
              }
              else{
                layer.setIcon(new L.LabelIcon(iconOpt));
              }
              layer.options = L.Util.extend(geojson.options, layer.options);
            }
            else{
              layer.options = L.Util.extend(layer.options,options);
            }
            layer.feature = L.GeoJSON.asFeature(geojson);

            layer.defaultOptions = layer.options;

            this.resetStyle(layer);

            if (options.onEachFeature) {
              options.onEachFeature(geojson, layer);
            }
            layer.on('click', function (e) {
              layer._map.fire('click',e);
              self.onClick(layer);
            })

            if(options.areaLabel && options.areaLabel.text && self.options.areaLabel!==false){
              layer.mk = L.marker([options.areaLabel.lat,options.areaLabel.lng], {
                icon: new L.LabelIcon({
                  html: options.areaLabel.text,
                  color: options.color
                }),
                saved:false,
                draggable: !!self.options.edit,       // Allow label dragging...?
                zIndexOffset: 1000     // Make appear above other map features
              }).on('dragend',function(e){
                var p = this.getLatLng();
                layer.options.areaLabel.lat = p.lat;
                layer.options.areaLabel.lng = p.lng;
                self.save(e)
              }).on('click',function(e){
                layer._map.fire('click',e);
                self.onClick(layer);
              });
              this.addLayer(layer.mk);
            }

            return this.addLayer(layer);
          },
          onAdd:function(map){
            L.GeoJSON.prototype.onAdd.call(this, map);
            var self = this;

            map.on('draw:created', function (e) {
              var type = e.layerType,
                layer = e.layer;
              layer.on('click', function (e) {
                layer._map.fire('click',e);
                self.onClick(layer);
              });
              //var ct = layer.getBounds().getCenter();
              //var myTextLabel = L.marker(ct, {
              //	icon: L.divIcon({
              //		className: 'text-labels',   // Set class for CSS styling
              //		html: '客厅'
              //	}),
              //	draggable: true,       // Allow label dragging...?
              //	zIndexOffset: 1000     // Make appear above other map features
              //}).addTo(map);
              if(!self.options.onAdd ||
                self.options.onAdd(layer,function(){
                  self.addLayer (layer);
                  self.save (e);
                })!==false
              ) {
                self.addLayer (layer);
                self.save (e);
              }
            });
            map.on('draw:edited', function (e) {
              self.save(e);
            });
            map.on('draw:deleted', function (e) {
              self.save(e);
            });
          },
          save: function (e) {
            var self = this;
            if (self.options.post) {
              var data = {
                type: 'FeatureCollection',
                features: []
              };
              this.eachLayer(function (a) {
                var geo = a.toGeoJSON()
                geo.options = a.options;
                data.features.push(geo);
              });
              console.log('ss', JSON.stringify(data));
              self.options.post(data, function () {
                console.log('saved');
              })
            }
          },
          clearLayers: function () {
            L.GeoJSON.prototype.clearLayers.call(this);
            return this;
          },
          refresh: function () {
            this.clearLayers();
            this.getData();
          },
          refilter: function (func) {
            if (typeof func !== 'function') {
              this.filter = false;
              this.eachLayer(function (a) {
                a.setStyle({
                  stroke: true,
                  clickable: true
                });
              });
            } else {
              this.filter = func;
              this.eachLayer(function (a) {
                if (func(a.feature)) {
                  a.setStyle({
                    stroke: true,
                    clickable: true
                  });
                } else {
                  a.setStyle({
                    stroke: false,
                    clickable: false
                  });
                }
              });
            }
          }
        });
        L.GeoJSON.api = function (options) {
          return new L.GeoJSON.API(options);
        };
        fn && fn($window.L);
      });
    };
  }
})();
