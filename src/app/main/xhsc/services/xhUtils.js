/**
 * Created by jiuyuong on 2016/4/12.
 */
(function(){
  'use strict';
  angular
    .module('app.xhsc')
    .factory('xhUtils',xhUtils);
  /** @ngInject */
  function xhUtils(remote,$rootScope,$q){
    var _areaId, cP,region;
    var o = {
      getProcedure:getProcedure,
      getRegion:getRegion,
      getMapPic:getMapPic,
      findAll:findAll,
      findRegion:findRegion
    };
    return o;

    function appendTree(container,ids, idx, item){
      var id = ids[idx];
      if(!id){
        container.push(item);
        return;
      }
      for(var i= 0,l=container.length;i<l;i++){
        if(container[i].$id == id){
          return appendTree(container[i].children,ids, idx+1, item);
        }
      }
      container.push({
        $id:id,
        $name:item.SpecialtyName.split(';')[idx],
        children:[]
      });
      return appendTree(container[container.length-1].children,ids, idx+1, item);
    }
    function getProcedure(areaId,cb){
     if(!areaId && cP)return cb(angular.copy(cP));
      _areaId = areaId;
      remote.Measure.query(areaId).then(function(result){

        var s = [];
        result.data.forEach(function (item) {
          var ids = item.SpecialtyID.split(';');
          appendTree(s,ids,0,item);
        });
        s.forEach(function(g){
          g.ps = [];
          g.children.forEach(function(c){

            if(!c.children){
              g.ps.push(c);
            }
            else {
              c.ps = [];
              c.children.forEach(function (p) {
                c.ps.push(p);
                g.ps.push(p);
              })
            }
          });
        });
        console.log('r',s)
        cP = s;
        cb(cP);
      });
    }

    function getRegion(areaId,cb){
      if(!areaId || areaId==_areaId &&region ) {
        cb(region);
        return;
      }
      _areaId = areaId;
      remote.Project.Area.queryRegion(_areaId).then(function(result){
        region = result.data;

        region.find = find;
        region.each = each;
        //栋
        region.Children && region.Children.forEach(function(d){
          d.$parent = region;
          d.find = find;
          d.next = next;
          d.prev = prev;
          d.each = each;
          d.Children && d.Children.forEach(function(l){
            l.$parent = d;
            l.find = find;
            l.next = next;
            l.prev = prev;
            l.each = each;

            l.Children && l.Children.forEach(function(r){
              r.$parent = l;
              r.find = find;
              r.next = next;
              r.prev = prev;
              r.each = each;
            })
          })
        });
        cb(angular.copy(region));
      })
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
  }
})();
