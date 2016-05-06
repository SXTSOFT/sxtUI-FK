/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('ChooseController',ChooseController);

  /** @ngInject */
  function ChooseController($scope,$stateParams,db,$rootScope,xhUtils){
    var vm=this,
      id = $stateParams.assessmentID;

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
            var room = xhUtils.findRegion([result.data],area.AreaID);
            if(room){
              m1.Regions.push({
                db:id,
                RegionName:room.RegionName,
                areaId:result.data.RegionID,
                regionId:room.RegionID,
                regionType:room.RegionType,
                name:room.fullName,
                acceptanceItemID:m.MeasureItemID,
                pname:m.MeasureItemName
              });
            }
          })

        });
        vm.ms = ms;
      })
    })


  }

})();
