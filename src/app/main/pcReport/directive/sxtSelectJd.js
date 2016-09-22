/**
 * Created by emma on 2016/9/20.
 */
(function(){
  'use strict';

  angular
    .module('app.pcReport_sl')
    .directive('sxtSelectJd', function (utils, $rootScope) {
      var joinArr = function(arr) {
        var n = [];
        arr.forEach(function(a) {
          n.push(a[0]);
        })
        return n.join('');
      }
      var newSt = function (index, idField, nameField, items, label, selected, noSync) {
        var nt = [],
          letters = [],
          filters = [];
        letters.push({
          $id: '',
          selected: true,
          $name: '所有'
        })
        items.forEach(function(item) {
          var n = typeof item == 'object' ? item : {
            $id: item,
            $name: item
          };
          item.$id = item[idField];
          item.$name = item[nameField];
          item.$letter = joinArr(Pinyin.getPinyinArrayFirst(item.$name));
          item.$lf = item.$letter.substring(0, 1).toUpperCase();
          var fl = item.$lf;
          if (!letters.find(function(f) {
              return f.$name == fl;
            }))
            letters.push({
              $id: fl,
              $name: fl,
              selected: false
            });
        });
        letters.sort(function(s1, s2) {
          return s1.$id.localeCompare(s2.$id);
        });
        var filter = function(lt,all) {
          letters.forEach(function(it) {
            it.selected = false;
          });
          lt.selected = true;
          filters.length = 0;
          items.forEach(function(item) {
            if ((lt.$id == '' || item.$lf == lt.$id) && (all || index != 0 || filters.length < 5)) {
              filters.push(item);
            }
          });
        }
        filter(letters[0]);
        return {
          label: label,
          index: index,
          letters: letters,
          items: items,
          filters: filters,
          filter: filter,
          extend: false,
          more: false,
          selected: selected,
          noSync:noSync,
          keyChanged:function(){
            var s = this;
            letters.forEach(function (it) {
              it.selected = false;
            });
            filters.length = 0;
            items.forEach(function (item) {
              if ((!s.key || (item._ix = item.$letter.indexOf(s.key)) != -1) &&(index!=0 || filters.length < 5)) {
                filters.push(item);
              }
            });
            filters.sort(function (a, b) {
              return (a._ix || 0) - (b._ix || 0);
            })
          },
          toggleExtend: function() {
            this.extend = !this.extend;
          },
          toggleMore: function() {
            this.more = !this.more;
          }
        }
      }
      return {
        transclude: true,
        scope: {
          value: '=ngModel',
          valueName: '=',
          idTree: '=',
          nameTree: '=',
          onQuery: '=',
          onChange: '=',
          isMore: '=',
          cache: '@'
        },
        templateUrl:'app/main/pcReport/directive/sxt-select.html',
        link: function(scope, element, attr, ctrl) {
          scope.selectors = [];
          scope.isMore = true;
          var syncValue = function () {
            if (!scope.selectors.length || !scope.selectors[0].selected) {
              scope.value =
                scope.idTree =
                  scope.nameTree = null;
            } else {
              var i = 0,
                c = scope.selectors[i],
                idTree = [],
                nameTree = [];
              while (c) {
                if (!c.selected) break;
                idTree.push(c.selected.$id);
                nameTree.push(c.selected.$name);
                scope.value = c.selected.$id;
                scope.valueName = c.selected.$name;
                c = scope.selectors[++i];
              }
              scope.idTree = idTree.join('>');
              scope.nameTree = nameTree.join('>');
            }
            scope.onChange && scope.onChange(scope);
          }

          scope.toggleMore = function() {
            scope.isMore = !scope.isMore;
          }
          scope.isShow = function(item) {
            return !item.selected && (scope.isMore || item.index < 1);
          }
          scope.item_clear = function (index) {
            scope.selectors.splice(index + 1, scope.selectors.length);
            scope.selectors[index].selected = null;
            syncValue();
            var q = scope.onQuery(index, newSt, scope.selectors.length > 1 ? scope.selectors[index - 1].selected.$id : null, scope);
            if (q) {
              q.then(function(result) {
                var next = result;
                scope.selectors[index] = next;
                if (!$rootScope.$$phase) {
                  scope.$apply();
                }
              });
            } else {

            }
          };
          scope.item_back = function (index) {
            var i = 0;
            var arr = [];
            for(var i=0;i<scope.selectors.length;i++){
              if (scope.selectors[i].selected != undefined)
              { arr.push(scope.selectors[i].index); }
            }
            var iLen = arr.length-1;

            scope.selectors.splice(iLen + 1, scope.selectors.length);
            scope.selectors[iLen].selected = null;
            syncValue();
            var q = scope.onQuery(iLen, newSt, scope.selectors.length > 1 ? scope.selectors[iLen - 1].selected.$id : null,scope);
            if (q) {
              q.then(function (result) {
                var next = result;
                scope.selectors[iLen] = next;
              });
            }


          };
          scope.item_selected = function(item, index, noSync) {
            var cnt = scope.selectors[index];
            cnt.selected = item;
            var next = scope.selectors[index + 1];
            if (noSync !== false)
              syncValue();

            var q = scope.onQuery(index + 1, newSt, item.$id,scope);
            if (q) {
              q.then(function(result) {
                next = result;
                scope.selectors[index + 1] = next;
                if (result.selected)
                  scope.item_selected(result.selected, scope.selectors.length - 1, false);
                if (result.noSync===false || noSync === false)
                  syncValue();

                if (!$rootScope.$$phase) {
                  scope.$apply();
                }
              });
            }
          }
          scope.onQuery(0, newSt, scope.value,scope).then(function(result) {
            scope.selectors.push(result);
            if (result.selected)
              scope.item_selected(result.selected, scope.selectors.length - 1, false);
          });
        }
      }
    })
})();
