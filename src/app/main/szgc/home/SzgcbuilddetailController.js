/**
 * Created by emma on 2016/2/23.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .controller('SzgcbuilddetailController', SzgcdetailController);

  /** @ngInject */
  function SzgcdetailController($scope,$stateParams,$mdSidenav,api,$q,details,utils,appCookie)
  {

    function buildToggler(navID) {
      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {

          });
      }
    }
    var vm = this,selected;
    vm.selected = selected = {
      name:'已选择',
      children:[{
        name:'已选择',
        ps:[]
      }],
      ps:[]
    }
    vm.query = function () {
      vm.build.loading = true;
      vm.build.query();
    };
    $scope.$watch('vm.build.isOpen',function () {
      if(!vm.build.isOpen && vm.procedures){
        var g = [];
        vm.procedures.forEach(function (gx) {
          if(gx.checked){
            g.push(gx.ProcedureId);

          }
        })
        if(!g.length){
          utils.alert('请选择要显示的工序').then(function () {
            vm.openGx();
          });
          return;
        }
        appCookie.put('_gx_',g);
        vm.query();
      }
    })
    vm.clearAll = function(){
      vm.selected.ps=[];
      vm.procedures.forEach(function(r){
        r.checked = false;
      })
    }
    vm.itemChecked1 = function (p) {
      p.checked = !p.checked;
      vm.itemChecked(p);
    }
    vm.itemChecked = function (p) {
      vm.procedures.forEach(function (gx) {
        if(gx.checked && !selected.ps.find(function (a) {
            return a===gx;
          })){
          selected.ps.push(gx);
          selected.children[0].ps.push(gx);
        }
      });

      if(selected.ps.length>4){
        utils.alert('一次仅能显示四种工序');
        p.checked =false;
      }
      for(var i=selected.ps.length-1;i>=0;i--){
        if(!selected.ps[i].checked){
          selected.ps.splice(i,1);
          selected.children[0].ps.splice(i,1);
        }
      }
    }


    vm.build = {
      name: $stateParams.buildName || $scope.$parent.vm.current.name,
      building_id: $stateParams.buildId || $scope.$parent.vm.current.building_id,
      floors: $stateParams.floors || $scope.$parent.vm.current.floors,
      summary: $stateParams.summary || $scope.$parent.vm.current.summary,
      gx1: $scope.$parent.vm.current.gx1,
      gx2: $scope.$parent.vm.current.gx2
    };
    vm.openGx = buildToggler('procedure_right');
    vm.openZt = buildToggler('zt_right');
/*    vm.build = {
    }*/
    vm.treeId = $stateParams.pid + '>' + $stateParams.itemId + '>' + $stateParams.buildId;
    //vm.sellLine = 0.6;
    vm.data= {
      data:details
    };

    $q.all([
      api.szgc.vanke.skills({ page_number: 1, page_size: 0 }),
      api.szgc.BatchSetService.getAll({status:4,batchType:255})
    ]).then(function (results) {

      var s = [],result = results[0];
      result.data.data.forEach(function (item) {
        if(!item.parent)return;
        var gn = s.find(function(g){return item.parent.name== g.name});
        if(!gn){
          gn = {
            name:item.parent.name,
            children:[]
          };
          s.push(gn);
        }
        gn.children.push(item);
      });

      s.forEach(function(g){
        g.ps = [];
        g.children.forEach(function(c){
          c.ps = [];
          results[1].data.Rows.forEach(function(p){
            //console.log(p,c);
            if(p.ProcedureTypeId == c.skill_id){
              c.ps.push(p);
              g.ps.push(p);
            }
          })
        });
      });
      //console.log('s',s);
      vm.types = s;
      vm.procedures = results[1].data.Rows;
      var g = appCookie.get('_gx_');
      if(g){
        g = angular.isArray(g)?g:g.replace('[','').replace(']','').split(',');
        g.forEach(function (item) {
          var fd = vm.procedures.find(function (gx) {
            return gx.ProcedureId==item;
          });
          if(fd){
            fd.checked = true;
            selected.ps.push(fd);
            selected.children[0].ps.push(fd);
          }
        });
      }
      if(g && g.length) {
        vm.query();
      }
      else{
        vm.openGx();
      }

    });


  }

})();
