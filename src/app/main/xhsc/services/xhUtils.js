/**
 * Created by jiuyuong on 2016/4/12.
 */
(function(){
  'use strict';
  angular
    .module('app.xhsc')
    .factory('xhUtils',xhUtils);
  /** @ngInject */
  function xhUtils($mdDialog){
    var _areaId, cP,region;
    var o = {
      getMapPic:getMapPic,
      findAll:findAll,
      findRegion:findRegion,
      wrapRegion:wrapRegion,
      photo:photo
    };
    return o;


    function wrapRegion(target){
        region = target;
        region.find = find;
        region.each = each;
        region.fullName = region.RegionName;
        //栋
        region.Children && region.Children.forEach(function(d){
          d.$parent = region;
          d.fullName = region.fullName+d.RegionName;
          d.find = find;
          d.next = next;
          d.prev = prev;
          d.each = each;
          d.Children && d.Children.forEach(function(l){
            l.$parent = d;
            l.fullName = d.fullName+l.RegionName;
            l.find = find;
            l.next = next;
            l.prev = prev;
            l.each = each;

            l.Children && l.Children.forEach(function(r){
              r.$parent = l;
              r.fullName = l.fullName+r.RegionName;
              r.find = find;
              r.next = next;
              r.prev = prev;
              r.each = each;
            })
          })});
        function each(fn){
          fn(this);
          this.Children && this.Children.forEach(function(item){
            item.each(fn);
          })
        }
        function find(id){
          if(this.RegionID==id ||(typeof id==='function' && id(this)===true))
            return this;

          if(this.Children){
            var fd;
            this.Children.forEach(function(c){
              if(!fd){
                fd = c.find(id);
              }
            });
            if(fd)
              return fd;
          }
        }
        function next(){
          if(this.$parent) {
            var ix = this.$parent.Children.indexOf(this);
            var next = this.$parent.Children[ix + 1];
            if (next)
              return next;
            var p = this.$parent.next && this.$parent.next();
            if(p&& p.Children){
              return p.Children[0];
            }
          }
        }
        function prev(){
          if(this.$parent) {
            var ix = this.$parent.Children.indexOf(this);
            var next = this.$parent.Children[ix - 1];
            if (next)
              return next;
            var p = this.$parent.prev &&  this.$parent.prev();
            if(p && p.Children){
              return p.Children[p.Children.length-1];
            }
          }
        }
        return region;
    }

    function getMapPic(maxZoom){
      //console.log('m',maxZoom,Math.pow(2,maxZoom))
      var pics = [];
      for(var z=0;z<=maxZoom;z++){
        for(var x= 0,xl = Math.pow(2,z);x<xl;x++){
          for(var y= 0,yl = xl;y<yl;y++){
            pics.push(z+'_'+x+'_'+y)
          }
        }
      }
      return pics;
    }

    function findAll(array,fn) {
      var buff=[];
      array.forEach(function (item) {
        if(fn(item)===true)
          buff.push(item);
      });
      return buff;
    }

    function findRegion(regions,id,appendName) {
      if(!regions)return null;
      if(!angular.isArray(regions)){
        regions=[regions];
      }
      var fd = regions.find(function (r) {
        var len = r.RegionID.length;
        return id.substring(0,len)==r.RegionID;
      });
      if(!fd)return null;
      if(fd.RegionID!=id)
        return findRegion(fd.Children,id,(appendName||'')+fd.RegionName);
      else {
        fd.fullName = appendName+fd.RegionName;
        return fd;
      }
    }

    function  upRegion(regions,current){
      if(this.$parent) {
        var ix = this.$parent.Children.indexOf(this);
        var next = this.$parent.Children[ix - 1];
        if (next)
          return next;
        var p = this.$parent.prev &&  this.$parent.prev();
        if(p && p.Children){
          return p.Children[p.Children.length-1];
        }
      }
    }

    function photo($event) {
      return $mdDialog.show({
        targetEvent: $event,
        controller:['$scope', '$mdDialog',function ($scope, $mdDialog) {
          $scope.cancel = function () {
            $mdDialog.cancel();
          }
          $scope.answer = function ($base64Url) {
            $mdDialog.hide($base64Url);
          }
        }],
        fullscreen:true,
        template: '<md-dialog style="width: 100%;max-width: 100%;height: 100%;max-height: 100%;" aria-label="List dialog">' +
        '  <md-dialog-content flex layout="column" style="padding: 0">' +
        '<photo-draw flex layout="column" on-cancel="cancel()" on-answer="answer($base64Url)"></photo-draw>' +
        '  </md-dialog-content>'+
        '</md-dialog>'
      });
    }
  }
})();
