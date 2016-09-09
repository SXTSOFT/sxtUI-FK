/**
 * Created by lss on 2016/9/8.
 */
/**
 * Created by emma on 2016/6/7.
 */
(function(){
  'use strict';

  angular
    .module('app.pcReport_ys')
    .controller('gxysReportController',gxysReportController);

  /**@ngInject*/
  function gxysReportController($scope,$mdPanel){
    var vm = this;
    vm.gxSelected='';
    vm.regions=[{
      regionID:1,
      regionName:'星河雅宝项目'
    },{
      regionID:2,
      regionName:'5号地块'
    },{
      regionID:3,
      regionName:'1栋'
    },{
      regionID:4,
      regionName:'5层'
    }]

    vm.removeRegion=function(chip){
      for (var i=vm.regions.length-1;i>=0;i--)
      {
        if (vm.regions[i].regionID>chip.regionID){
          vm.regions.splice(i,1);
        }
      }
    }
    //function panel($mdPanel){
    //  this._mdPanel=$mdPanel;
    //  this._mdPaneldef=null;
    //  var panelPosition = $mdPanel.newPanelPosition()
    //    .absolute()
    //    .center();
    //
    //  function nulnfn(){
    //
    //  }
    //  this.default={
    //    attachTo: angular.element(document.body),
    //    controller:nulnfn,
    //
    //    controllerAs: 'ctrl',
    //    position: panelPosition,
    //    clickOutsideToClose: true,
    //    escapeToClose: true,
    //    trapFocus: true,
    //    focusOnOpen: true,
    //    hasBackdrop:true,
    //    disableParentScroll:true
    //  }
    //}
    //
    //
    //panel.prototype.create=function(options){
    //  var self=this;
    //  if (options&&angular.isObject(options)){
    //    angular.extend(self.default,options);
    //  }
    //  self._mdPanel.open(self.default)
    //    .then(function(result) {
    //      self._mdPaneldef=result;
    //    });
    //}
    //panel.prototype.close=function(){
    //  this._mdPanel.close();
    //}

  }

})();
