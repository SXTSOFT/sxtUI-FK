/**
 * Created by zhangzhaoyong on 16/1/29.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .directive('sxtProcedureType',sxtProcedureTypeDirective)

  /** @ngInject */
  function sxtProcedureTypeDirective(api){

    var joinArr = function (arr) {
      var n = [];
      arr.forEach(function (a) {
        n.push(a[0]);
      })
      return n.join('');
    }
    return {
      scope: {
        value: '=ngModel',
        nameValue: '=',
        objValue: '=',
        change: '&ngChange',
        disabled: '=ngDisabled'
      },
      template: '<md-select ng-model="data.selected">\
      <md-option>全部</md-option>\
      <md-optgroup ng-repeat="gn in data.sources" label="{{gn.name}}">\
      <md-option ng-repeat="item in gn.children" ng-value="item" >{{item.name}}</md-option>\
      </md-optgroup>\
      </md-select>',
      link: function (scope, element, attrs) {
        scope.data = {};
        scope.valueField = 'id';
        scope.textField = 'text';
        scope.gp = function (item) {
          return item.gp;
        }
        var resetValue = function () {
          if (scope.valueField && scope.data.selected && scope.data.selected[scope.valueField] == scope.value) return;
          if (scope.value && scope.data.sources) {

            scope.data.selected = scope.data.sources.find(function (item) {
              return item[scope.valueField] == scope.value;
            });
            scope.value = scope.data.selected ? scope.data.selected[scope.valueField] : null;
            scope.nameValue = scope.data.selected ? scope.data.selected.gp + ' > ' + scope.data.selected[scope.textField] : null;
            scope.objValue = scope.data.selected;
          }
          else if (scope.data.selected) {
            scope.data.selected = null;
            scope.nameValue = null;
            scope.objValue = null;
          }
        }
        scope.$watch('value', function () {
          resetValue();
        });
        scope.$watchCollection('sources', function () {
          if (scope.data.selected) {
            scope.data.selected = null;
            scope.data.sources = null;
          }
          if (scope.sources && scope.sources.length) {
            scope.data.sources = [];
            scope.sources.forEach(function (item) {
              if (typeof item == 'object') {
                item.text = item[scope.textField];
              }
              else {
                scope.valueField = 'value';
                scope.textField = 'text';
                item = { text: '' + item, value: item };
              }
              item.pinyin = joinArr(Pinyin.getPinyinArrayFirst(item.text));
              scope.data.sources.push(item);
            });
          }
          else {

          }
          //console.log(scope.data.sources);
          resetValue();
        });
        scope.$watch('data.selected', function () {
          scope.value = scope.data.selected ? scope.data.selected[scope.valueField] : null;
          scope.nameValue = scope.data.selected ? scope.data.selected.gp + ' > ' + scope.data.selected[scope.textField] : null;
          scope.objValue = scope.data.selected;
        });
        api.szgc.vanke.skills({ page_number: 1, page_size: 0 }).then(function (result) {
          var s = [];
          result.data.data.forEach(function (item) {
            var gn = s.find(function(g){return (item.parent ? item.parent.name : '')== g.name;});
            if(!gn){
              gn = {
                name:item.parent ? item.parent.name : '',
                children:[]
              };
              s.push(gn);
            }
            gn.children.push(item);
          });
          scope.sources = s;
        });
      }
    }
  }
})();
