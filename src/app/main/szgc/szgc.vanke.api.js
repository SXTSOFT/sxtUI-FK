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
      'xugt'
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
      str = str.replace('十','10')
        .replace('九', '9')
        .replace('八', '8')
        .replace('七', '7')
        .replace('六', '6')
        .replace('五', '5')
        .replace('四', '4')
        .replace('三', '3')
        .replace('二', '2')
        .replace('一', '1')
        .replace('十一', '11')
        .replace('十二', '12')
        .replace('十三', '13')
        .replace('十四', '14')
        .replace('十五', '15')
        .replace('十六', '16')
        .replace('十七', '17')
        .replace('十八', '18')
        .replace('十九', '19')
        .replace('二十', '20');
      var n = parseInt(/[-]?\d+/.exec(str));
      return n;
    };

    var http = apiProvider.$http;
    apiProvider.register('szgc',{
      vanke:{
        profile:http.db({
          _id:'v_profile',
          idField:'Id',
          dataType:3,
          mode:2,
          raiseError:true,
          filter:function () {
            return true;
          }
        }).bind(function(){
          return get('/common/v1/profile').then(function (result) {
            result.data.Id = result.data.data.employee_id;
            return result;
          });
        },function (result) {
          p1 = null;
          permission = null;
          return result;
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
        _projects: http.db({
          _id:'v__projects',
          idField:'project_id',
          dataType:4
        }).bind(function (arg) {
          arg = angular.extend({
            page_size: 0,
            page_number: 1
          },arg);
          return get(http.url('/common/v1/projects', arg));
        }),
        projects: http.db({
          _id:'v_projects',
          idField:'project_id',
          dataType:4
        }).bind(function (arg) {
          var me = this;
          if (!me.isPartner(1)) {
            return get(http.url('/common/v1/DE/projects', arg));
          }
          else {
            return $q(function (resolve) {
              resolve();
            })
          }
        },
          function (result,cfg,args) {
          var me = this,arg=args[0],root = me.root;
          if(root.getNetwork()==1){
            return $q(function (resolve,reject) {
              var teamIds = getAuth().current().TeamId.split(',');
              var ps = [];
              for (var i = 0; i < teamIds.length; i++) {
                ps.push(me.root.szgc.ProjectSettingsSevice.query({
                  unitId: getAuth().current().Partner,
                  groupId: teamIds[i]
                }));
              }
              $q.all(ps).then(function (results) {
                var result = results[0];
                for (var ix = 1; ix < results.length; ix++) {
                  results[ix].data.Rows.forEach(function (r) {
                    result.data.Rows.push(r);
                  })
                }
                permission = result.data;
                root.szgc.ProjectSettings.offline.query().then(function (result) {
                  var ps = [];
                  result.data.forEach(function (r) {
                    if (!ps.find(function (p) {
                        return p.project_id == r.project.project_id;
                      })) {
                      ps.push(r.project);
                    }
                  });
                  resolve({data: {data: ps}});
                });
              })
            })
          }
          else {
            //console.log('me',me.root);
            if (!me.isPartner(1))return result;
            return $q(function (resolve, reject) {
              if (p1)
                resolve(p1);
              else {
                var teamIds = getAuth().current().TeamId.split(',');
                var ps = [];
                for (var i = 0; i < teamIds.length; i++) {
                  ps.push(me.root.szgc.ProjectSettingsSevice.query({
                    unitId: getAuth().current().Partner,
                    groupId: teamIds[i]
                  }));
                }
                ;
                $q.all(ps).then(function (results) {
                  var result = results[0];
                  for (var ix = 1; ix < results.length; ix++) {
                    results[ix].data.Rows.forEach(function (r) {
                      result.data.Rows.push(r);
                    })
                  }
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
        _filter:function(regionType){
          var me = this;
          return me.root.szgc.ProjectSettings.getAllSatus(regionType);
        },
        project_items: http.db({
          _id:'v_project_items',
          idField:'project_item_id',
          dataType:4,
          filter:function (item,arg) {
            return item.project.project_id == arg.project_id;
          }
        }).bind(function (arg) {
          var s = this;
          return get(http.url('/common/v1/project_items', arg)).then(function (result) {
            return $q(function (resolve,reject) {
                if (!arg._filter) {
              s._filter(2).then(function (r) {
                var arr = [];
                if (r.status == 200 && r.data.Rows) {
                  arr = r.data.Rows;
                }
                if (arr.length > 0) {
                  for (var i = result.data.data.length - 1; i >= 0; i--) {
                    var item = result.data.data[i],
                      st = arr.find(function (it) { return it.RegionId == item.project_item_id; });
                    switch (item.project_item_id) {
                      case "547fc0e7699731702f9cf308":
                        item.name = '三区商务公寓';
                        break;
                      case "547fc0e7699731702f9cf306":
                        item.name = '三区配套';
                        break;
                    }
                    if (st) {
                      if (!st.IsEnable) {
                        result.data.data.splice(i, 1);
                      }
                    }
                  };
                }
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
                var p = permission;
                if (s.isPartner(1) && p) {

                  for (var i = result.data.data.length - 1; i >= 0; i--) {
                    var item = result.data.data[i];
                    var fd = p.Rows.find(function (it) {
                      return it.RegionIdTree.indexOf(item.project_item_id) != -1
                    });
                    if (!fd) {
                      result.data.data.splice(i, 1);
                    }
                  }
                }
                for (var i = result.data.data.length - 1; i >= 0; i--) {
                  var item = result.data.data[i];
                  if (item.project_item_id == '5514f7b471fe65ac066cb09b' || item.project_item_id == '5514f7b471fe65ac066cb09c') {
                    // console.log(item)
                    result.data.data.splice(i, 1);
                  }
                }
                resolve(result);
              })
            }
            else {
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
              var p = permission;
              if (p) {

                for (var i = result.data.data.length - 1; i >= 0; i--) {
                  var item = result.data.data[i];
                  var fd = p.Rows.find(function (it) {
                    return it.RegionIdTree.indexOf(item.project_item_id) != -1
                  });
                  if (!fd) {
                    result.data.data.splice(i, 1);
                  }
                }
              }
              for (var i = result.data.data.length - 1; i >= 0; i--) {
                var item = result.data.data[i];
                if (item.project_item_id == '5514f7b471fe65ac066cb09b' || item.project_item_id == '5514f7b471fe65ac066cb09c') {
                  // console.log(item)
                  result.data.data.splice(i, 1);
                }
              }
                  resolve(result);
            }
          });
            });
        },function (result,cfg,args) {
          var root = this.root;
          if(root.getNetwork()==1){
            return $q(function (resolve,reject) {
              root.szgc.ProjectSettings.offline.query().then(function (result) {
                var ps = [];
                result.data.forEach(function (r) {
                  if (args[0].project_id == r.project.project_id)
                    ps.push(r.item);
                });
                resolve({data:{data:ps}});
              });
            })
          }
          else{
            return result;
          }
        }),
        buildings: http.db({
          _id:'v_buildings',
          idField:'building_id',
          dataType:4,
          filter:function (item,arg) {
            return item.project_item.project_item_id == arg.project_item_id;
          }
        }).bind(function (arg) {
          return get(http.url('/common/v1/buildings', arg));
        },function (result) {
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
        }),
        floors: http.db({
          _id:'v_rooms',
          idField:function (item) {
            return item.building_id
          },
/*          search:function (building_id) {
            return {
              query:building_id,
              fields:['building_id'],
              include_docs:true
            };
          },*/
          dataType:3,
          firstIsId:true
/*          filter:function (item,building_id) {
            return item.building_id==building_id;
          },*/
/*          data:function (item,building_id) {
            item.building_id = building_id;
            return item;
          }*/
        }).bind(function (building_id) {
          return get(http.url('/common/v1/buildings/'+building_id+'/rooms',{page_size:0,page_number:1})).then(function (result) {
            result.data.data.forEach(function (item) {
              item.building_id=building_id;
            })
            return {
              data:{
                building_id:building_id,
                rooms:result.data.data
              }
            };
          });
        },function (result) {
          var floors = [];
          result.data.rooms.forEach(function (room) {
            if(floors.indexOf(room.floor)==-1){
              floors.push(room.floor);
            }
          });
          floors.sort (function (i1, i2) {
            var n1 = getNumName (i1),
              n2 = getNumName (i2);
            if (!isNaN (n1) && !isNaN (n2))
              return n1 - n2;
            else if ((isNaN (n1) && !isNaN (n2)))
              return 1;
            else if ((!isNaN (n1) && isNaN (n2)))
              return -1;
            else
              return i1.localeCompare (i2);
          });
          return {data:{data: floors}};
        }),
        units: http.custom(function (arg) {
          return get(http.url('/common/v1/buildings/' + arg + '/units', arg));
        }),
        _rooms: http.db({
          _id:'v_rooms',
          idField:function (item) {
            return item.building_id
          },
          dataType:3, firstIsId:true//,
/*          filter:function (item,arg,incHide) {
            item.otype = item.type;
            item.type = item.type && item.type.type_id;
            if (incHide !== true) {
              if (item.engineering.status == 'hide') {
                return false;
              }
            }
            return ( !item.building_id || item.building_id==arg.building_id) && item.floor==arg.floor;
          },
          data:function (item,arg,incHide) {
            item.building_id = arg.building_id;
            return item;
          }*/
        })
          .bind(function (building_id,arg,incHide) {
          return get(http.url('/common/v1/buildings/'+arg.building_id+'/rooms', {/*floor:arg.floor, */page_size: 0, page_number: 1})).then(function (result) {
            result.data.data.forEach(function (item) {
              item.building_id=arg.building_id;
            })
            return {
              data:{
                building_id:building_id,
                rooms:result.data.data
              }
            };
          });
        },function (result,cfg,args) {
            var rooms = result.data.rooms.filter(function (item) {
              return (!args[1].floor || item.floor == args[1].floor)
               && (args[2] === true || item.engineering.status != 'hide')
            })
            rooms.sort (function (i1, i2) {
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
          return {
            data:{
              data:rooms
            }
          };
        }),
        room_types: http.db({
          _id:'v_types',
          idField:'type_id',
          dataType:4,
          filter:function (item,project_item_id) {
            return item.project_item.project_item_id==project_item_id;
          }
        }).bind(function (project_item_id) {
          return get(http.url('/common/v1/types', { project_item_id: project_item_id, page_size: 0, page_number:1}));
        }),
        rooms:function (args) {
          return this.root.szgc.vanke._rooms(args.building_id,args);
        },
        partners: http.custom(function (arg) {
          return get(http.url('/common/v1/partners', arg));
        }),
        skills: http.db({
          _id:'v_skills',
          idField:'skill_id',
          dataType:4
        }).bind(function (arg) {
          return get(http.url('/common/v1/skills', arg));
        }),
        employees: http.db({
          _id:'v_employees',
          dataType:4,
          idField:'employee_id',
          filter:function (item,arg) {
            return item.partner.partner_id==arg;
          }
        }).bind(function (arg) {
          return get(http.url('/common/v1/partners/'+arg+'/employees'));
        }),
        teams: http.db({
          _id:'v_partners',
          idField:'team_id',
          dataType:4,
          filter:function (item,partner_id) {
            return item.partner_id==partner_id;
          },
          data:function (item,partner_id) {
            item.partner_id=partner_id;
            return item;
          }
        }).bind(function (partner_id) {
          return get(http.url('/common/v1/partners/' + partner_id + '/teams',angular.extend({
            page_size: 0,
            page_number: 1
          }))).then(function (result) {
            result.data.data.forEach(function (item) {
              item.partner_id = partner_id;
            })
            return result;
          });
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
