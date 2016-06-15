/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('ChooseController',ChooseController);

  /** @ngInject */
  function ChooseController($scope,$stateParams,db,$rootScope,xhUtils,remote){
    var vm=this,
      id = $stateParams.assessmentID,
      AssessmentTypeID = $stateParams.AssessmentTypeID,
      projectId = $stateParams.projectId,
      acceptanceItemID=$stateParams.acceptanceItemID,
      acceptanceItemName = $stateParams.acceptanceItemName;
      //vm.data={
      //  acceptanceItemName:acceptanceItemName,
      //  acceptanceItemID:acceptanceItemID
      //}
    $rootScope.title = $stateParams.acceptanceItemName;
    remote.Assessment.queryAllBulidings(projectId).then(function(result){

      result.data.RegionRelations.forEach(function(d){
        d.projectTree = d.RegionName;
        d.Children && d.Children.forEach(function(c){
          c.projectTree = d.projectTree + c.RegionName;
          c.Children && c.Children.forEach(function(r){
            r.projectTree = c.projectTree + r.RegionName;
            r.Children && r.Children.forEach(function(_r){
              _r.projectTree = r.projectTree + _r.RegionName;
            })
          })
        })
      })
      vm.houses = result.data.RegionRelations[0];
      //vm.projectTitle = result.data.ProjectName + result.data.RegionRelations[0].RegionName;
      vm.projectTitle =  result.data.RegionRelations[0].RegionName;
      //console.log(vm.houses)
    })


    vm.chroom = function(r){
      vm.showmyDialog = true;
      vm.data = {
        name: r.projectTree,
        regionId: r.RegionID,
        projectId:projectId,
        acceptanceItemName:acceptanceItemName,
        acceptanceItemID:acceptanceItemID
      }
      //vm.data.name = r.projectTree;
      //vm.data.regionId= r.RegionID;
    }
    vm.zk = function(item){
      item.show = !item.show;
      //$('.roomllist').slideUp()
    }
    var pk = db('xcpk');
    var data = db('pack'+id);
    pk.get('xcpk').then(function (pk) {
      var item = pk.rows.find(function (it) {
        return it.AssessmentID == id;
      });
      data.get('GetRegionTreeInfo').then(function (result) {
        var ms=[];
        item.MeasureItems.forEach(function (m) {
          var m1 = ms.find(function (it) {
            return it.TemplateID==m.TemplateID;
          });
          if(!m1){
            m1 = {
              TemplateID:m.TemplateID,
              TemplateName:m.TemplateName,
              Regions:[]
            };
            ms.push(m1);
          }
          m.AssessmentAreas.forEach(function (area) {
            var room = xhUtils.findRegion([result.data],area.RegionID);
            if(room){
              vm.dmeasureItemID = m.MeasureItemID;
              vm.dmeasureItemName = m.MeasureItemName;
              m1.Regions.push({
                db:id,
                RegionName:room.RegionName,
                areaId:result.data.RegionID,
                regionId:room.RegionID,
                regionType:room.RegionType,
                name:room.fullName,
                measureItemID:m.MeasureItemID,
                pname:m.MeasureItemName,
                assessmentID:item.AssessmentID,
              });
            }
          })

        });
        vm.fq ={
          db:id,
          //areaId:$stateParams.areaID,
          areaId:item.AreaID,
          measureItemID:vm.dmeasureItemID,
          regionId:item.AreaID,
          //RegionName:$stateParams.areaName,
          //regionId:$stateParams.areaID,
          regionType:2,
          RegionName:item.AreaName,
          name:item.AreaName,
          //name:$stateParams.areaName,
          pname:vm.dmeasureItemName,
          assessmentID:item.AssessmentID,
        }
        vm.ms = ms;
       // console.log(ms)
       // console.log('item',vm.fq)
      })
    })


  }

})();
