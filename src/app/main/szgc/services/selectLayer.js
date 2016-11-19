
(function(){
  'use strict';
  angular
    .module('app.szgc')
    .factory('selectLayer',tileLayer);
  /** @ngInject */
  function tileLayer() {
    L.Control.ActiveLayers = L.Control.Layers.extend({

      /**
       * Get currently active base layer on the map
       * @return {Object} l where l.name - layer name on the control,
       *  l.layer is L.TileLayer, l.overlay is overlay layer.
       */
      getActiveBaseLayer: function () {
        return this._activeBaseLayer
      },

      /**
       * Get currently active overlay layers on the map
       * @return {{layerId: l}} where layerId is <code>L.stamp(l.layer)</code>
       *  and l @see #getActiveBaseLayer jsdoc.
       */
      getActiveOverlayLayers: function () {
        return this._activeOverlayLayers
      },

      onAdd: function (map) {
        var container = L.Control.Layers.prototype.onAdd.call(this, map)

        if (Array.isArray(this._layers)) {
          this._activeBaseLayer = this._findActiveBaseLayer()
          this._activeOverlayLayers = this._findActiveOverlayLayers()
        } else {    // 0.7.x
          this._activeBaseLayer = this._findActiveBaseLayerLegacy()
          this._activeOverlayLayers = this._findActiveOverlayLayersLegacy()
        }
        return container
      },

      _findActiveBaseLayer: function () {
        var layers = this._layers
        for (var i = 0; i < layers.length; i++) {
          var layer = layers[i]
          if (!layer.overlay && this._map.hasLayer(layer.layer)) {
            return layer
          }
        }
        throw new Error('Control doesn\'t have any active base layer!')
      },

      _findActiveOverlayLayers: function () {
        var result = {}
        var layers = this._layers
        for (var i = 0; i < layers.length; i++) {
          var layer = layers[i]
          if (layer.overlay && this._map.hasLayer(layer.layer)) {
            result[layer.layer._leaflet_id] = layer
          }
        }
        return result
      },

      /**
       * Legacy 0.7.x support methods
       */
      _findActiveBaseLayerLegacy: function () {
        var layers = this._layers
        for (var layerId in layers) {
          if (this._layers.hasOwnProperty(layerId)) {
            var layer = layers[layerId]
            if (!layer.overlay && this._map.hasLayer(layer.layer)) {
              return layer
            }
          }
        }
        throw new Error('Control doesn\'t have any active base layer!')
      },

      _findActiveOverlayLayersLegacy: function () {
        var result = {}
        var layers = this._layers
        for (var layerId in layers) {
          if (this._layers.hasOwnProperty(layerId)) {
            var layer = layers[layerId]
            if (layer.overlay && this._map.hasLayer(layer.layer)) {
              result[layerId] = layer
            }
          }
        }
        return result
      },

      _onLayerChange: function () {
        L.Control.Layers.prototype._onLayerChange.apply(this, arguments)
        this._recountLayers()
      },

      _onInputClick: function () {
        this._handlingClick = true

        this._recountLayers()
        L.Control.Layers.prototype._onInputClick.call(this)

        this._handlingClick = false
      },

      _recountLayers: function () {

      }

    })

    L.control.activeLayers = function (baseLayers, overlays, options) {
      return new L.Control.ActiveLayers(baseLayers, overlays, options)
    }

    L.Control.SelectLayers = L.Control.ActiveLayers.extend({

      _initLayout: function () {
        var className = 'leaflet-control-layers'
        var container = this._container = L.DomUtil.create('div', className)

        L.DomEvent.disableClickPropagation(container)
        if (!L.Browser.touch) {
          L.DomEvent.on(container, 'mousewheel', L.DomEvent.stopPropagation)
        } else {
          L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation)
        }

        var form = this._form = L.DomUtil.create('form', className + '-list')

        if (this.options.collapsed) {
          var link = this._layersLink = L.DomUtil.create('a', className + '-toggle', container)
          link.href = '#'
          link.title = 'Layers'

          if (L.Browser.touch) {
            L.DomEvent
              .on(link, 'click', L.DomEvent.stopPropagation)
              .on(link, 'click', L.DomEvent.preventDefault)
              .on(link, 'click', this._expand, this)
          } else {
            L.DomEvent
              .on(container, 'mouseover', this._expand, this)
              .on(container, 'mouseout', this._collapse, this)
            L.DomEvent.on(link, 'focus', this._expand, this)
          }

          this._map.on('movestart', this._collapse, this)
        } else {
          this._expand()
        }

        this._baseLayersList = L.DomUtil.create('select', className + '-base', form)
        //L.DomEvent.on(this._baseLayersList, 'change', this._onBaseLayerOptionChange, this)
        this._baseLayersList.style.display = 'none';
        this._separator = L.DomUtil.create('div', '', form)
        this._separator.style.display = 'none';
        this._overlaysList = L.DomUtil.create('div', className + '-overlays', form)
        //this._overlaysList.setAttribute('multiple', true)
        //extend across the width of the container
        this._overlaysList.style.width = '100%'
        L.DomEvent.on(this._overlaysList, 'click', this._onOverlayLayerOptionChange, this)

        container.appendChild(form);

      }

      , _onBaseLayerOptionChange: function () {
        /*          var selectedLayerIndex = this._baseLayersList.selectedIndex
         var selectedLayerOption = this._baseLayersList.options[selectedLayerIndex]
         var selectedLayer = this._layers[selectedLayerOption.layerId]

         this._changeBaseLayer(selectedLayer)*/
      }

      , _changeBaseLayer: function (layerObj) {
        /*this._handlingClick = true

         this._map.addLayer(layerObj.layer)
         this._map.removeLayer(this._activeBaseLayer.layer)
         this._map.setZoom(this._map.getZoom())
         this._map.fire('baselayerchange', {layer: layerObj.layer})
         this._activeBaseLayer = layerObj

         this._handlingClick = false*/
      }

      , _onOverlayLayerOptionChange: function (e) {
        //Note. Don't try to implement this function through .selectedIndex
        //or delegation of click event. These methods have bunch of issues on Android devices.

        var self = this;
        self._handlingClick = true;
        var target = e.target || e.srcElement;

        var current = self._layers[target.layerId || target.parentNode.layerId];
        angular.forEach(self._layers, function (ly) {
          if (!ly.overlay) return;

          var layer = ly;
          if (current === layer) {
            self._map.addLayer(layer.layer);
          }
          else {
            self._map.removeLayer(layer.layer);
          }
        });

        this._handlingClick = false
      }

      , _addItem: function (obj) {
        var option = this._createOptionElement(obj)
        if (obj.overlay) {
          this._overlaysList.appendChild(option)
        } else {
          //this._baseLayersList.appendChild(option)
        }
      }

      , _createOptionElement: function (obj) {
        var option = document.createElement('label')
        option.layerId = L.stamp(obj.layer)
        if (this._map.hasLayer(obj.layer)) {
          option.innerHTML = '<input type="radio" selected name="selectLayer"> ' + obj.name + ''
        }
        else {
          option.innerHTML = '<input type="radio" name="selectLayer"> ' + obj.name + ''
        }
        return option
      }

      , _collapse: function (e) {
        if (e.target === this._container) {
          L.Control.Layers.prototype._collapse.apply(this, arguments)
        }
      }

    })

    L.control.selectLayers = function (baseLayers, overlays, options) {
      return new L.Control.SelectLayers(baseLayers, overlays, options)
    }

    return {
      selectLayers:L.control.selectLayers
    }
  }
})();
