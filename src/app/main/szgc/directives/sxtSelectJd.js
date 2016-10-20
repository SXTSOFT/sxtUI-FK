/**
 * Created by zhangzhaoyong on 16/1/28.
 */
(function ()
{
  'use strict';

  angular
    .module('app.szgc')
    .directive('sxtSelectJd', sxtSelectJdDirective);

  /** @ngInject */
  function sxtSelectJdDirective($rootScope,$timeout,$window,$q)
  {
    var joinArr = function (arr) {
      var n = [];
      arr.forEach(function (a) {
        n.push(a[0]);
      })
      return n.join('');
    }
    var newSt = function (index, idField, nameField, items, label, selected) {
      var nt = [], letters = [], filters = [];
      letters.push({ $id: '', selected: true, $name: '所有' });
      items.forEach(function (item) {
        var n = typeof item == 'object' ? item : { $id: item, $name: item };
        item.$id = item[idField];
        item.$name = item[nameField];
        item.$letter = joinArr(Pinyin.getPinyinArrayFirst(item.$name));
        item.$lf = item.$letter.substring(0, 1).toUpperCase();
        var fl = item.$lf;
        if (!letters.find(function (f) { return f.$name == fl; }))
          letters.push({ $id: fl, $name: fl, selected: false });
      });
      letters.sort(function (s1, s2) {
        return s1.$id.localeCompare(s2.$id);
      });
      var filter = function (lt) {
        letters.forEach(function (it) {
          it.selected = false;
        });
        lt.selected = true;
        filters.length = 0;
        items.forEach(function (item) {
          if (lt.$id == '' || item.$lf == lt.$id) {
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
        toggleExtend: function () {
          this.extend = !this.extend;
        },
        toggleMore: function () {
          this.more = !this.more;
        }
      }
    }
    var tr = null;
    return {
      transclude: true,
      scope: {
        value: '=ngModel',
        valueName: '=',
        idTree: '=',
        nameTree: '=',
        onQuery: '=',
        onChange: '=',
        objectScope:'=',
        cache: '@'
      },
      templateUrl: 'app/main/szgc/directives/sxt-projects-jd-app.html',
      link: function (scope, element, attr, ctrl) {
        scope.selectors = [];
        scope.isMore = true;
        tr = null;
        scope.resetUI = function() {
          var ua = $window.navigator.userAgent||'';
          if (tr || ua.indexOf('android')==-1) return;
          if( ua.indexOf('samsung')!=-1 || ua.indexOf('mi')!=-1 ) return;

          tr = $timeout(function () {
            $('md-list-item', element).css('display', 'inline');
            $timeout(function () {
              tr = null;
              $('md-list-item', element).css('display', 'flex');
            }, 0);
          }, 1000);
        }
        var syncValue = function () {
          if (!scope.selectors.length || !scope.selectors[0].selected) {
            scope.value =
              scope.idTree =
                scope.nameTree = null;
          }
          else {
            var i = 0, c = scope.selectors[i], idTree = [], nameTree = [];
            while (c) {
              if (!c.selected) break;
              idTree.push(c.selected.$id);
              nameTree.push(c.selected.$name);
              scope.value = c.selected.$id;
              scope.valueName = c.selected.$name;
              if(scope.objectScope)
                scope.objectScope.item = c.selected;
              c = scope.selectors[++i];

            }

            scope.nameTree = nameTree.join('>');
            scope.idTree = idTree.join('>');
          }
          scope.onChange && scope.onChange(scope);
          if(!$rootScope.$$phase){
            scope.$apply();

          }
          scope.resetUI();
        }
        if(scope.objectScope){
          scope.objectScope.backJdSelect = function(){
            if(scope.selectors.length){
              scope.item_clear(scope.selectors.length-2);
            }
          }
          scope.objectScope.isJdBack = function(){
            return scope.selectors.length && scope.selectors[0].selected;
          }
        }
        scope.toggleMore = function () {
          scope.isMore = !scope.isMore;
        }
        scope.isShow = function (item) {
          return !item.selected && (scope.isMore || item.index < 2);
        }
        scope.item_clear = function (index) {
          scope.selectors.splice(index + 1, scope.selectors.length);
          scope.selectors[index].selected = null;
          syncValue();
          var q = scope.onQuery(index, newSt, scope.selectors.length > 1 ? scope.selectors[index - 1].selected.$id : null,scope);
          if (q) {
            scope.selectors[index] = {
              label:'正在加载',
              items:[{$name:'正在加载'}],
              loading:true
            };
            q.then(function (result) {
              var next = result;
              scope.selectors[index] = next;
              if(!$rootScope.$$phase){
                scope.$apply();

              }
              scope.resetUI();
            });
          }
        };
        scope.$on('$destroy',$rootScope.$on('sxtSelect:setSelected',function (s,e) {
          scope.item_selected(e.item,e.index,e.noSync);
        }));
        scope.item_selected = function (item, index, noSync) {
          if(!item)return;
          if(index==0){
            $rootScope.title = item.$name;
          }
          var cnt = scope.selectors[index];
          cnt.selected = item;
          //var next = scope.selectors[index + 1];
          if (noSync !== false)
            syncValue();

          var q = scope.onQuery(index + 1, newSt, item.$id,scope);
          if (q) {
            scope.selectors[index+1] = {
              label:'正在加载',
              items:[{$name:'正在加载'}],
              loading:true
            };
            q.then(function (result) {
              var next = result;
              scope.selectors[index + 1] = next;

              if (result.selected)
                scope.item_selected(result.selected, scope.selectors.length - 1, false);
              else if (noSync === false)
                syncValue();

              if(!$rootScope.$$phase){
                scope.$apply();

              }
              scope.resetUI();
            });
          }
          else{
            syncValue();
            if(!$rootScope.$$phase){
              scope.$apply();

            }
            scope.resetUI();
          }
        }
        scope.querySearch = function(array, text) {
          var k = [];
          if (array) {
            array.forEach(function (item) {
              if (!text || text == '' || item.$name.indexOf(text) != -1 || item.$letter.indexOf(text) != -1) {
                k.push(item);
              }
            })
          }
          return k;
        }
        $timeout(function () {
          scope.onQuery(0, newSt, scope.value,scope).then(function (result) {
            scope.selectors.push(result);
            if (result.selected)
              scope.item_selected(result.selected, scope.selectors.length - 1, false);
            if(!$rootScope.$$phase){
              scope.$apply();

            }
            scope.resetUI();
          });
        },300);

      }
    }
  }
})();
