/**
 * Created by emma on 2016/2/25.
 */
(function(){
  'use strict';

  angular.module('app.szgc')
    .service('ProjectExService',ProjectExService);

  function ProjectExService($http, utils){
    return {

      update: function (data) {
        return $http.put('/api/ProjectEx/' + data.ProjectId, data);
      },
      get: function (id) {
        return $http.get('/api/ProjectEx/'+id);
      },
      query: function (status) {
        return $http.get('/api/ProjectEx?status=' + status);
      }
    }
  }
})()
