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
                me.root.szgc.ProjectSettings.query({ unitId: getAuth().current().Partner }).then(function (result) {
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
