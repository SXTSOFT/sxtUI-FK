/**
 * Created by jiuyuong on 2016/4/12.
 */
(function(){
  'use strict';
  angular
    .module('app.xhsc')
    .factory('xhUtils',xhUtils);
  /** @ngInject */
  function xhUtils(remote,$rootScope){
    var cP;
    var o = {
      getProcedure:getProcedure
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
    function getProcedure(cb){
      if(cP)cb(cp);
      remote.Measure.query().then(function(result){

        var s = [];
        result.data.rows.forEach(function (item) {
          var ids = item.SpecialtyID.split(';');
          appendTree(s,ids,0,item);
        });
        s.forEach(function(g){
          g.ps = [];
          g.children.forEach(function(c){
            c.ps = [];
            c.children.forEach(function(p){
                c.ps.push(p);
                g.ps.push(p);
            })
          });
        });
        console.log('r',s)
        cP = s;
        cb(cP);
      });
    }
  }
})();
