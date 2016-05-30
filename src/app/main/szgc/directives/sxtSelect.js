/**
 * Created by zhangzhaoyong on 16/1/29.
 */
(function () {
  'use strict';

  angular
    .module('app.szgc')
    .directive('sxtSelect', sxtSelectDirective);

  /** @ngInject */
  function sxtSelectDirective(){
    var joinArr = function (arr) {
      var n = [];
      arr.forEach(function (a) {
        n.push(a[0]);
      })
      return n.join('');
    }
    return {
      require:'ngModel',
      scope: {
        value: '=ngModel',
        nameValue: '=',
        objValue:'=',
        sources: '=',
        valueField: '@',
        textField: '@',
        change: '&ngChange',
        disabled: '=ngDisabled'
      },
      template: '\
      <md-select  ng-model="data.selected" >\
      <md-option ng-repeat="item in data.sources" ng-value="item">{{item.text}}</md-option>\
      </md-select>',
      link: function (scope, element, attrs, ngModel) {
        var setIng = false;
        scope.data = {};
        var resetValue = function (value) {
          if(!value)return;
          if (scope.valueField && scope.data.selected && scope.data.selected[scope.valueField] == scope.value) return;

          if (scope.value && scope.data.sources) {

            var fd = scope.data.sources.find(function (item) {
              return item[scope.valueField]==scope.value;
            });
            if (fd != scope.data.selected) {
              setIng = !!value;
              scope.data.selected = fd;
            }
            scope.value = scope.data.selected ? scope.data.selected[scope.valueField] : value || null;
            scope.nameValue = scope.data.selected ? scope.data.selected[scope.textField] : scope.objValue? null:scope.nameValue;
            scope.objValue = scope.data.selected;
          }
          else if (scope.data.selected) {
            setIng = !!value;
            scope.data.selected = null;
            scope.nameValue = null;
            scope.objValue = null;
            if (!value)
              ngModel.$setViewValue();
          }

        }

        scope.$watch('value', function () {
          resetValue(scope.value);
        });

        scope.$watchCollection('sources', function () {
          if (!scope.sources) return;


          if (scope.data.selected) {
            setIng = true;
            scope.data.selected = null;
            scope.data.sources = null;
          }
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

          resetValue(scope.value);

        });
        scope.$watch('data.selected', function () {
          if(scope.data.selected)return;
          if (!setIng && scope.sources) {
            var value = scope.data.selected ? scope.data.selected[scope.valueField] : null;
            scope.nameValue = scope.data.selected ? scope.data.selected[scope.textField] : null;
            scope.objValue = scope.data.selected;
            ngModel.$setViewValue(value);
          }
          setIng = false;
        });
      }
    }
  }
})();
