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
        updatedeliverys:http.db({
          _id:'deliveryModify',
          idField:'delivery_id',
          dataType:1,
          upload:true
        }).bind(function(parm){
          var delivery_id=parm.delivery_id;
          delete parm.delivery_id;
          return  put(http.url(baseUri+'deliverys/'+delivery_id),parm);
        }),
        getdeliverys:http.db({
          _id:'deliveryModify',
          idField:'delivery_id',
          dataType:1,
          filter:function (item,delivery_id) {
            return item.delivery_id==delivery_id;
          }
        }).bind(function(delivery_id){
          return get(http.url(baseUri+'deliverys/'+delivery_id));
        }),
        issues_tree:http.db({
          _id:'issues',
          idField:'type',
          dataType:3
        }).bind(function(parm){
          return get(http.url(baseUri+'issues/tree?type=delivery&enabled='+parm.enabled+'&page_size='+parm.page_size+'&page_number='
            +parm.page_number)).then(function (r) {
              return {
                 data:{
                   type:parm.type,
                   data:r.data.data
                 }
              }
          });
        }),
        getrepair_tasks:function (parm) {
          return get(http.url('/tasks/v1/repair_tasks?page_size='+parm.page_size+'&page_number='+parm.page_number));
        },
        insertrepair_tasks:function(parm){
          return post(http.url(baseUri+'repair_tasks'),parm);
        },
        getrepair_tasksData:function(task_id){
          return get(http.url(baseUri+'repair_tasks/'+task_id));
        },
        deleterepair_tasks:function(task_id){
          return del(http.url(baseUri+'repair_tasks/{task_id}'+task_id));
        },
        getdeliveryslist:http.db({
          _id:'delivery',
          idField:'delivery_id',
          dataType:1
        }).bind(function(parm){
          return get(http.url(baseUri+'team_link_batch/delivery',parm)).then(function (k) {
              return k.data
          });
        }),
        insertImg:http.db({
          _id:'delivery_imgs',
          idField:'recordId',
          dataType:1,
          upload:true
        }).bind(function(parm){
          return post(http.url("/storage/v1/files/base64/picture/upload"),parm);
        }),
        getImgs:http.db({
          _id:'delivery_imgs',
          idField:'recordId',
          dataType:1,
          filter:function (item,recordId) {
            item.recordId==recordId;
          }
        }).bind(),
        deleteImg:http.db({
          _id:'delivery_imgs',
          idField:'recordId',
          dataType:1,
          delete:true
        }).bind()
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
