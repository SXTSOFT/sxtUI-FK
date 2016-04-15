/**
 * Created by emma on 2016/4/14.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .filter('myFilter',myFilter);

  function myFilter(){
    return function(items,args){
      var output=[];
      //console.log('a',args)
      args.room.forEach(function(item){
          if(args.status == -1){
            output = args.room;
            return output;
          }else if(item.status == args.status){
            output.push(item)
          }
        })
        return output;
    }
  }


})();
