/**
 * Created by emma on 2016/4/14.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .filter('myFilter',myFilter);

  function myFilter(){
    return function(items,status) {
      var output = [];
      if (!items)return output;
      if (status == -1) {
        items.forEach(function(item){
          if( item.find(function (it) {
              return it.status != -1;
            })){
            output.push(item);
          }
        })
        return output;
      }
      //console.log('a',args)
      items.forEach(function (item) {
        if (
          item.find(function (it) {
            return it.status == status
          })
        ) {
          output.push(item)
        }
      })
      return output;
    }
  }


})();
