/**
 * Created by jiuyuong on 2016/4/12.
 */
(function(){
  'use strict';
  angular
    .module('app.xhsc')
    .factory('xhUtils',xhUtils);
  /** @ngInject */
  function xhUtils($mdDialog,$q){
    var _areaId, cP,region;
    var o = {
      getMapPic:getMapPic,
      findAll:findAll,
      findRegion:findRegion,
      wrapRegion:wrapRegion,
      photo:photo,
      when:when,
      playPhoto:playPhoto,
      sort:sort
    };
    return o;

    function getNumName(str) {
      str = str.replace('十', '10')
        .replace('九', '9')
        .replace('八', '8')
        .replace('七', '7')
        .replace('六', '6')
        .replace('五', '5')
        .replace('四', '4')
        .replace('三', '3')
        .replace('二', '2')
        .replace('一', '1')
        .replace('十一', '11')
        .replace('十二', '12')
        .replace('十三', '13')
        .replace('十四', '14')
        .replace('十五', '15')
        .replace('十六', '16')
        .replace('十七', '17')
        .replace('十八', '18')
        .replace('十九', '19')
        .replace('二十', '20');
      var n = parseInt(/[-]?\d+/.exec(str));
      return n;
    };
    function sort(fn) {
      return function (s1,s2) {
        var a1 = fn(s1),
          a2 = fn(s2);

        var n1 = getNumName(a1),
          n2 = getNumName(a2);
        if (!isNaN(n1) && !isNaN(n2))
          return n1 - n2;
        else if ((isNaN(n1) && !isNaN(n2)))
          return 1;
        else if ((!isNaN(n1) && isNaN(n2)))
          return -1;
        else
          return a1.localeCompare(a2);
      }
    }

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
        fd.fullName = (appendName||'')+fd.RegionName;
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

    function when(exec,result) {
      return exec().then(function (r) {
        if(result(r)!==false){
          return exec();
        }
        else
          return r;
      })
    }

    function playPhoto(images,options) {
      var str = [];
      str.push('<ul>')
      angular.forEach(images, function (data) {
        str.push('<li><img src="' + data.url + '" alt="'+data.alt+'"></li>');
      });
      str.push('</ul>');
      o = $(str.join('')).appendTo('body');

      var viewer = new Viewer(o[0],{
        button:true,
        scalable:false,
        hide:function(){
          viewer.destroy();
          o.remove();
          viewer = o=null;
        },
        build:function(){

        },
        view:function(){
        }
      });
      viewer.show();
      return viewer;
    }
  }
})();
