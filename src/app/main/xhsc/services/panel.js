/**
 * Created by lss on 2016/9/9.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .factory('panel',panel);
  /** @ngInject */
  function panel($mdPanel){
    function _panel(){
      this._mdPanel=$mdPanel;
      this._mdPaneldef=null;

      function nulnfn(){

      }
      this.default={
        attachTo: angular.element(document.body),
        controller:nulnfn,
        controllerAs: 'ctrl',
        clickOutsideToClose: true,
        escapeToClose: true,
        trapFocus: true,
        focusOnOpen: true,
        hasBackdrop:true,
        disableParentScroll:true
      }
    }
    _panel.prototype.create=function(options){
      var self=this;
      var panelPosition = $mdPanel.newPanelPosition()
        .absolute()
        .center();
      //var animation = $mdPanel.newPanelAnimation();
      //animation.withAnimation($mdPanel.animation.SLIDE);
      if (options&&angular.isObject(options)){
        angular.extend(self.default,options,{
          position: panelPosition
          //animation: animation
        });
      }
      self._mdPanel.open(self.default)
        .then(function(result) {
          self._mdPaneldef=result;
        });
    }
    _panel.prototype.close=function(){
      this._mdPaneldef.close();
    }
    var p=new _panel();
    return{
      create:function(options){
        p.create(options);
      },
      close: function(){
        p.close();
      }
    }
  }
})();
