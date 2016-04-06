(function(window, document, undefined) {

"use strict";

L.Mapbar = (L.Layer || L.Class).extend({
	statics: {
		baseClass: 'leaflet-toolbar'
	},

	includes: L.Mixin.Events,

	options: {
		className: '',
		filter: function() { return true; },
		actions: []
	},

	initialize: function(options) {
		L.setOptions(this, options);
		this._toolbar_type = this.constructor._toolbar_class_id;
	},

	addTo: function(map) {
		this._arguments = [].slice.call(arguments);

		map.addLayer(this);

		return this;
	},

	onAdd: function(map) {
		var currentToolbar = map._toolbars[this._toolbar_type];

		if (this._calculateDepth() === 0) {
			if (currentToolbar) { map.removeLayer(currentToolbar); }
			map._toolbars[this._toolbar_type] = this;
		}
	},

	onRemove: function(map) {
		/* 
		 * TODO: Cleanup event listeners. 
		 * For some reason, this throws:
		 * "Uncaught TypeError: Cannot read property 'dragging' of null"
		 * on this._marker when a toolbar icon is clicked.
		 */
		// for (var i = 0, l = this._disabledEvents.length; i < l; i++) {
		// 	L.DomEvent.off(this._ul, this._disabledEvents[i], L.DomEvent.stopPropagation);
		// }

		if (this._calculateDepth() === 0) {
			delete map._toolbars[this._toolbar_type];
		}
	},

	appendToContainer: function(container) {
		var baseClass = this.constructor.baseClass + '-' + this._calculateDepth(),
			className = baseClass + ' ' + this.options.className,
			Action, action,
			i, j, l, m;

		this._container = container;
		this._ul = L.DomUtil.create('ul', className, container);

		/* Ensure that clicks, drags, etc. don't bubble up to the map. */
		this._disabledEvents = ['click', 'mousemove', 'dblclick'];

		for (j = 0, m = this._disabledEvents.length; j < m; j++) {
			L.DomEvent.on(this._ul, this._disabledEvents[j], L.DomEvent.stopPropagation);
		}

		/* Instantiate each toolbar action and add its corresponding toolbar icon. */
		for (i = 0, l = this.options.actions.length; i < l; i++) {
			Action = this._getActionConstructor(this.options.actions[i]);

			action = new Action();
			action._createIcon(this, this._ul, this._arguments);
		}
	},

	_getActionConstructor: function(Action) {
		var args = this._arguments,
			toolbar = this;

		return Action.extend({
			initialize: function() {
				Action.prototype.initialize.apply(this, args);
			},
			enable: function(e) {
				/* Ensure that only one action in a toolbar will be active at a time. */
				if (toolbar._active) { toolbar._active.disable(); }
				toolbar._active = this;

				Action.prototype.enable.call(this, e);
			}
		});
	},

	/* Used to hide subToolbars without removing them from the map. */
	_hide: function() {
		this._ul.style.display = 'none';
	},

	/* Used to show subToolbars without removing them from the map. */
	_show: function() {
		this._ul.style.display = 'block';
	},

	_calculateDepth: function() {
		var depth = 0,
			toolbar = this.parentToolbar;

		while (toolbar) {
			depth += 1;
			toolbar = toolbar.parentToolbar;
		}

		return depth;
	}
});

L.mapbar = {};

var toolbar_class_id = 0;

L.Mapbar.extend = function extend(props) {
	var statics = L.extend({}, props.statics, {
		"_toolbar_class_id": toolbar_class_id
	});

	toolbar_class_id += 1;
	L.extend(props, { statics: statics });

	return L.Class.extend.call(this, props);
};

L.Map.addInitHook(function() {
	this._toolbars = {};
});

L.MapbarAction = L.Handler.extend({
	statics: {
		baseClass: 'leaflet-toolbar-icon'
	},

	options: {
	    toolbarIcon: {
			html: '',
			className: '',
			tooltip: ''
		},
		subToolbar: new L.Mapbar()
	},

	initialize: function(options) {
	    var defaultIconOptions = L.MapbarAction.prototype.options.toolbarIcon;

		L.setOptions(this, options);
		this.options.toolbarIcon = L.extend({}, defaultIconOptions, this.options.toolbarIcon);
	},

	enable: function(e) {
		if (e) { L.DomEvent.preventDefault(e); }
		if (this._enabled) { return; }
		this._enabled = true;

		if (this.addHooks) { this.addHooks(); }
	},

	disable: function() {
		if (!this._enabled) { return; }
		this._enabled = false;

		if (this.removeHooks) { this.removeHooks(); }
	},

	_createIcon: function(toolbar, container, args) {
		var iconOptions = this.options.toolbarIcon;

		this.mapbar = toolbar;
		this._icon = L.DomUtil.create('li', '', container);
		this._link = L.DomUtil.create('a', '', this._icon);

		this._link.innerHTML = iconOptions.html;
		this._link.setAttribute('href', 'javascript:void(0)');
		this._link.setAttribute('title', iconOptions.tooltip);

		L.DomUtil.addClass(this._link, this.constructor.baseClass);
		if (iconOptions.className) {
			L.DomUtil.addClass(this._link, iconOptions.className);
		}

		L.DomEvent.on(this._link, 'click', this.enable, this);

		/* Add secondary toolbar */
		this._addSubToolbar(toolbar, this._icon, args);
	},

	_addSubToolbar: function(toolbar, container, args) {
		var subToolbar = this.options.subToolbar,
			addHooks = this.addHooks,
			removeHooks = this.removeHooks;

		/* For calculating the nesting depth. */
		subToolbar.parentToolbar = toolbar;

		if (subToolbar.options.actions.length > 0) {
			/* Make a copy of args so as not to pollute the args array used by other actions. */
			args = [].slice.call(args);
			args.push(this);

			subToolbar.addTo.apply(subToolbar, args);
			subToolbar.appendToContainer(container);

			this.addHooks = function(map) {
				if (typeof addHooks === 'function') { addHooks.call(this, map); }
				subToolbar._show();
			};

			this.removeHooks = function(map) {
				if (typeof removeHooks === 'function') { removeHooks.call(this, map); }
				subToolbar._hide();
			};
		}
	}
});

L.mapbarAction = function toolbarAction(options) {
	return new L.MapbarAction(options);
};

L.MapbarAction.extendOptions = function(options) {
	return this.extend({ options: options });
};

L.Mapbar.Control = L.Mapbar.extend({
	statics: {
		baseClass: 'leaflet-control-toolbar ' + L.Mapbar.baseClass
	},

	initialize: function(options) {
		L.Mapbar.prototype.initialize.call(this, options);

		this._control = new L.Control.Mapbar(this.options);
	},

	onAdd: function(map) {
		this._control.addTo(map);

		L.Mapbar.prototype.onAdd.call(this, map);

		this.appendToContainer(this._control.getContainer());
	},

	onRemove: function(map) {
		L.Mapbar.prototype.onRemove.call(this, map);
		if (this._control.remove) {this._control.remove();}  // Leaflet 1.0
		else {this._control.removeFrom(map);}
	}
});

L.Control.Mapbar = L.Control.extend({
	onAdd: function() {
		return L.DomUtil.create('div', '');
	}
});

L.mapbar.control = function(options) {
    return new L.Mapbar.Control(options);
};

// A convenience class for built-in popup toolbars.

L.Mapbar.Popup = L.Mapbar.extend({
	statics: {
		baseClass: 'leaflet-popup-toolbar ' + L.Mapbar.baseClass
	},

	options: {
		anchor: [0, 0]
	},

	initialize: function(latlng, options) {
		L.Mapbar.prototype.initialize.call(this, options);

		/* 
		 * Developers can't pass a DivIcon in the options for L.Mapbar.Popup
		 * (the use of DivIcons is an implementation detail which may change).
		 */
		this._marker = new L.Marker(latlng, {
			icon : new L.DivIcon({
				className: this.options.className,
				iconAnchor: [0, 0]
			})
		});
	},

	onAdd: function(map) {
		this._map = map;
		this._marker.addTo(map);

		L.Mapbar.prototype.onAdd.call(this, map);

		this.appendToContainer(this._marker._icon);

		this._setStyles();
	},

	onRemove: function(map) {
		map.removeLayer(this._marker);

		L.Mapbar.prototype.onRemove.call(this, map);

		delete this._map;
	},

	setLatLng: function(latlng) {
		this._marker.setLatLng(latlng);

		return this;
	},

	_setStyles: function() {
		var container = this._container,
			toolbar = this._ul,
			anchor = L.point(this.options.anchor),
			icons = toolbar.querySelectorAll('.leaflet-toolbar-icon'),
			buttonHeights = [],
			toolbarWidth = 0,
			toolbarHeight,
			tipSize,
			tipAnchor;

		/* Calculate the dimensions of the toolbar. */
		for (var i = 0, l = icons.length; i < l; i++) {
			if (icons[i].parentNode.parentNode === toolbar) {
				buttonHeights.push(parseInt(L.DomUtil.getStyle(icons[i], 'height'), 10));
				toolbarWidth += Math.ceil(parseFloat(L.DomUtil.getStyle(icons[i], 'width')));
			}
		}
		toolbar.style.width = toolbarWidth + 'px';

		/* Create and place the toolbar tip. */
		this._tipContainer = L.DomUtil.create('div', 'leaflet-toolbar-tip-container', container);
		this._tipContainer.style.width = toolbarWidth + 'px';

		this._tip = L.DomUtil.create('div', 'leaflet-toolbar-tip', this._tipContainer);

		/* Set the tipAnchor point. */
		toolbarHeight = Math.max.apply(undefined, buttonHeights);
		tipSize = parseInt(L.DomUtil.getStyle(this._tip, 'width'), 10);
		tipAnchor = new L.Point(toolbarWidth/2, toolbarHeight + 0.7071*tipSize);

		/* The anchor option allows app developers to adjust the toolbar's position. */
		container.style.marginLeft = (anchor.x - tipAnchor.x) + 'px';
		container.style.marginTop = (anchor.y - tipAnchor.y) + 'px';
	}
});

L.mapbar.popup = function(options) {
    return new L.Mapbar.Popup(options);
};


L.MapEditToolbar = {};

L.MapEdit = L.MapEdit || {};
L.MapEdit.Control = L.MapEdit.Control || {};

L.MapEdit.Control.MapEdit = L.MapbarAction.extend({
    statics: {
        TYPE: 'edit'
    },

    options: {
        selectedPathOptions: {
            color: '#fe57a1', /* Hot pink all the things! */
            opacity: 0.6,
            dashArray: '10, 10',

            fill: true,
            fillColor: '#fe57a1',
            fillOpacity: 0.1,

            // Whether to user the existing layers color
            maintainColor: false
        },
        toolbarIcon: { className: 'leaflet-draw-edit-edit' }
    },

    includes: L.Mixin.Events,

    initialize: function (map, options) {
        L.MapbarAction.prototype.initialize.call(this, map);

        L.setOptions(this, options);

        // Store the selectable layer group for ease of access
        this._featureGroup = this.options.featureGroup;
        this._map = map;

        if (!(this._featureGroup instanceof L.FeatureGroup)) {
            throw new Error('options.featureGroup must be a L.FeatureGroup');
        }

        this._uneditedLayerProps = {};

        // Save the type so super can fire, need to do this as cannot do this.TYPE :(
        this.type = this.constructor.TYPE;
    },

    enable: function () {
        if (this._enabled || !this._hasAvailableLayers()) {
            return;
        }
        this.fire('enabled', { handler: this.type });
        //this disable other handlers

        this._map.fire('draw:editstart', { handler: this.type });
        //allow drawLayer to be updated before beginning edition.

        L.MapbarAction.prototype.enable.call(this);
        this._featureGroup
            .on('layeradd', this._enableLayerEdit, this)
            .on('layerremove', this._disableLayerEdit, this);
    },

    disable: function () {
        if (!this._enabled) { return; }
        this._featureGroup
            .off('layeradd', this._enableLayerEdit, this)
            .off('layerremove', this._disableLayerEdit, this);
        L.MapbarAction.prototype.disable.call(this);
        this._map.fire('draw:editstop', { handler: this.type });
        this.fire('disabled', { handler: this.type });
    },

    addHooks: function () {
        var map = this._map;

        if (map) {
            map.getContainer().focus();

            this._featureGroup.eachLayer(this._enableLayerEdit, this);

            this._tooltip = new L.Tooltip(this._map);
            this._tooltip.updateContent({
                text: L.drawLocal.edit.handlers.edit.tooltip.text,
                subtext: L.drawLocal.edit.handlers.edit.tooltip.subtext
            });

            this._map.on('mousemove', this._onMouseMove, this);
        }
    },

    removeHooks: function () {
        if (this._map) {
            // Clean up selected layers.
            this._featureGroup.eachLayer(this._disableLayerEdit, this);

            // Clear the backups of the original layers
            this._uneditedLayerProps = {};

            this._tooltip.dispose();
            this._tooltip = null;

            this._map.off('mousemove', this._onMouseMove, this);
        }
    },

    revertLayers: function () {
        this._featureGroup.eachLayer(function (layer) {
            this._revertLayer(layer);
        }, this);
    },

    save: function () {
        var editedLayers = new L.LayerGroup();
        this._featureGroup.eachLayer(function (layer) {
            if (layer.edited) {
                editedLayers.addLayer(layer);
                layer.edited = false;
            }
        });
        this._map.fire('draw:edited', { layers: editedLayers });
    },

    _backupLayer: function (layer) {
        var id = L.Util.stamp(layer);

        if (!this._uneditedLayerProps[id]) {
            // Polyline, Polygon or Rectangle
            if (layer instanceof L.Polyline || layer instanceof L.Polygon || layer instanceof L.Rectangle) {
                this._uneditedLayerProps[id] = {
                    latlngs: L.LatLngUtil.cloneLatLngs(layer.getLatLngs())
                };
            } else if (layer instanceof L.Circle) {
                this._uneditedLayerProps[id] = {
                    latlng: L.LatLngUtil.cloneLatLng(layer.getLatLng()),
                    radius: layer.getRadius()
                };
            } else if (layer instanceof L.Marker) { // Marker
                this._uneditedLayerProps[id] = {
                    latlng: L.LatLngUtil.cloneLatLng(layer.getLatLng())
                };
            }
        }
    },

    _revertLayer: function (layer) {
        var id = L.Util.stamp(layer);
        layer.edited = false;
        if (this._uneditedLayerProps.hasOwnProperty(id)) {
            // Polyline, Polygon or Rectangle
            if (layer instanceof L.Polyline || layer instanceof L.Polygon || layer instanceof L.Rectangle) {
                layer.setLatLngs(this._uneditedLayerProps[id].latlngs);
            } else if (layer instanceof L.Circle) {
                layer.setLatLng(this._uneditedLayerProps[id].latlng);
                layer.setRadius(this._uneditedLayerProps[id].radius);
            } else if (layer instanceof L.Marker) { // Marker
                layer.setLatLng(this._uneditedLayerProps[id].latlng);
            }

            layer.fire('revert-edited', { layer: layer });
        }
    },

    _enableLayerEdit: function (e) {
        var layer = e.layer || e.target || e,
            pathOptions;

        // Back up this layer (if haven't before)
        this._backupLayer(layer);

        // Set different style for editing mode
        if (this.options.selectedPathOptions) {
            pathOptions = L.Util.extend({}, this.options.selectedPathOptions);

            // Use the existing color of the layer
            if (pathOptions.maintainColor) {
                pathOptions.color = layer.options.color;
                pathOptions.fillColor = layer.options.fillColor;
            }

            layer.options.original = L.extend({}, layer.options);
            layer.options.editing = pathOptions;
        }

        layer.editing.enable();
    },

    _disableLayerEdit: function (e) {
        var layer = e.layer || e.target || e;

        layer.edited = false;
        layer.editing.disable();

        delete layer.options.editing;
        delete layer.options.original;
    },

    _onMouseMove: function (e) {
        this._tooltip.updatePosition(e.latlng);
    },

    _hasAvailableLayers: function () {
        return this._featureGroup.getLayers().length !== 0;
    }
});


L.MapEdit = L.MapEdit || {};
L.MapEdit.Control = L.MapEdit.Control || {};

L.MapEdit.Control.Delete = L.MapbarAction.extend({
    statics: {
        TYPE: 'remove' // not delete as delete is reserved in js
    },

    options: {
        toolbarIcon: { className: 'leaflet-draw-edit-remove' }
    },

    includes: L.Mixin.Events,

    initialize: function (map, options) {
        L.MapbarAction.prototype.initialize.call(this, map);

        L.Util.setOptions(this, options);

        // Store the selectable layer group for ease of access
        this._deletableLayers = this.options.featureGroup;
        this._map = map;

        if (!(this._deletableLayers instanceof L.FeatureGroup)) {
            throw new Error('options.featureGroup must be a L.FeatureGroup');
        }

        // Save the type so super can fire, need to do this as cannot do this.TYPE :(
        this.type = this.constructor.TYPE;
    },

    enable: function () {
        if (this._enabled || !this._hasAvailableLayers()) {
            return;
        }
        this.fire('enabled', { handler: this.type });

        this._map.fire('draw:deletestart', { handler: this.type });

        L.MapbarAction.prototype.enable.call(this);

        this._deletableLayers
            .on('layeradd', this._enableLayerDelete, this)
            .on('layerremove', this._disableLayerDelete, this);
    },

    disable: function () {
        if (!this._enabled) { return; }

        this._deletableLayers
            .off('layeradd', this._enableLayerDelete, this)
            .off('layerremove', this._disableLayerDelete, this);

        L.MapbarAction.prototype.disable.call(this);

        this._map.fire('draw:deletestop', { handler: this.type });

        this.fire('disabled', { handler: this.type });
    },

    addHooks: function () {
        var map = this._map;

        if (map) {
            map.getContainer().focus();

            this._deletableLayers.eachLayer(this._enableLayerDelete, this);
            this._deletedLayers = new L.layerGroup();

            this._tooltip = new L.Tooltip(this._map);
            this._tooltip.updateContent({ text: L.drawLocal.edit.handlers.remove.tooltip.text });

            this._map.on('mousemove', this._onMouseMove, this);
        }
    },

    removeHooks: function () {
        if (this._map) {
            this._deletableLayers.eachLayer(this._disableLayerDelete, this);
            this._deletedLayers = null;

            this._tooltip.dispose();
            this._tooltip = null;

            this._map.off('mousemove', this._onMouseMove, this);
        }
    },

    revertLayers: function () {
        // Iterate of the deleted layers and add them back into the featureGroup
        this._deletedLayers.eachLayer(function (layer) {
            this._deletableLayers.addLayer(layer);
            layer.fire('revert-deleted', { layer: layer });
        }, this);
    },

    save: function () {
        this._map.fire('draw:deleted', { layers: this._deletedLayers });
    },

    _enableLayerDelete: function (e) {
        var layer = e.layer || e.target || e;

        layer.on('click', this._removeLayer, this);
    },

    _disableLayerDelete: function (e) {
        var layer = e.layer || e.target || e;

        layer.off('click', this._removeLayer, this);

        // Remove from the deleted layers so we can't accidently revert if the user presses cancel
        this._deletedLayers.removeLayer(layer);
    },

    _removeLayer: function (e) {
        var layer = e.layer || e.target || e;

        this._deletableLayers.removeLayer(layer);

        this._deletedLayers.addLayer(layer);

        layer.fire('deleted');
    },

    _onMouseMove: function (e) {
        this._tooltip.updatePosition(e.latlng);
    },

    _hasAvailableLayers: function () {
        return this._deletableLayers.getLayers().length !== 0;
    }
});


L.MapEditToolbar.Control = L.Mapbar.Control.extend({
    options: {
        actions: [
            L.MapEdit.Control.MapEdit,
            L.MapEdit.Control.Delete
        ],
        className: 'leaflet-draw-toolbar'
    },

    /* Accomodate Leaflet.draw design decision to pass featureGroup as an option rather than a parameter. */
    _getActionConstructor: function (Action) {
        var map = this._arguments[0],
            featureGroup = this._arguments[1],
            A = L.Mapbar.prototype._getActionConstructor.call(this, Action);

        return A.extend({
            options: { featureGroup: featureGroup },
            initialize: function () {
                Action.prototype.initialize.call(this, map);
            }
        });
    }
});

L.MapEditToolbar.Save = L.MapbarAction.extend({
    options: {
        toolbarIcon: { html: 'Save' }
    },
    initialize: function (map, featureGroup, editing) {
        this.editing = editing;
        L.MapbarAction.prototype.initialize.call(this);
    },
    addHooks: function () {
        this.editing.save();
        this.editing.disable();
    }
});

L.MapEditToolbar.Undo = L.MapbarAction.extend({
    options: {
        toolbarIcon: { html: 'Undo' }
    },
    initialize: function (map, featureGroup, editing) {
        this.editing = editing;
        L.MapbarAction.prototype.initialize.call(this);
    },
    addHooks: function () {
        this.editing.revertLayers();
        this.editing.disable();
    }
});

    /* Enable save and undo functionality for edit and delete modes. */
L.setOptions(L.MapEdit.Control.Delete.prototype, {
    subToolbar: new L.Mapbar({ actions: [L.MapEditToolbar.Save, L.MapEditToolbar.Undo] })
});

L.setOptions(L.MapEdit.Control.MapEdit.prototype, {
    subToolbar: new L.Mapbar({ actions: [L.MapEditToolbar.Save, L.MapEditToolbar.Undo] })
});

L.MapEdit = L.MapEdit || {};
L.MapEdit.Popup = L.MapEdit.Popup || {};

L.MapEdit.Popup.MapEdit = L.MapbarAction.extend({
    options: {
        toolbarIcon: { className: 'leaflet-draw-edit-edit' }
    },

    initialize: function (map, shape, options) {
        this._map = map;

        this._shape = shape;
        this._shape.options.editing = this._shape.options.editing || {};

        L.MapbarAction.prototype.initialize.call(this, map, options);
    },

    enable: function () {
        var map = this._map,
            shape = this._shape;

        shape.editing.enable();
        map.removeLayer(this.mapbar);

        map.on('click', function () {
            shape.editing.disable();
        });
    }
});

L.MapEdit = L.MapEdit || {};
L.MapEdit.Popup = L.MapEdit.Popup || {};

L.MapEdit.Popup.Delete = L.MapbarAction.extend({
    options: {
        toolbarIcon: { className: 'leaflet-draw-edit-remove' }
    },

    initialize: function (map, shape, options) {
        this._map = map;
        this._shape = shape;

        L.MapbarAction.prototype.initialize.call(this, map, options);
    },

    addHooks: function () {
        this._map.removeLayer(this._shape);
        this._map.removeLayer(this.mapbar);
    }
});


L.MapEditToolbar.Popup = L.Mapbar.Popup.extend({
    options: {
        actions: [
            L.MapEdit.Popup.MapEdit,
            L.MapEdit.Popup.Delete
        ]
    },

    onAdd: function (map) {
        var shape = this._arguments[1];

        if (shape instanceof L.Marker) {
            /* Adjust the toolbar position so that it doesn't cover the marker. */
            this.options.anchor = L.point(shape.options.icon.options.popupAnchor);
        }

        L.Mapbar.Popup.prototype.onAdd.call(this, map);
    }
});
L.ColorPicker = L.MapbarAction.extend({
    options: {
        toolbarIcon: { className: 'leaflet-color-swatch' }
    },

    initialize: function (map, shape, options) {
        this._shape = shape;
        this._map = map;
        L.setOptions(this, options);
        L.MapbarAction.prototype.initialize.call(this, map, options);
    },

    addHooks: function () {
        this._shape.setStyle({ color: this.options.color });
        this.disable();
    },

    _createIcon: function (toolbar, container, args) {
        var colorSwatch = L.DomUtil.create('div'),
            width, height;

        L.MapbarAction.prototype._createIcon.call(this, toolbar, container, args);

        L.extend(colorSwatch.style, {
            backgroundColor: this.options.color,
            width: L.DomUtil.getStyle(this._link, 'width'),
            height: L.DomUtil.getStyle(this._link, 'height'),
            border: '3px solid ' + L.DomUtil.getStyle(this._link, 'backgroundColor')
        });

        this._link.appendChild(colorSwatch);

        L.DomEvent.on(this._link, 'click', function () {
            this._map.removeLayer(this.mapbar.parentToolbar);
        }, this);
    }
});
})(window, document);