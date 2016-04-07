/**
 * Created by jiuyuong on 2016/4/7.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .factory('viewImage',viewImage);

  var CONFIG = {
    CONTAINER: 'js-imageViewer-container',
    IMG_CONTAINER: 'js-imageViewer-base',
    MAG_GLASS: 'js-imageViewer-magGlass',
    IMG: 'js-imageViewer-img',
    CONTROL_ZOOM_IN: 'js-imageViewer-control-zoomIn',
    CONTROL_ZOOM_OUT: 'js-imageViewer-control-zoomOut',
    CONTROL_ZOOM_OUT_IS_DISABLED: 'imageViewer-controls-zoom_isDisabled',
    IMG_SRC_BIG: 'data-imageViewerLg',
    MAG_GLASS_SCALE: 2,
    ZOOM_INCREMENT: 20,
    ZOOM_MAX: 2,
    ZOOM_MIN: 1,
    TRANSITION: 500
  };

  var ImageViewerView = function($element) {
    this.$element = $element;

    this.init();
  };

  ImageViewerView.prototype.init = function() {
    this.isEnabled = false;
    this.isAnimating = false;
    this.$imageViewer = null;
    this.$container = null;
    this.$imgContainer = null;
    this.$magGlass = null;
    this.$img = null;
    this.$controlZoomIn = null;
    this.$controlZoomOut = null;
    this.imgSrcLg = null;
    this.magGlassW = null;
    this.magGlassH = null;
    this.magGlassHalfW = null;
    this.magGlassHalfH = null;
    this.mouseX = null;
    this.mouseY = null;
    this.magGlassX = null;
    this.magGlassY = null;
    this.magGlassBGX = null;
    this.magGlassBGY = null;
    this.magGlassBGW = null;
    this.magGlassBGH = null;
    this.imgContainerX = null;
    this.imgContainerY = null;
    this.imgContainerW = null;
    this.imgContainerH = null;
    this.imgContainerBGX = null;
    this.imgContainerBGY = null;
    this.imgContainerBGW = null;
    this.imgContainerBGH = null;
    this.imgContainerBGRatioW = null;
    this.imgContainerBGRatioH = null;
    this.translateMaxX = null;
    this.translateMaxY = null;
    this.canZoomIn = true;
    this.canZoomOut = false;
    this.$window = $(window);

    return this.setupHandlers()
      .createChildren()
      .layout()
      .enable();
  };

  ImageViewerView.prototype.setupHandlers = function() {
    this.moveMagGlassHandler = $.proxy(this._moveMagGlass, this);
    this.remeasureHandler = $.proxy(this._remeasure, this);
    this.outMouseImgHandler = $.proxy(this._outMouseImg, this);
    this.inMouseImgHandler = $.proxy(this._inMouseImg, this);
    this.zoomInHandler = $.proxy(this._zoomIn, this);
    this.zoomOutHandler = $.proxy(this._zoomOut, this);

    return this;
  };

  ImageViewerView.prototype.createChildren = function() {
    this.$imageViewer = this.$element;
    this.$container = this.$imageViewer.find('.' + CONFIG.CONTAINER);
    this.$imgContainer = this.$imageViewer.find('.' + CONFIG.IMG_CONTAINER);
    this.$img = this.$imageViewer.find('.' + CONFIG.IMG);
    this.$controlZoomIn = this.$imageViewer.find('.' + CONFIG.CONTROL_ZOOM_IN);
    this.$controlZoomOut = this.$imageViewer.find('.' + CONFIG.CONTROL_ZOOM_OUT);
    this.$magGlass = this.$imageViewer.find('.' + CONFIG.MAG_GLASS);
    this.imgSrcLg = this.$img.attr(CONFIG.IMG_SRC_BIG);

    return this;
  };

  ImageViewerView.prototype.layout = function() {
    // Measure container
    this._measureContainer();
    this._measureMagGlass();

    if (!this.isLaidOut) {
      this.$imgContainer.css({
        'background-image' : 'url(' + this.imgSrcLg + ')'
      });

      this.isLaidOut = true;
    }

    this.$imgContainer.css({
      'background-size' : this.imgContainerBGW + 'px, ' + this.imgContainerBGH + 'px',
    });

    // Update style of zoom controls
    if (this.canZoomIn) {
      this.$controlZoomIn
        .removeClass(CONFIG.CONTROL_ZOOM_OUT_IS_DISABLED)
        .removeAttr( 'disabled' );
    } else {
      this.$controlZoomIn
        .addClass(CONFIG.CONTROL_ZOOM_OUT_IS_DISABLED)
        .attr( 'disabled', 'true' );
    }

    if (this.canZoomOut) {
      this.$controlZoomOut
        .removeClass(CONFIG.CONTROL_ZOOM_OUT_IS_DISABLED)
        .removeAttr( 'disabled' );
    } else {
      this.$controlZoomOut
        .addClass(CONFIG.CONTROL_ZOOM_OUT_IS_DISABLED)
        .attr( 'disabled', 'true' );
    }

    // If mouse variables are set, update CSS
    if ( this.magGlassX !== null && this.magGlassBGWStyle !== null ) {
      this.$magGlass.css({
        'top' : this.magGlassY,
        'left' : this.magGlassX,
        'background-image' : 'url(' + this.imgSrcLg + ')',
        'background-position' : this.magGlassBGX + '% ' + this.magGlassBGY + '%',
        'background-size' : this.magGlassBGW + 'px ' + this.magGlassBGH + 'px'
      });
    }

    return this;
  };

  ImageViewerView.prototype.enable = function() {
    if (this.isEnabled) {
      return this;
    }

    this.isEnabled = true;

    this.$imgContainer.on('mousemove', this.moveMagGlassHandler);
    this.$imgContainer.on('mouseenter', this.inMouseImgHandler);
    this.$imgContainer.on('mouseleave', this.outMouseImgHandler);
    this.$controlZoomIn.on('click', this.zoomInHandler);
    this.$controlZoomOut.on('click', this.zoomOutHandler);
    this.$window.on('resize', this.remeasureHandler);

    return this;
  };

  ImageViewerView.prototype._moveMagGlass = function(event) {
    var mouseXPos = null;
    var mouseYPos = null;
    var mouseXPercentage = null;
    var mouseYPercentage = null;

    // Get mouse coordinates relative to viewport
    this.mouseX = event.pageX;
    this.mouseY = event.pageY;

    // Position of mouse relative to container
    mouseXPos = (this.mouseX - this.imgContainerX);
    mouseYPos = (this.mouseY - this.imgContainerY);

    // Position of mouse in container as percentage
    mouseXPercentage = (mouseXPos / this.imgContainerW) * 100;
    mouseYPercentage = (mouseYPos / this.imgContainerH) * 100;

    // Positiion of magnifying glass based on mouse position and magnifying glass offset
    this.magGlassX = mouseXPos - this.magGlassHalfW;
    this.magGlassY = mouseYPos - this.magGlassHalfH;

    // Background image position for magnifying glass
    this.magGlassBGX = ((mouseXPercentage - 50) * this.imgContainerBGRatioW) + 50;
    this.magGlassBGY = ((mouseYPercentage - 50) * this.imgContainerBGRatioH) + 50;

    this.layout();
  };

  ImageViewerView.prototype._measureContainer = function() {
    var magGlassBGRangeW = null;
    var magGlassBGRangeH = null;

    if (!this.isLaidOut) {
      this._measureBackground();
    }

    // Image container's offset from viewport
    this.imgContainerX = this.$imgContainer.offset().left;
    this.imgContainerY = this.$imgContainer.offset().top;

    // Image container's dimensions
    this.imgContainerW = this.$imgContainer.width();
    this.imgContainerH = this.$imgContainer.height();

    // Calculate background image dimensions for magnifying glass
    this.magGlassBGW = (this.magGlassHalfW + this.imgContainerBGW) * CONFIG.MAG_GLASS_SCALE;
    this.magGlassBGH = (this.magGlassHalfH + this.imgContainerBGH) * CONFIG.MAG_GLASS_SCALE;

    // Dimensions for area needed to show full large image in magnifying glass
    // because half of the magnifying glass is hidden when the mouse is on the edge
    magGlassBGRangeW = this.imgContainerBGW + this.magGlassHalfW;
    magGlassBGRangeH = this.imgContainerBGH + this.magGlassHalfH;

    // For when the image is zoomed in: Measure how much the image can be moved around.
    this.translateMaxX = this.imgContainerBGW - this.imgContainerW;
    this.translateMaxY = this.imgContainerBGH - this.imgContainerH;

    // BG range compared to container. Used to calculate how much to move the magnifying glass image
    this.imgContainerBGRatioW = magGlassBGRangeW / (this.imgContainerBGW + this.translateMaxX);
    this.imgContainerBGRatioH = magGlassBGRangeH / (this.imgContainerBGH + this.translateMaxY);

    return this;
  };

  ImageViewerView.prototype._measureBackground = function() {
    // Main container's offset from viewport
    this.imgContainerBGW = this.$container.width();
    this.imgContainerBGH = this.$container.height();

    return this;
  };


  ImageViewerView.prototype._measureMagGlass = function() {
    // Measurements for magnifying glass
    this.magGlassW = this.$magGlass.width();
    this.magGlassH = this.$magGlass.height();
    this.magGlassHalfW = this.magGlassW / 2;
    this.magGlassHalfH = this.magGlassH / 2;

    return this;
  };

  ImageViewerView.prototype._remeasure = function() {
    if (CONFIG.ENABLE_MAG_GLASS) {
      this._measureMagGlass();
    }

    this._measureContainer();
    this._measureBackground();

    this._zoomState(CONFIG.TRANSITION);
  };

  ImageViewerView.prototype._inMouseImg = function() {
    this.$magGlass.show();
    this.layout();
  };

  ImageViewerView.prototype._outMouseImg = function() {
    this.$magGlass.hide();
    this.layout();
  };

  ImageViewerView.prototype._zoomIn = function() {
    this._measureContainer();

    // If the image is already animating, return early
    if (this.isAnimating){
      return;
    }

    this._animationDelay();

    // If the image is ready to zoom in
    if (this.canZoomIn) {

      // Calculate new image width based on increment
      this.imgContainerBGW = this.imgContainerBGW + (this.imgContainerBGW * (CONFIG.ZOOM_INCREMENT / 100));
      this.imgContainerBGH = this.imgContainerBGH + (this.imgContainerBGH * (CONFIG.ZOOM_INCREMENT / 100));

      // Set size values to limits if outside of limits
      this._limitZoom();
    }

    // Finds if the image can zoom more and updates layout
    this._zoomState(CONFIG.TRANSITION);
  };

  ImageViewerView.prototype._zoomOut = function() {
    this._measureContainer();

    // If the image is already animating, return early
    if (this.isAnimating){
      return;
    }

    this._animationDelay();

    // If the image is ready to zoom out
    if (this.canZoomOut) {

      // Calculate new image width based on increment
      this.imgContainerBGW = this.imgContainerBGW - (this.imgContainerBGW * (CONFIG.ZOOM_INCREMENT / 100));
      this.imgContainerBGH = this.imgContainerBGH - (this.imgContainerBGH * (CONFIG.ZOOM_INCREMENT / 100));

      // Set size values to limits if outside of limits
      this._limitZoom();
    }

    // Finds if the image can zoom more and updates layout
    this._zoomState(CONFIG.TRANSITION);
  };

  ImageViewerView.prototype._zoomState = function(delay) {
    var zoomRatio;
    var self = this;

    this.layout();

    // Check dimensions after animation has finished
    setTimeout(function() {

      self._measureContainer();

      zoomRatio = self.imgContainerBGW / self.imgContainerW;

      if (zoomRatio > CONFIG.ZOOM_MIN) {
        self.canZoomOut = true;
      } else {
        self.canZoomOut = false;
      }

      if (zoomRatio < CONFIG.ZOOM_MAX) {
        self.canZoomIn = true;
      } else {
        self.canZoomIn = false;
      }

      self.layout();

    }, delay);

    return this;
  };

  ImageViewerView.prototype._limitZoom = function() {
    // Tests if the new size will be smaller than the min or bigger than the max
    // if so, set the dimensions to those limits
    if (this.imgContainerBGW / this.imgContainerW < CONFIG.ZOOM_MIN) {
      this.imgContainerBGW = (this.imgContainerW * CONFIG.ZOOM_MIN);
      this.imgContainerBGH = (this.imgContainerH * CONFIG.ZOOM_MIN);
    } else if (this.imgContainerBGW / this.imgContainerW >= CONFIG.ZOOM_MAX) {
      this.imgContainerBGW = (this.imgContainerW * CONFIG.ZOOM_MAX);
      this.imgContainerBGH = (this.imgContainerH * CONFIG.ZOOM_MAX);
    }

    return this;
  };

  ImageViewerView.prototype._animationDelay = function() {
    var self = this;

    setTimeout(function() {
      self.isAnimating = false;
    }, CONFIG.TRANSITION);

    this.isAnimating = true;

    return this;
  };

  /** @ngInject */
  function viewImage(){
    var o={
      view:view
    };
    return o;

    function view(src) {
/*      var h = $ (window).height ();
      var dlg = $ ('<div class="imageViewer js-imageViewer" data-magnifyingGlass="false"></div>');
      dlg.css ({
        width: '100%',
        position: 'absolute',
        top: 0,
        height: h,
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        zIndex: 100000
      }).appendTo (document.body);
      dlg.html ('<div class="imageViewer js-imageViewer" data-magnifyingGlass="false">     <div class="imageViewer-container js-imageViewer-container">         <div class="imageViewer-container-base js-imageViewer-base">             <img src="https://placekitten.com/g/2000/2000" data-imageViewerLg="https://placekitten.com/g/2000/2000" alt="" class="imageViewer-container-base-img js-imageViewer-img">         </div>     </div> </div>');


      var imageViewer = new ImageViewerView(dlg.find('.imageViewer'));*/

    }
  }
})();
