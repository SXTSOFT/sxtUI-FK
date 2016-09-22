/**
 * Created by emma on 2016/6/12.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxbdchooseController',gxbdchooseController);

  /**@ngInject*/
  function gxbdchooseController(db,remote,localPack,xhUtils,$rootScope,$scope,pack,utils,stzlServices,$stateParams){
    var vm = this;
    vm.projectId = $stateParams.projectId;
    remote.Project.queryAllBulidings(vm.projectId).then(function(result){
      var mainTitle = result.data.ProjectName;
      result.data[0].Sections.forEach(function(t){
        t.title = (mainTitle||'') + t.SectionName;
      })
      vm.sections = result.data.Sections;
    })
    var xcpk = db('xcpk');
    xcpk.get('xcpk').then(function (result) {
      vm.data = result;
      queryOnline();
    }).catch(function (err) {
      vm.data = {
        _id:'xcpk',
        rows:[]
      };
      queryOnline();
    });
    vm.download = function (item) {
      item.progress = 0;
      item.pack = pack.sc.down(item);
      $rootScope.$on('pack'+item.AssessmentID,function (e,d) {
        //console.log(arguments);
        if(!item.pack)return;
        var p = item.pack.getProgress();
        item.progress = parseInt(p.progress);
        if(item.pack && item.pack.completed){
          var ix = vm.onlines.indexOf(item);
          if(ix!=-1)
            vm.onlines.splice(ix,1);
          ix = vm.offlines.indexOf(item);
          if(ix==-1) {
            vm.offlines.push(item);
            delete item.pack;
            vm.data.rows.push(item);
            xcpk.addOrUpdate(vm.data);
          }
        }
        // console.log('getProgress',  item.progress);

      })
    }
    vm.upload =function (item) {
      var pk = pack.sc.up(item.AssessmentID);
      pk.upload(function (proc) {
        item.progress = proc;
        if(proc==-1) {
          item.completed = pk.completed;
          if(item.completed)
            remote.Assessment.sumReportTotal(item.AssessmentID).then(function(){
              xcpk.addOrUpdate(vm.data);
            })
          else {
            utils.tips('同步未完成');
          }
        }
      });
    }
    vm.delete = function(item,ev){
      utils.confirm('确认删除?',ev,'','').then(function(){
        pack.sc.remove(item.AssessmentID,function () {
          var idx = vm.data.rows.indexOf(item);
          vm.data.rows.splice(idx, 1);
          idx = vm.offlines.indexOf(item);
          vm.offlines.splice(idx, 1);
          xcpk.addOrUpdate(vm.data);
          queryOnline();
        })
      })
    }
    function queryOnline() {
      vm.onlines = [];
      vm.offlines = [];
      vm.data.rows.forEach(function (m) {
        m.progress = 0;
        vm.offlines.push(m);
      });
      remote.Assessment.query().then(function (result) {
        result.data.forEach(function (m) {
          var fd = vm.data.rows.find(function (a) {
            return a.AssessmentID==m.AssessmentID;
          });
          if(fd){

          }
          else{
            vm.onlines.push(m);
          }
        })
      }).catch(function () {

      });
    }
  }
})();
