(function () {
    'use strict';

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

            var options = L.Util.setOptions(self.options, geojson.options);

            if (options.filter && !options.filter(geojson)) { return self; }

            var layer = L.GeoJSON.geometryToLayer(geojson, options.pointToLayer, options.coordsToLatLng, options);
            if (!layer) {
                return this;
            }
            if (options.icon && options.icon.options && options.icon.options.iconUrl) {
                var iconOpt = options.icon.options;
              iconOpt.iconUrl = iconOpt.iconUrl.replace('/dp/libs','assets')
                layer.setIcon(new L.Icon(iconOpt));
                layer.options = L.Util.extend(geojson.options, layer.options);
            }
            layer.feature = L.GeoJSON.asFeature(geojson);

            layer.defaultOptions = layer.options;
            this.resetStyle(layer);

            if (options.onEachFeature) {
                options.onEachFeature(geojson, layer);
            }
            layer.on('click', function (e) {
                self.onClick(layer);
            })
            return this.addLayer(layer);
        },
        onAdd:function(map){
            L.GeoJSON.prototype.onAdd.call(this, map);
            var self = this;

            map.on('draw:created', function (e) {
                var type = e.layerType,
                    layer = e.layer;
                layer.on('click', function (e) {
                    self.onClick(layer);
                })
                self.addLayer(layer);
                self.save(e);
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


})();
