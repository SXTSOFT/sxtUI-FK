/**
 * Created by shaoshun on 2017/1/5.
 */
/**
 * Created by lss on 2016/9/13.
 */
/**
 * Created by lss on 2016/9/8.
 */
/**
 * Created by emma on 2016/6/7.
 */
(function(){
  'use strict';

  angular
    .module('app.pcReport_sl')
    .controller('scJtController',scJtController);

  /**@ngInject*/
  function scJtController($scope,remote,$mdDialog,$state,$stateParams,$rootScope,$timeout,$window,sxt){
    var vm = this;
    var areadId=$stateParams.areaId;
    remote.report.getJtReport().then(function (d) {
      // vm.source=d.data;
      vm.tilte={
        head:[],
        subHead:[],
        footHead:[],
      }
      var title=d.data&&d.data.Title;
      if (title&&angular.isArray(title)){
        title.forEach(function (o) {
             if (angular.isArray(o.Sections)&&o.Sections.length){
                vm.tilte.head.push({
                  ProjectName: o.ProjectName,
                  secNums:o.Sections.length
                })
               vm.tilte.subHead=vm.tilte.subHead.concat(o.Sections);
               o.Sections.forEach(function (q) {
                 vm.tilte.footHead=vm.tilte.footHead.concat([
                   { id:sxt.uuid(),des: "总包"},
                   { id:sxt.uuid(),des: "监理"},
                   { id:sxt.uuid(),des: "项目部"},
                 ])
               })
             }
          });
      }
      vm.vals=[];
      vm.leftNav=[]
      // vm.
      var body=d.data&&d.data.Result;
      if (angular.isArray(body)){
        body.forEach(function (q) {
           if (angular.isArray(q.Indexs)&&q.Indexs.length>0){
             // var f=[q.sco,q.name];
             vm.leftNav.push(q)
             var f=[];
             f.colSpan=q.Indexs.length;
             vm.vals.push(f);
             q.Indexs.forEach(function (m) {
               var row=[];
               vm.leftNav.push(m)
               // var row=[m.sco,m.name];
               if (angular.isArray(m.val)){
                 m.val.forEach(function (w) {
                   row=row.concat(w);
                 })
              }
               vm.vals.push(row);
             })

           }
        })
      }
      // wrap(vm.source);
      vm.loaded=true;
    });
  }
})();
