/**
 * Created by zhangzhaoyong on 16/1/28.
 */
(function ()
{
  'use strict';

  angular
    .module('app.szgc')
    .directive('sxtProjectsJd', sxtProjectsJdDirective);

  /** @ngInject */
  function sxtProjectsJdDirective($timeout, api,  $q)
  {
    var $cookies = {
      c:{},
      put:function(name,value){
        this.c[name] = value;
      },
      remove:function(name){
        delete this.c[name];
      },
      get:function(name){
        return this.c[name];
      }
    };
    var cookieName = 'projects';
    return {
      transclude: true,
      scope: {
        value: '=ngModel',
        regionType: '=',
        regionName: '=',
        projectId: '=',
        projectName: '=',
        idTree: '=',
        nameTree: '=',
        onQuery: '=',
        onQueryed: '=',
        isMore: '=',
        objectScope:'='
      },
      template: '<sxt-select-jd  ng-model="value" is-more="isMore" object-scope="objectScope" value-name="regionName" id-tree="idTree" name-tree="nameTree" on-query="onQueryInner" on-change="onChanged" ><div ng-transclude></div></sxt-select-jd>',
      link: function (scope, element, attr, ctrl) {
        scope.onChanged = function (p) {
          if (!p.selectors.length || !p.selectors[0].selected) {
            scope.regionType =
              scope.regionName =
                scope.projectId =
                  scope.projectName = null;
            $cookies.remove(cookieName)
          }
          else {
            var i = 0, c = p.selectors[i], ck = [];
            while (c) {
              if (!c.selected) break;
              if (i == 0) {
                scope.projectId = c.selected.$id;
                scope.projectName = c.selected.$name;
              }
              switch (i) {
                case 0: scope.regionType = 1; break;
                case 1: scope.regionType = 2; break;
                case 2: scope.regionType = 8; break;
                case 3: scope.regionType = 32; break;
                case 4: scope.regionType = 64; break;
              }
              ck.push(c.selected);
              c = p.selectors[++i];
              //console.log('scope.regionType',scope.regionType)
            }
            $cookies.put(cookieName, JSON.stringify(ck));
          }
          if (p.selectors.length)
            scope.onQueryed && scope.onQueryed(p.selectors[p.selectors.length - 1]);
        }
        var init = true, cookie = $cookies.get(cookieName);
        try {
          cookie = cookie ? JSON.parse(cookie) : null;
        } catch (e) { }
        //console.log('getcookie',cookie);
        scope.onQueryInner = function (index, st, value) {
          switch (index) {
            case 0:

              if (init && cookie && cookie[index]) {
                return $q(function (r) { r(new st(index, 'project_id', 'name', [cookie[index]], '项目', cookie[index])) });
              }
              else {
                init = false;
                return api.szgc.vanke.projects({ page_size: 1000, page_number: 1 }).then(function (result) {
                  var s = new st(index, 'project_id', 'name', result.data.data, '项目');
                  scope.onQueryed && scope.onQueryed(s);
                  return s;
                });
              }
              break;
            case 1:
              if (init && cookie && cookie[index]) {
                return $q(function (r) { r(new st(index, 'project_item_id', 'name', [cookie[index]], '分期', cookie[index])) });
              }
              else {
                init = false;
                return api.szgc.vanke.project_items({ page_number: 1, page_size: 10, project_id: value }).then(function (result) {
                  var s = new st(index, 'project_item_id', 'name', result.data.data, '分期');
                  scope.onQueryed && scope.onQueryed(s);
                  return s;
                });
              }
              break;
            case 2:

              if (init && cookie && cookie[index]) {
                return $q(function (r) { r(new st(index, 'building_id', 'name', [cookie[index]], '楼栋', cookie[index])) });
              }
              else {
                init = false;
                return api.szgc.vanke.buildings({ page_number: 1, page_size: 10, project_item_id: value }).then(function (result) {
                  //scope.onQueryed && scope.onQueryed(result.data);
                  var s = new st(index, 'building_id', 'name', result.data.data, '楼栋');
                  scope.onQueryed && scope.onQueryed(s);
                  return s;
                });
              }
              break;
            case 3:

              if (init && cookie && cookie[index]) {
                return $q(function (r) { r(new st(index, 'floor_id', 'name', [cookie[index]], '楼层', cookie[index])) });
              }
              else {
                init = false;
                return api.szgc.vanke.floors(value).then(function (result) {
                  scope.onQueryed && scope.onQueryed(result.data);
                  var data = [];
                  result.data.data.forEach(function (item) {
                    if (item == '')
                      return;
                    data.push({ 'floor_id': value + '-' + item, name: item + '层' });
                  });
                  var s = new st(index, 'floor_id', 'name', data, '楼层');
                  scope.onQueryed && scope.onQueryed(s);
                  return s;
                });
              }
              break;
            case 4:
              if (init && cookie && cookie[index]) {
                return $q(function (r) { r(new st(index, 'room_id', 'name', [cookie[index]], '户', cookie[index])) });
              }
              else {
                init = false;
                return api.szgc.vanke.rooms({ page_number: 1, page_size: 1000, building_id: value.split('-')[0], floor: value.split('-')[1] }).then(function (result) {
                  //scope.onQueryed && scope.onQueryed(result.data);
                  var s = new st(index, 'room_id', 'name', result.data.data, '户');
                  scope.onQueryed && scope.onQueryed(s);
                  return s;
                });
              }
              break;
            default:
              return scope.onChange ? scope.onQuery(index, st, value) : null;
          }
        }


      }
    }
  }
})();
