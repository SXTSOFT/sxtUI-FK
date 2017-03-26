/**
 * Created by jiuyuong on 2016/5/10.
 */
(function () {
  'use strict';

  angular
    .module('app.xhsc')
    .factory('delopy', delopy);
  /** @ngInject */
  function delopy($q,$rootScope) {

    var result={};

    function _check(fn) {
      return $q(function (resolve,reject) {
        if(typeof IonicDeploy === 'undefined') {
          reject();
        }else {
          fn().then(function (r) {
            resolve(r);
          }).catch(function (err) {
            reject(err);
          })

        }
      })
    }

    return {
      init: function () {
        return _check(function () {
          return $q(function (resolve, reject) {
            IonicDeploy.init(sxt.identity,sxt.update,function () {
              resolve();
            },function () {
              reject();
            })
          })
        })
      },
      redirect:function(){
        return $q(function (resolve,reject) {
          IonicDeploy.redirect(sxt.identity,function () {
            resolve();
          },function () {
            reject();
          })
        })
      },
      check:function () {
        var self = this;
        result.checking = true;
        result.stateNumber = 0;
        result.state = '正在检查';
        result.progress = '0';
        result.complete = false;
        self.sendEvent();
        return _check(function () {
          return $q(function (resolve, reject) {
            IonicDeploy.check(sxt.identity,"dev",function (r) {
              resolve(r);
            },function () {
              reject();
            })
          })
        })
      },
      toVersion:function (version,p) {
        var vs = version.split('.'),vs1=[];
        var i = 0;
        vs1.push('1');
        while(i<p){
          var vt = '000'+(vs[i]||'');
          vs1.push(vt.substring(vt.length-3,vt.length));
          i++;
        }
        return parseInt(vs1.join(''));
      },
      install:function () {
        return _check(function () {
          return $q(function (resolve,reject) {
            IonicDeploy.install(sxt.identity,function (r) {
              resolve(r);
            },function (err) {
              reject(err)
          });
          })
        })
      },
      download:function () {
        var self = this;
        result.state = '正在下载';
        result.stateNumber = 1;
        result.progress = '0';
        self.sendEvent();

        return _check(function () {
          return $q(function (resolve,reject) {
            result.beigingg=true;
            //$rootScope.$broadcast('updateVison:begion');
            IonicDeploy.download(sxt.identity,function (s) {
              if(s!=='true' && s!=='false'){
                result.progress = s;
                self.sendEvent();
                //$rootScope.$broadcast('updateVison:progress', result);
                //$rootScope.$broadcast('updateVison:progress', s);
              }
              else {
                if (s==='true'){
                  resolve(s);
                }else {
                  result.beigingg=false;
                  reject(s);
                }
              }
            },function (err) {
              result.beigingg=false;
              reject(err)
            });
          })
        })
      },
      extract:function () {
        var self = this;
        result.state = '正在解压';
        result.stateNumber = 2;
        result.progress = '0';

        return $q(function (resolve,reject) {

          //$rootScope.$broadcast('extract:begion');
          IonicDeploy.extract(sxt.identity,
            function(s){
              if(s!=='done') {
                result.progress = s;
                self.sendEvent();
                //$rootScope.$broadcast('updateVison:progress', result);
              }
              else {
                resolve();
              }
            },function () {
              result.state = '解压失败';
              result.complete = true;
              result.beigingg=false;
              self.sendEvent();
              //$rootScope.$broadcast('updateVison:progress', result);
              reject();
            })
        })

      },
      sendEvent:function(){
        $rootScope.$broadcast('updateVison:progress', result);
      },
      update:function (confirm) {
        var self=this;
        return $q(function (resolve,reject) {
          if (result.checking){
            //reject('checking');
            var fn = $rootScope.$on('updateVison:progress', function (e,r) {
              if(!result.checking) {
                resolve();
                fn();
              }
            });
            return;
          }


          self.check().then(function (r0) {
            if(self.toVersion(r0,2)>self.toVersion(sxt.version,2)){
              result.checking =false;
              confirm && confirm(self,r0,sxt.version,true).then(function(){
                result.state = '等待安装';
                result.stateNumber = 3;
                result.complete = false;
                result.progress = '100';
                self.sendEvent();
                self.install().then(function () {
                  resolve(Object.assign({},result));
                  result.complete = true;
                }).catch(function () {
                  result.beigingg=false;
                });
              },function () {
              });
            }
            else if(self.toVersion(r0,4)>self.toVersion(sxt.version,4)){
              result.checking =false;
              confirm && confirm(self,r0,sxt.version).then(function () {
                result.checking = true;
                self.download().then(function () {
                  self.extract().then(function () {
                    result.complete = true;
                    result.beigingg=false;
                    result.checking =false;
                    self.sendEvent();
                    //$rootScope.$broadcast('updateVison:progress', result);
                    //$rootScope.$broadcast('extract:over', "版本有更新，请重启!");
                  }).catch(function () {
                    result.beigingg=false;
                    result.checking =false;
                    self.sendEvent();
                  })
                })
              })
            }
          }).catch(function () {
            result.state = '检查失败';
            result.complete = true;
            result.beigingg=false;
            result.checking =false;
            self.sendEvent();
            reject(result)
          })
        })
      }
    }
  }

})();
/**
 * Created by shaoshunliu on 2017/3/25.
 */
