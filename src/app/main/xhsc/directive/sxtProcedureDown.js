/**
 * Created by jiuyuong on 2016/4/12.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .directive('sxtProcedureDown',sxtProcedureDown)
    .directive('sxtProcedureTb',sxtProcedureTb)
    .filter('sxtProcedureS',sxtProcedureS);
  /** @ngInject */
  function sxtProcedureDown(xhUtils){
    return {
      scope:{
        value:'=ngModel'
      },
      template:'<md-menu flex="none">' +
      '<md-button aria-label="展开工序" ng-click="$mdOpenMenu($event)">' +
      '<md-icon md-menu-origin  md-font-icon="icon-menu"></md-icon> {{value.MeasureItemName}}' +
      '</md-button>' +
      '<md-menu-content width="6" >' +
      '<md-tabs md-border-bottom >' +
      '<md-tab ng-repeat="g in types|sxtProcedureS">' +
      '<md-tab-label><span sxt-procedure-tb>{{g.$name}}({{g.ps.length}})</span></md-tab-label>' +
      '<md-tab-body>' +
      '<md-content>' +
      '<section ng-repeat="c in g.children|sxtProcedureS">' +
      '<md-subheader class="md-primary">{{c.$name}}({{c.ps.length}})</md-subheader>\
      <md-list layout-padding>\
      <md-list-item ng-click="sett(p)" ng-repeat="p in c.ps">\
      {{p.MeasureItemName}}\
      </md-list-item>\
      </md-list>\
      </section>\
      </md-content>\
     </md-tab-body>\
      </md-tab>\
      </md-tabs>\
    </md-menu-content>\
    </md-menu>',
      link:link
    }

    function link(scope,element,attrs,ctrl){
      xhUtils.getProcedure(null,function(data){
        scope.types = data;
      });

      scope.sett = function(p){
        scope.value = p;
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
