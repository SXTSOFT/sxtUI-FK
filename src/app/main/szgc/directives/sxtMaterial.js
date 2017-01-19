/**
 * Created by leshuangshuang on 16/8/17.
 */
(function(){
  'use strict';

  angular
    .module('app.material')
    .directive('sxtMaterial',sxtMaterial)
    .directive('sxtMaterial2',sxtMaterial2)

  /** @ngInject */
  function sxtMaterial(api,appCookie,$timeout){

    function sort(compares) {
      return function (p1,p2) {
        var ix = compares.indexOf(p1.ProcedureId),
          ix1 = compares.indexOf(p2.ProcedureId);
        return ix-ix1;
      }
    }

    return {
      require:'ngModel',
      scope:{
        procedureTypeId: '=',
        regionType:'=',
        value:'=ngModel',
        nameValue:'=',
        onSelect:'&',
        materialUnit:'=',
        materialModels:'=',
        materialSupply:'=',
        inc :'@'
      },

      template:'<md-tabs flex md-border-bottom >\
      <md-tab ng-repeat="g in types|sxtProcedureS" >\
      <md-tab-label><div style="line-height: 100%">{{g.name}}<div style="font-size: 10px;">({{g.ps.length}})</div></div></md-tab-label>\
      <md-tab-body flex layout-fill layout="column"><div flex layout="column">\
      <div flex="none" >\
        <md-button class="md-raised" style="min-width:inherit;" ng-class="{\'md-primary\':g.current===c}" class="md-block" ng-click="g.current=c" ng-repeat="c in g.children|sxtProcedureS">{{c.Name}}({{c.ps.length}})</md-button>\
      <md-divider></md-divider></div><md-content style="background: white;">\
      <md-list style="padding:0;" class="newheight">\
      <md-list-item ng-click="sett(p)" ng-repeat="p in g.current.ps"  style="padding:0;">\
      {{p.ProcedureName}}\
      <md-divider ng-if="!$last"></md-divider>\
      </md-list-item>\
      </md-list>\
      </md-content></div>\
     </md-tab-body>\
      </md-tab>\
      </md-tabs>',
      link:link
    };

    function link(scope,element,attrs,ctrl){

      scope.sett = function(p){
        scope.procedureTypeId = p.ProcedureTypeId;
        scope.value = p.ProcedureId;
        scope.nameValue = p.ProcedureName;
        scope.materialUnit = p.Unit;
        scope.materialModels = p.Model?p.Model.split(/、|；|;/):p.Model;
        scope.materialSupply = p.Supply;
        ctrl.$setViewValue(scope.value);
        if(!scope.inc) {
          var odd = appCookie.get('prev_material'),
            odds =(odd?odd.split(','):[]).filter(function (p) {
              return !!p;
            });
          var ix = odds.indexOf(p.ProcedureId);
          if(ix!==0) {
            if (ix != -1)
              odds.splice(ix, 1);
            odds = [p.ProcedureId].concat(odds);
            if(scope.types[0].ps.indexOf(p)==-1){
              scope.types[0].ps.push(p);
              scope.types[0].children[0].ps.push(p);
            }
            scope.types[0].ps.sort(sort(odds));
            scope.types[0].children[0].ps.sort(sort(odds));
            if (odds.length > 5)
              odds.length = 5;
            appCookie.put('prev_material', odds.join(','));
          }
        }
        scope.onSelect && scope.onSelect({$selected:scope.value});
      }
      scope.Plength = 0;

      api.material.MaterialTypeService.GetProcedureType().then(function (result) {
        var s = [{
          name:'最近',
          ps:[],
          children:[{
            Name:'最近',
            ps:[]
          }]
        }];
        result.data.Rows.forEach(function (item) {
          if(!item.ParentName)return;
          var gn = s.find(function(g){return item.ParentName== g.name});
          if(!gn){
            gn = {
              name:item.ParentName,
              children:[]
            };
            s.push(gn);
          }
          gn.children.push(item);
        });
        scope.types = s;
        resetSources();
      });
      scope.$watch('regionType',function(){
        if(!scope.inc && !scope.regionType) return;
        scope.value = null;
        scope.nameValue = null;
        scope.materialUnit = null;
        scope.materialModels = null;
        scope.materialSupply = null;
        ctrl.$setViewValue();
        if(!scope.regionType && !scope.inc)return;
        var t = 1,ex=[1],q={
          status:4
        };

        switch (scope.regionType) {
          case 1:
            t = 2;
            ex = ex.concat([2,8,32,64,128,256,512]);
            break;
          case 2:
            t = 8;
            ex = ex.concat([ 8,32,64,128,256,512]);
            break;
          case 8:
            t = 32;
            ex = ex.concat([32,64]);
            break;
          case 32:
            t = 64;
            ex = ex.concat([64]);
            break;
          case 128:
            t = 128;
            ex = ex.concat([128]);
            break;
          case 256:
            t = 256;
            ex = ex.concat([256]);
            break;
          case 512:
            t = 512;
            ex = ex.concat([512]);
            break;
          default:
            ex = ex.concat([2, 8, 32, 64]);
            break;
        }
        api.material.BatchSetService.getAll(q).then(function(result) {
          var data = [];
          result.data.Rows.forEach(function(item) {
              data.push(item);
          });
          scope.procedures = data;
          scope.Plength = scope.procedures.length;
          resetSources();
        });

      });

      function resetSources(){
        if(scope.types && scope.procedures){
          scope.types.forEach(function(g){
            g.ps = [];
            g.children.forEach(function(c){
              c.ps = [];
              scope.procedures.forEach(function(p){
                if(p.ProcedureTypeId == c.Id){
                  c.ps.push(p);
                  g.ps.push(p);
                }
              })
            });
            g.current = g.children.find(function (c) {
              return c.ps.length!==0;
            });
          });
          if(!scope.inc) {
            var pre = appCookie.get('prev_material');
            if (pre) {
              pre = pre.split(',');
              var prev;
              pre.forEach(function (p1) {
                var prev1 = scope.procedures.find(function (p) {
                  return p.ProcedureId == p1;
                });
                if(prev1) {

                  scope.types[0].ps.push(prev1);
                  scope.types[0].children[0].ps.push(prev1);
                  if (!prev) {
                    prev = prev1;
                    scope.types[0].current = scope.types[0].children[0];
                  }
                }
              });
              if (prev)
                scope.sett(prev);
            }
          }
        }
      }
    }
  }


  /** @ngInject */
  function sxtMaterial2(api){
    return {
      require:'ngModel',
      scope:{
        procedureTypeId: '=',
        regionType:'=',
        value:'=ngModel',
        nameValue:'=',
        materialUnit:'=',
        materialModels:'=',
        materialSupply:'=',
        inc :'@'
      },
      template:'<div layout="row">' +
      '<md-input-container style="margin:8px 0;" flex md-no-float class="md-block"><label>可选材料({{Plength}})</label><input  ng-model="nameValue" readonly></md-input-container>'+
      '<md-menu flex="none">\
    <md-button aria-label="Open  menu" class="md-icon-button" ng-click="$mdOpenMenu($event)">\
    <md-icon md-menu-origin  md-font-icon="icon-arrow-down"></md-icon>\
    </md-button>\
    <md-menu-content width="6" >\
   <md-tabs md-border-bottom >\
    <md-tab ng-repeat="g in types|sxtProcedureS">\
    <md-tab-label><span sxt-procedure-tb>{{g.name}}({{g.ps.length}})</span></md-tab-label>\
    <md-tab-body>\
    <md-content>\
    <section ng-repeat="c in g.children|sxtProcedureS">\
    <md-subheader class="md-primary">{{c.Name}}({{c.ps.length}})</md-subheader>\
    <md-list style="padding:0;" class="newheight">\
    <md-list-item ng-click="sett(p)" ng-repeat="p in c.ps"  style="padding:0;">\
    {{p.ProcedureName}}\
    </md-list-item>\
    </md-list>\
    </section>\
    </md-content>\
   </md-tab-body>\
    </md-tab>\
    </md-tabs>\
  </md-menu-content>\
  </md-menu>'+
      '</div>',
      link:link
    };

    function link(scope,element,attrs,ctrl){

      scope.sett = function(p){
        scope.procedureTypeId = p.ProcedureTypeId;
        scope.value = p.ProcedureId;
        scope.nameValue = p.ProcedureName;
        scope.materialUnit = p.Unit;
        scope.materialModels = p.Model?p.Model.split(/、|；|;/):p.Model;
        scope.materialSupply = p.Supply;
        ctrl.$setViewValue(scope.value);
      }


      api.material.MaterialTypeService.GetProcedureType().then(function (result) {
        var s = [];
        result.data.Rows.forEach(function (item) {
          if(!item.ParentName)return;
          var gn = s.find(function(g){return item.ParentName== g.name});
          if(!gn){
            gn = {
              name:item.ParentName,
              children:[]
            };
            s.push(gn);
          }
          gn.children.push(item);
        });
        scope.types = s;
        resetSources();
      });
      scope.$watch('regionType',function(){
        scope.Plength = 0;
        scope.value = null;
        scope.nameValue = null;
        scope.materialUnit = null;
        scope.materialModels = null;
        scope.materialSupply = null;
        ctrl.$setViewValue();
        if(!scope.regionType && !scope.inc)return;
        var t = 1,ex=[1],q={
          status:4
        };

        switch (scope.regionType) {
          case 1:
            t = 2;
            ex = ex.concat([2,8,32,64]);
            break;
          case 2:
            t = 8;
            ex = ex.concat([ 8,32,64])
            break;
          case 8:
            t = 32;
            ex = ex.concat([32,64])
            break;
          case 32:
            t = 64;
            ex = ex.concat([64])
            break;
          default:
            ex = ex.concat([2, 8, 32, 64]);
            break;
        }

        api.material.BatchSetService.getAll(q).then(function(result) {
          var data = [];
          result.data.Rows.forEach(function(item) {
            data.push(item);
          });
          scope.procedures = data;
          resetSources();
        });

      });

      function resetSources(){
        if(scope.types && scope.procedures){
          scope.types.forEach(function(g){
            g.ps = [];
            g.children.forEach(function(c){
              c.ps = [];
              scope.procedures.forEach(function(p){
                if(p.ProcedureTypeId == c.Id){
                  c.ps.push(p);
                  g.ps.push(p);
                  scope.Plength +=1;
                }
              })
            });
          });
        }
      }
    }
  }
})();

