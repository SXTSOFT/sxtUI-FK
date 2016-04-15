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
      getRegion:getRegion
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
    }
    function getProcedure(areaId,cb){
     if(!areaId && cP)return cb(cP);
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
        cb(region);
      })
    }
  }
})();
