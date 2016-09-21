/**
 * Created by emma on 2016/9/20.
 */
(function(){
  'use strict';

  angular
    .module('app.pcReport_sl')
    .directive('sxtProjectsJd',sxtProjectsJd);

  /**@ngInject*/
  function sxtProjectsJd($timeout, remote, $cookies, $q){
    var cookieName = 'projects';
    return {
      transclude:true,
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
        levels:'@'
      },
      template: '<sxt-select-jd  ng-model="value" is-more="isMore" value-name="regionName" id-tree="idTree" name-tree="nameTree" on-query="onQueryInner" on-change="onChanged" ><div ng-transclude></div></sxt-select-jd>',
      link: function(scope, element, attr, ctrl) {
        scope.onChanged = function(p) {
          if (!p.selectors.length || !p.selectors[0].selected) {
            scope.regionType =
              scope.regionName =
                scope.projectId =
                  scope.projectName = null;
            $cookies.remove(cookieName)
          } else {
            var i = 0,
              c = p.selectors[i],
              ck = [];
            while (c) {
              if (!c.selected) break;
              if (i == 0) {
                scope.projectId = c.selected.$id;
                scope.projectName = c.selected.$name;
              }
              switch (i) {
                case 0:
                  scope.regionType = 1;
                  break;
                case 1:
                  scope.regionType = 2;
                  break;
                case 2:
                  scope.regionType = 8;
                  break;
                case 3:
                  scope.regionType = 32;
                  break;
                case 4:
                  scope.regionType = 64;
                  break;
                // case 5:
                //    scope.regionType = 128;
                //    break;
              }
              ck.push(c.selected);
              c = p.selectors[++i];
              //console.log('scope.regionType',scope.regionType)
            }
            // console.log('ck', JSON.stringify(ck))
            $cookies.put(cookieName, JSON.stringify(ck));
          }
          if (p.selectors.length) {
            scope.onQueryed && scope.onQueryed(p.selectors[p.selectors.length - 1]);
          }

        }
        var init = true;
        var cookie = $cookies.get(cookieName);
        try {
          cookie = cookie ? JSON.parse(cookie) : null;
        } catch (e) {}
        scope.onQueryInner = function (index, st, value, innerScope) {
          if (scope.levels && scope.levels <= index) {
            init = false;
            innerScope && scope.onChanged(innerScope);
            return
          };
          switch (index) {
            case 0:
              if (init && cookie && cookie[index]) {
                return $q(function(r) {
                  r(new st(index, 'ProjectID', 'ProjectName', [cookie[index]], '项目', cookie[index], !!cookie[index+1]))
                });
              } else {
                init = false;
                innerScope && scope.onChanged(innerScope);
                return remote.Project.getMap().then(function (result) {
                  result.data.forEach(function(r){
                    r.RegionID = r.ProjectID;
                    r.RegionName = r.ProjectName;
                  })
                  var s = new st(index, 'RegionID', 'RegionName', result.data, '项目');
                  scope.onQueryed && scope.onQueryed(s);
                  s.letters.length = 0;
                  s.extend = true;
                  return s;
                });
              }
              break;
            case 1:
              if (init && cookie && cookie[index]) {
                return $q(function(r) {
                  r(new st(index, 'RegionID', 'RegionName', [cookie[index]], '分期', cookie[index], !!cookie[index + 1]))
                });
              } else {
                init = false;
                innerScope && scope.onChanged(innerScope);
                return remote.Project.GetAreaChildenbyID(value).then(function(result){
                    var s = new st(index, 'RegionID', 'RegionName', result.data, '分期');
                    scope.onQueryed && scope.onQueryed(s);
                    s.letters.length = 0;
                    s.extend = true;
                    return s;
                })
              }
              break;
            case 2:
              if (init && cookie && cookie[index]) {
                return $q(function(r) {
                  r(new st(index, 'RegionID', 'RegionName', [cookie[index]], '楼栋', cookie[index], !!cookie[index + 1]))
                });
              } else {
                init = false;
                innerScope && scope.onChanged(innerScope);
                return remote.Project.GetAreaChildenbyID(value).then(function(result){
                    var s = new st(index, 'RegionID', 'RegionName', result.data, '楼栋');
                    scope.onQueryed && scope.onQueryed(s);
                    return s;
                })
              }
              break;
            case 3:

              if (init && cookie && cookie[index]) {
                return $q(function(r) {
                  r(new st(index, 'RegionID', 'RegionName', [cookie[index]], '楼层', cookie[index], !!cookie[index + 1]))
                });
              } else {
                init = false;
                innerScope && scope.onChanged(innerScope);
                return remote.Project.GetAreaChildenbyID(value).then(function(result){
                  var s = new st(index, 'RegionID', 'RegionName', result.data, '楼层');
                  scope.onQueryed && scope.onQueryed(s);
                  return s;
                })
              }
              break;
            case 4:
              if (init && cookie && cookie[index]) {
                return $q(function(r) {
                  r(new st(index, 'RegionID', 'RegionName', [cookie[index]], '户', cookie[index], !!cookie[index + 1]))
                });

              } else {
                init = false;
                innerScope && scope.onChanged(innerScope);
                return remote.Project.GetAreaChildenbyID(value).then(function(result){
                  var s = new st(index, 'RegionID', 'RegionName', result.data, '房间');
                  scope.onQueryed && scope.onQueryed(s);
                  return s;
                })

                //var ix = value.indexOf('-');

                //return vkapi.rooms({
                //  page_number: 1,
                //  page_size: 1000,
                //  building_id: value.substring(0,ix),
                //  floor: value.substring(ix+1)
                //}).then(function(result) {
                //  result.data.data.forEach(function (r) {
                //    if (r.unit) {
                //      r.name = r.unit + '-' + r.name;
                //    }
                //  })
                //  var s = new st(index, 'room_id', 'name', result.data.data, '户');
                //  scope.onQueryed && scope.onQueryed(s);
                //  return s;
                //});
              }
              break;
            default:
              init = false;
              innerScope && scope.onChanged(innerScope);
              return scope.onChange ? scope.onQuery(index, st, value) : null;
          }
        }


      }
    }
  }
})();
