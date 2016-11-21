/**
 * Created by jiuyuong on 2016/8/13.
 */
(function () {
  'use strict';
  angular
    .module('app.core')
    .factory('require',require);
  /** @inject */
  function require($window,pbf,gzip) {
    var ef = {};
    ef.read = function (pbf, end) {
      var buff = {
      }
      pbf.readFields(ef._readField, buff, end);
      return buff;
    };
    ef._readField = function (tag, obj, pbf) {
      if (tag === 1) obj.id = pbf.readVarint();
      else if (tag === 2) obj.js = pbf.readBytes();
    };
    return function (url,cb) {
      if(ef[url]){
        cb && cb();
      }
      else{
        ef[url] = url;
        pbf.load(url).then(function (data) {
          var d = ef.read(data),
            js = pbf.buffer(gzip.unzip(d.js)).toString('UTF-8');
          $window.eval(js);
          cb && cb();
        })
      }
    }
  }
})();
