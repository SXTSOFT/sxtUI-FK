/**
 * Created by zhangzhaoyong on 16/1/28.
 */
(function(){
  angular
    .module('app.szgc')
    .config(config)

  /** @ngInject */
  function config(apiProvider){
    var partner = [
      'xugt','v-zhangqy03'
    ],procedureId = '2814510f-0188-4993-a153-559b40d0b5e8';

    var $http,$q,auth,api;
    angular.injector(['ng']).invoke([
      '$http','$q',function (_$http,_$q)
      {
        $http = _$http;
        $q = _$q;
      }
    ]);

    var permission,p1;
    var getNumName = function (str) {
      str = str.replace('十', '10')
        .replace('九', '9')
        .replace('八', '8')
        .replace('七', '7')
        .replace('六', '6')
        .replace('五', '5')
        .replace('四', '4')
        .replace('三', '3')
        .replace('二', '2')
        .replace('一', '1');
      var n = parseInt(/\d+/.exec(str));
      return n;
    };

    var http = apiProvider.$http;
    apiProvider.register('szgc',{
      vanke:{
        profile:http.custom(function(){
          return get('/common/v1/profile');
        }),
        isPartner:http.custom(function(f){
          return (!f && (partner.indexOf(getAuth().current().loginname) != -1)) || getAuth().current().Partner ;
        }),
        getPartner:http.custom( function () {
          return getAuth().current().Partner;
        }),
        getPermissin:http.custom(function () {
          var me = this;
          return $q(function (resolve) {
            if (permission)
              resolve({ data: permission });
            else
              me.projects().then(function () {
                resolve({ data: permission });
              })
          });
        }),
        _projects: http.custom(function (arg) {
          return get(http.url('/common/v1/projects', arg));
        }),
        //getGrpFitRateByFiter: function (prjIds, skillIds, fromDate, toDate) {
        //  return $http.post("/api/Report/GetGrpFitRateByFiter/", { SkillIds: skillIds, FromDate: fromDate, ToDate: toDate, PrjIds: prjIds });
        //},
        projects: http.custom(function (arg) {
          var me = this;
          if (!me.isPartner(1)) {
            return get(http.url('/common/v1/DE/projects', arg));
          }
          else {
            return $q(function (resolve, reject) {
              if (p1)
                resolve(p1);
              else {
                console.log('me',me)
                me.root.szgc.ProjectSettings.query({ unitId: getAuth().current().Partner,groupId: getAuth().current().TeamId }).then(function (result) {
                  permission = result.data;
                  me._projects(arg).then(function (result) {
                    var p = permission;
                    if (p) {
                      for (var i = result.data.data.length - 1; i >= 0; i--) {
                        var item = result.data.data[i];
                        var fd = p.Rows.find(function (it) {
                          return it.RegionIdTree.indexOf(item.project_id) != -1
                        });
                        if (!fd) {
                          result.data.data.splice(i, 1);
                        }
                      }
                    }
                    p1 = result;
                    resolve(p1);
                  });
                });
              }
            });
          }
        }),
        project_items: http.custom(function (arg) {
          return get(http.url('/common/v1/project_items', arg)).then(function (result) {
            var p = permission;
            if (p) {
              if (p.Rows.find(function (it) {
                  return it.RegionIdTree.substring(it.RegionIdTree.length - arg.project_id) == arg.project_id
                })) {

              }
              else {
                for (var i = result.data.data.length - 1; i >= 0; i--) {
                  var item = result.data.data[i];
                  var fd = p.Rows.find(function (it) {
                    return it.RegionIdTree.indexOf(item.project_item_id) != -1
                  });
                  if (!fd) {
                    console.log(item)
                    result.data.data.splice(i, 1);
                  }
                }
              }
            }
            return result;
          });
          return result;
        }),
        buildings: http.custom(function (arg) {
          return get(http.url('/common/v1/buildings', arg)).then(function (result) {
            result.data.data.sort(function (i1, i2) {
              var n1 = getNumName(i1.name),
                n2 = getNumName(i2.name);
              if (!isNaN(n1) && !isNaN(n2))
                return n1 - n2;
              else if ((isNaN(n1) && !isNaN(n2)))
                return 1;
              else if ((!isNaN(n1) && isNaN(n2)))
                return -1;
              else
                return i1.name.localeCompare(i2.name);
            });
            return result;
          })
        }),
        floors: http.custom(function (build_id) {
          return get(http.url('/common/v1/buildings/' + build_id + '/floors'));
        }),
        units: http.custom(function (arg) {
          return get(http.url('/common/v1/buildings/' + arg + '/units', arg));
        }),
        rooms: http.custom(function (arg) {
          return get(http.url('/common/v1/rooms', arg));
        }),
        partners: http.custom(function (arg) {
          return get(http.url('/common/v1/partners', arg));
        }),
        skills: http.custom(function (arg) {
          return get(http.url('/common/v1/skills', arg));
        }),
        employees: http.custom(function (arg) {
          return get(http.url('/common/v1/partners/'+arg+'/employees'));
        }),
        teams: http.custom(function (arg) {
          return get(http.url('/common/v1/partners/' + arg + '/teams'));
        }),
        buildingsInfo:http.custom(function(type, typeId){
          if(type == 2) {
            return get (http.url ('/common/v1/buildings', {
              project_item_id: typeId,
              page_size: 0,
              page_number: 1
            })).then(function(r) {
              r.data.data.forEach (function (b) {
                b.floors = isNaN (parseInt (b.total_floor)) ? 1 : parseInt (b.total_floor);
              });
              r.data.data.sort (function (i1, i2) {
                var n1 = getNumName (i1.name),
                  n2 = getNumName (i2.name);
                if (!isNaN (n1) && !isNaN (n2))
                  return n1 - n2;
                else if ((isNaN (n1) && !isNaN (n2)))
                  return 1;
                else if ((!isNaN (n1) && isNaN (n2)))
                  return -1;
                else
                  return i1.name.localeCompare (i2.name);
              });
              return r;
            });
          }
          else{
            return get (http.url ('/common/v1/buildings', {
              project_id: typeId,
              page_size: 0,
              page_number: 1
            })).then(function(r){
              r.data.data.forEach(function (b) {
                b.floors = isNaN(parseInt(b.total_floor)) ? 1 : parseInt(b.total_floor);
              });
              r.data.data.sort(function (i1, i2) {
                var n1 = getNumName(i1.name),
                  n2 = getNumName(i2.name);
                if (!isNaN(n1) && !isNaN(n2))
                  return n1 - n2;
                else if ((isNaN(n1) && !isNaN(n2)))
                  return 1;
                else if ((!isNaN(n1) && isNaN(n2)))
                  return -1;
                else
                  return i1.name.localeCompare(i2.name);
              });
              return r.data.data;
            });
          }
          //var s = this;
          //return $q(function (resolve,reject) {
          //  if (type == 2) {
          //    s.buildings({
          //      page_number: 1,
          //      page_size: 10000,
          //      project_item_id: typeId
          //    }).then(function (b1) {
          //      var bd = [],bs=[];
          //      b1.data.data.forEach(function (b) {
          //        bs.push(s.floors(b.building_id));
          //        bd.push(b);
          //      });
          //      $q.all(bs).then(function (b1) {
          //        var i = 0;
          //        b1.forEach(function (r) {
          //          bd[i++].floors = r.data.data.length;
          //        });
          //        resolve(bd);
          //      })
          //    })
          //  }
          //  else{
          //    alert('接口未实现');reject('接口未实现');
          //  }
          //});
        })
      }
    });

    function getAuth(){
      if(!auth)
        auth = apiProvider.get('auth');
      return auth;
    }

    function getApi(){
      if(!api)
        api = apiProvider.get('api');
      return api;
    }

    function tk(method, api, arg) {
      return $q(function (resolve, reject) {
        getAuth().getUser().then(function (user) {
          $http({
            method: method,
            url: 'http://szapi.vanke.com' + api,
            headers: {
              'Authorization': 'Bearer '+user.Token,
              'Corporation-Id': user.CropId
            },
            data: arg
          }).then(function (r) {
            resolve(r);
          }, reject);
        });
      });
    }
    function get(api,arg){
      return tk('get', api, arg);
    }
  }
})();
