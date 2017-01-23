/**
 * Created by shaoshun on 2017/1/19.
 */
/**
 * Created by leshuangshuang on 16/4/15.
 */
(function() {
  'use strict';

  angular
    .module('app.inspection')
    .factory('ys_file', ys_file);

  function ys_file($mdDialog, $q,$window,$http) {
     var  file={
       downUniqueFile:downUniqueFile,
       deleteFile:deleteFile,
       getUrl:getUrl
     }

     function deleteFile() {
       $q(function (resolve,reject) {
         if (!window.cordova) {
           resolve();
         }else {
           File.removeFile(window.cordova.file.dataDirectory + '/file/'+uniqueId + '.file');
         }
       });
     }

     function getUrl(uniqueId,src) {
       if(window.cordova && window.cordova.file){
         return window.cordova.file.dataDirectory+'/file/'+uniqueId+'.file'
       }
       else
         return src;
     }


     function downUniqueFile(uniqueId,src) {
        return $q(function (resolve,reject) {
          if(!window.cordova || !window.cordova.file){
            resolve();
          }else {
            const fileTransfer = new Transfer();
            fileTransfer.download(
              src,
              window.cordova.file.dataDirectory + '/file/' + uniqueId + '.file'
            ).then(function () {
              resolve();
            }).catch(function () {
              reject();
            })
          }
        })
     }


     return file;
  }
})();
