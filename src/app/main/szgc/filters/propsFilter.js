/**
 * Created by zhangzhaoyong on 16/1/29.
 */
(function(){
  angular
    .module('app.szgc')
    .filter('propsFilter',propsFilter)
    .filter('exists',exists);
  /** @ngInject */
  function propsFilter(){
    return function(items, props) {
      var out = [];

      if (angular.isArray(items)) {
        items.forEach(function(item) {
          var itemMatches = false;

          var keys = Object.keys(props);
          for (var i = 0; i < keys.length; i++) {
            var prop = keys[i];
            var text = props[prop].toLowerCase();
            if (item[prop] && item[prop].toString().toLowerCase().indexOf(text) !== -1) {
              itemMatches = true;
              break;
            }
          }

          if (itemMatches) {
            out.push(item);
          }
        });
      } else {
        // Let the output be the input untouched
        out = items;
      }

      return out;
    }
  }
  function exists() {
    return function (items,array,flag,prop) {
      var r = [],ex;
      flag = flag===true;
      //console.log('exists',items,array,flag,prop)
      items.forEach(function (item) {
        if(prop){
          ex = array && !!array.find(function (arr) {
            return item[prop] == arr[prop]
          });
        }
        else{
          ex = array && array.indexOf(item)!=-1;
        }
        if(flag && ex){
          r.push(item);
        }
        else if(!flag && !ex){
          r.push(item);
        }
      });
      return r;
    }
  }
})();
