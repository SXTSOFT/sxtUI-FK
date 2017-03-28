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
        getDeliverysList:function (parm) {
          return get(http.url(baseUri+'team_link_batch/delivery',parm)).then(function (k) {
            return k.data
          });
        },
        getDeliverysOff:http.db({ //获取本地所有单据
          _id:'deliveryProcessing',
          idField:'delivery_id',
          dataType:1
        }).bind(),

        addOrUpdateDelivery:http.db({ //修改本地单据
          _id:'deliveryProcessing',
          idField:'delivery_id',
          dataType:1,
          upload:true
        }).bind(),

        putDelivery:function (delivery_id,params) {
          return  put(http.url(baseUri+'deliverys/'+delivery_id),params);
        },

        getDelivery:http.db({ //远程加载单据
          _id:'deliveryProcessing',
          idField:'delivery_id',
          dataType:1,
          mode:2,
          filter:function (item,delivery_id) {
            return item.delivery_id==delivery_id;
          }
        }).bind(function (delivery_id) {
          return get(http.url(baseUri+'deliverys/'+delivery_id)).then(function (r) {
            return {
              data:r.data.data
            }
          });
        }),
        getDelivery_off:http.db({ //远程加载单据
          _id:'deliveryProcessing',
          idField:'delivery_id',
          dataType:1,
          filter:function (item,delivery_id) {
            return item.delivery_id==delivery_id;
          }
        }).bind(),
        issues_tree:http.db({
          _id:'issues',
          idField:'type',
          dataType:3,
          mode:2,
          filter:function (arg,item) {
            return item.type==arg.type
          }
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
        getRepair_tasks_off:http.db({
          _id:'tasks',
          idField:'id',
          dataType:1,
          filter:function (item,roomid,id) {
            if (roomid){
              return item.room_id==roomid;
            }else if (id){
              return item.id==id;
            }else {
              return true;
            }
          }
        }).bind(),

        postRepair_tasks_off:http.db({
          _id:'tasks',
          idField:'id',
          dataType:1,
          upload:true
        }).bind(),

        deleteRepair_tasks_off:http.db({
          _id:'tasks',
          idField:'id',
          dataType:1,
          delete:true
        }).bind(),

        postImg:http.db({
          _id:'imgs',
          idField:'id',
          dataType:1,
          // fileField: ['url'],
          upload:true
        }).bind(),

        getImg:http.db({
          _id:'imgs',
          idField:'id',
          // fileField: ['url'],
          dataType:1,
          filter:function (item,id) {
              return item.id==id
          }
        }).bind(),

        removeImg:http.db({
          _id:'imgs',
          idField:'id',
          // fileField: ['url'],
          dataType:1,
          delete:true
          // filter:function (item,id) {
          //   return item.id==id
          // }
        }).bind(),

        getrepair_tasks:function (parm) {
          if(parm.room_id){
            return get(http.url('/tasks/v1/repair_tasks?page_size='+parm.page_size+'&page_number='+parm.page_number+'&room_id='+parm.room_id));
          }else {
            return get(http.url('/tasks/v1/repair_tasks?page_size='+parm.page_size+'&page_number='+parm.page_number));
          }
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


        insertImg:function (parm) {
          return post(http.url("/storage/v1/files/base64/picture/upload"),parm);
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
