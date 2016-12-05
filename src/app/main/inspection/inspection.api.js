/**
 * Created by emma on 2016/11/15.
 */
(function(){
  'use strict';

  angular
    .module('app.inspection')
    .config(config);

  /** @anInject */
  function config(apiProvider) {
    var http = apiProvider.$http,
      $q = apiProvider.$q,
      auth;
    var ssl = sxt.requireSSL,
      baseUri = '/estate/v1/',
      host = ssl?'http://szapi2.vanke.com':'http://szmp.vanke.com';
    var $http,$q,auth,api;
    angular.injector(['ng']).invoke([
      '$http','$q',function (_$http,_$q)
      {
        $http = _$http;
        $q = _$q;
      }
    ]);


    apiProvider.register('inspection',{
      deliverys:{
        uri:'/estate/v1/deliverys',
        getLists:function(){
          return $http.get($http.url(this.uri));
        }
      },
      estate:{
        updatedeliverys:function(parm,delivery_id){
          return put(http.url(baseUri+'deliverys/'+delivery_id),parm);
        },
        getdeliverys:function (delivery_id) {
          return get(http.url(baseUri+'deliverys/'+delivery_id));
        },
        issues_tree:function(parm){
          return get(http.url(baseUri+'issues/tree?enabled='+parm.enabled+'&page_size='+parm.page_size+'&page_number='+parm.page_number));
        },
        repair_tasks:function(parm){
          return post(http.url('/estate/v1/repair_tasks',{parm:parm}));
        },
        deleterepair_tasks:function(task_id){
          return del(http.url('/estate/v1/repair_tasks/'+task_id));
        },
        getdeliveryslist:function(parm){
          return get(http.url(baseUri+'team_link_batch/delivery',parm));
        }
      }

    })


    function tk(method, api, arg) {
      return $q(function (resolve, reject) {
        getAuth().getUser().then(function (user) {
          $http({
            method: method,
            url: host + api,
            headers: {
              'Authorization': 'Bearer '+user.Token,
              'Corporation-Id': user.CropId
            },
            data: arg
          }).then(function (r) {
            resolve(r);
          }, function (rejection) {
            if(rejection.status==401){
              //getAuth().logout();
            }
            reject(rejection)
          });
        });
      });
    }
    function get(api,arg){
      return tk('get', api, arg);
    }
    function put(api,arg){
      return tk('put', api, arg);
    }
    function post(api,arg){
      return tk('post', api, arg);
    }

    function del(api,arg){
      return tk('delete', api, arg);
    }

    function getAuth(){
      if(!auth)
        auth = apiProvider.get('auth');
      return auth;
    }
  }
})();
