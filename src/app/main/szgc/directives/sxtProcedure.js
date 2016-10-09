/**
 * Created by zhangzhaoyong on 16/2/18.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .directive('sxtProcedure',sxtProcedure)
    .directive('sxtProcedureTb',sxtProcedureTb)
    .filter('sxtProcedureS',sxtProcedureS)

  /** @ngInject */
  function sxtProcedure(api){
    return {
      require:'ngModel',
      scope:{
        procedureTypeId: '=',
        regionType:'=',
        value:'=ngModel',
        nameValue:'=',
        checkRequirement:'=',
        inc :'@'
      },
      template:'<div layout="row">' +
      '<md-input-container flex md-no-float class="md-block"><label>可选工序({{Plength}})</label><input  ng-model="nameValue" readonly></md-input-container>'+
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
      <md-subheader class="md-primary">{{c.name}}({{c.ps.length}})</md-subheader>\
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
        scope.checkRequirement = p.CheckRequirement;
        ctrl.$setViewValue(scope.value);
      }
      scope.Plength = 0;

      api.szgc.vanke.skills({ page_number: 1, page_size: 0 }).then(function (result) {
        var s = [];
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
        scope.types = s;
        resetSources();
      });
      scope.$watch('regionType',function(){
        scope.value = null;
        scope.nameValue = null;
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

        if (scope.inc) {
          t = 0;
/*          q.isGetChilde=1;
          q.batchTypeList = ex.join(',');
          //q = '&isGetChilde=1&batchTypeList='+ex.join(',')*/
          ex.forEach(function (t1) {
            t = t | t1;
          })
        }
        q.batchType = t;

        api.szgc.BatchSetService.getAll(q).then(function(result) {
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
                if(p.ProcedureTypeId == c.skill_id){
                  c.ps.push(p);
                  g.ps.push(p);
                }
              })
            });
          });
        }
      }
    }
  }

  function sxtProcedureTb(){
    return {
      link:function(scope,element,attrs,ctrl){
        element.parent().attr('md-prevent-menu-close','md-prevent-menu-close');
      }
    }
  }

  function sxtProcedureS(){
    return function (s){
      if(!s)return s;
      var n = [];
      s.forEach(function(a){
        if(a.ps && a.ps.length){
          n.push(a)
        }
      });
      return n;
    }
  }
})();
