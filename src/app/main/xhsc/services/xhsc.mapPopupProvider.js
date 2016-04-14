/**
 * Created by emma on 2016/3/31.
 */
(function(){
  angular
    .module('app.xhsc')
    .service('mapPopupSerivce',mapPopupSerivce);

  /** @Inject */
  function mapPopupSerivce(){
    var popups = {};
    this.set = function(id,element){
      popups[id] = element;
    }
    this.get = function(id){
     return popups[id];
    }
    this.remove = function(id){
      delete popups[id];
    }
  }
})();
