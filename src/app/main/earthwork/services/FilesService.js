/**
 * Created by HuangQingFeng on 2016/11/24.
 */

(function() {
  'use strict';

  angular
    .module('app.earthwork')
    .service('FilesService', FilesService);

  /**@ngInject*/
  function FilesService($http,utils,$q){
    return {
      get: function (id) {
        return $http.get('/api/Files/' + id);
      },
      group: function (group) {
        return $http.get('/api/Files?group=' + group);
      },
      delete: function (id) {
        return $http.delete('/api/Files/' + id);
      },
      update: function (file) {
        return $http.put('/api/Files/' + file.Id, file);
      },
      modifyPartion: function (partionId,fileId) {
        return $http.put('/api/Files/' + partionId + '/modifyPartion/?fileId=' + fileId);
      },
      GetPrjFilesByFilter: function (regionId, args) {
        return $http.get(utils.url('/api/Files/' + regionId+'/GetPrjFilesByFilter', args));
      },
      GetGroupLike: function (preGroup) {
        return $http.get(utils.url('/api/Files/GetGroupLike', { preGroup: preGroup }));
      }
    }
  }
})();
