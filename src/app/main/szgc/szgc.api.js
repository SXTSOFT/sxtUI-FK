/**
 * Created by zhangzhaoyong on 16/1/28.
 */
(function(){
  'use strict';

  angular

    .module('app.szgc')
    .config(config)
  /** @anInject */
  function config(apiProvider){
    var $http = apiProvider.$http,$q = apiProvider.$q;

    apiProvider.register('szgc',{
      ProjectSettings:{
        query:function(args) {
          return $http.get($http.url('/api/ProjectSetting', args));
        }
      },
      ProcedureService:{
        getAll:function(args){
          return $http.get($http.url('/api/PProcedure', args));
        },
        getAppImg:function(regionId,produceId,roleid){
          return $http.get('/api/projects/' + regionId + '/Procedure/' + produceId + '/APPImgs?roleId=' + roleid);
        },
        getbyid:function (id) {
          return $http.get('/api/PProcedure/' + id);
        },
        update:function (id, data) {
          return $http.put('/api/PProcedure/' + id, data);
        },
        create:function (data) {
          return $http.post('/api/PProcedure', data);
        },
        destroy:function (data) {
          return $http.delete('/api/PProcedure/' + data.Id);
        },
        upfile:function (data) {
          return $http.put('/api/PProcedure/File' + data);
        },
        updateSatus:function (id,status) {
          return $http.put('/api/PProcedure/UpdateStatusByProcedureId?id=' + id + "&status=" + status);
        },
        FilesCount:function(groupId){
          return $http.get('/api/Procedure/FilesCount?groupId=' + groupId);
        },
        deleteAppImg: function(id) {
          return $http.delete('/api/APPImgs/' + id);
        }

    //return {
    //  getAll: getAll,
    //  getbyid: getbyid,
    //  update: update,
    //  create: create,
    //  destroy: destroy,
    //  upfile: upfile,
    //  updateSatus: updateSatus,
    //  FilesCount:FilesCount,
    //  getAppImg: function (regionId, produceId, roleid) {
    //    return $http.get('/api/projects/' + regionId + '/Procedure/' + produceId + '/APPImgs?roleId=' + roleid);
    //  },
    //
    //}
      },
      ProcedureTypeService:{
        getAll:function(args){
          return $http.get($http.url('/api/ProcedureType',args));
        }
      },
      addProcessService:{
        queryByProjectAndProdure2:function(projectid,bathParens){
          return $http.get($http.url('/api/Project/' + projectid + '/baths', bathParens));
        },
        delProcess:function(id){
          return $http.delete('/api/PPBatchRelation/' + id);
        },
        //根据区域树获取验收批数据
        getBatchRelation: function(parems) {
          return $http.get($http.url('/api/BatchRelation/GetBatchRelationAllHistoryList', parems));
        },
        getCheckStepByBatchId: function(batchRelationId, parems) {
          return $http.get($http.url('/api/BatchRelation/' + batchRelationId + '/CheckStep', parems));
        },
        getAll:function(batchId, parems) {
          return $http.get($http.url('/api/BatchSet/' + batchId + '/PPCheckDataList', parems));
        }
      },
      BatchSetService:{
        getAll:function(args){
          return $http.get($http.url('/api/ProcedureBatchSet' , args));
        }
      },
      projectMasterListService:{
        //统计工序填报情况(监理)
        GetBatchCount:function(args){
          return $http.get($http.url('/api/Report/GetBatchCount' , args));
        },
        // 3.统计项目的合格工序，不合格工序情况(项目总览)
        GetCountBatchByProject:function (args){
          return $http.get($http.url('/api/Report/GetCountBatchByProject' , args));
        },
        //1.统计班组工序情况(班组)
        GetCountBatchByGroup:function(args){
          return $http.get($http.url('/api/Report/GetCountBatchByGroup' , args));
        },
        // 2.统计验收批情况表(工序总览)
        GetBatchDetails:function(args) {
          return $http.get($http.url('/api/Report/GetBatchDetails' , args));
        }
      },
      CheckStepService:{
        getAll:function(procedureId,args){
          return $http.get($http.url('/api/procedure/'+procedureId+'/CheckStep' , args));
        }
      },
      ProcProBatchRelationService:{
        getbyid:function(id){
          return $http.get('/api/PPBatchRelation/' + id);
        }
      },
      TargetService:{
        getAll:function(procedureId){
          return $http.get($http.url('/api/PProcedure/' + procedureId + '/EngineeringTarget'));
        }
      },
      ProjectSettingsSevice:{
        query:function(args){
          return $http.get($http.url('/api/ProjectSetting', args));
        }
      },
      FilesService:{
        get: function (id) {
          return $http.get('/api/Files/' + id);
        },
        group: function (group) {
          return $http.get('/api/Files?group=' + group);
        },
        delete: function (id) {
          return $http.delete('/api/Files/' + id);
        },
        update: function (file) {
          return $http.put('/api/Files/' + file.Id, file);
        }
      },
      ReportService:{
        getBuilds:function(projectId){
          var builds=[];
          var api = this.root;
          api.szgc.vanke.project_items({project_id:projectId,page_size:0,page_number:1}).then(function(result){
            var buff=[];
            result.data.data.forEach(function(fq){
             // buff.push(api.szgc.vanke.buildings())
            })
          })
          //console.log('q',apiProvider.$q)
          return $q.$q(function(resolve){
            resolve([
              [50,50,20,10,10,1],//总高度，当前栋最高楼层，第二道工序楼层，第一道工序楼层，起售楼层，栋数
              [50,35,20,10,20,2],
              [50,40,20,10,30,3],
              [50,40,20,10,30,4]
            ]);
          })
        },
        getBuild:function(id){
          return $q.$q(function(resolve){
            resolve({
              'title':'二期工程',
              'data':[50,50,20,10,10,1],
              'start':'2010-10-10',
              'end':'2010-11-11',
              'sale':'2011-01-01'
            });
          })
        }
      },
      ProjectExService:{
        update: function (data) {
          return $http.put('/api/ProjectEx/' + data.ProjectId, data);
        },
        get: function (id) {
          return $http.get('/api/ProjectEx/'+id);
        },
        query: function (status) {
          return $q(function(resolve){
            resolve({data:{"$id":"1","Rows":[{"ProjectId":"52327c423543e88827000009","ProjectNo":"深圳天誉花园","TotalArea":0.00,"BuildArea":0.00,"GreenArea":0.00,"LandUseType":0,"Status":4,"CreatedId":"2eb92951228063e75dcb58bb5ba8b62181339042","CreatedTime":"2016-03-02","ModefiedId":"2eb92951228063e75dcb58bb5ba8b62181339042","ModefiedTime":"2016-03-02","Application":null,"Longitude":"114.244956","Latitude":"22.713167","AreaImage":"3290c2bc-aee3-4ca1-a609-4d93841df16a","AreaRemark":null,"SellLine":null},{"ProjectId":"52327c423debf68027000005","ProjectNo":"深圳公园里","TotalArea":0.00,"BuildArea":0.00,"GreenArea":0.00,"LandUseType":0,"Status":4,"CreatedId":"67c29dbfd4c495732070c9879f57ed31f50d4754","CreatedTime":"2016-02-25","ModefiedId":"4f43c4ea7eaa48a8f01488e4667a78c2109ba993","ModefiedTime":"2016-03-04","Application":null,"Longitude":"114.158272146742","Latitude":"22.6063615015028","AreaImage":"fbb8493f-cfd3-483f-81b3-cd0f8775ccab","AreaRemark":"{\"type\":\"FeatureCollection\",\"features\":[{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"Point\",\"coordinates\":[0.2109375,0.462890625]},\"options\":{\"icon\":{\"options\":{\"className\":\"\",\"shadowUrl\":null,\"iconAnchor\":[15,15],\"iconSize\":[30,30],\"iconUrl\":\"/dp/libs/leaflet/images/photo.png\"},\"_initHooksCalled\":true},\"title\":\"\",\"alt\":\"\",\"clickable\":true,\"draggable\":false,\"keyboard\":true,\"zIndexOffset\":0,\"opacity\":1,\"riseOnHover\":false,\"riseOffset\":250,\"gid\":\"26787027-563d-4bd7-99cf-daf2e4799f9b\"}},{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"Point\",\"coordinates\":[0.662109375,0.3828125]},\"options\":{\"icon\":{\"options\":{\"className\":\"\",\"shadowUrl\":null,\"iconAnchor\":[15,15],\"iconSize\":[30,30],\"iconUrl\":\"/dp/libs/leaflet/images/photo.png\"},\"_initHooksCalled\":true},\"title\":\"\",\"alt\":\"\",\"clickable\":true,\"draggable\":false,\"keyboard\":true,\"zIndexOffset\":0,\"opacity\":1,\"riseOnHover\":false,\"riseOffset\":250,\"gid\":\"15a8c6a6-36e4-4246-a0b5-9f76405513e8\"}},{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"Point\",\"coordinates\":[0.537109375,0.763671875]},\"options\":{\"icon\":{\"options\":{\"className\":\"\",\"shadowUrl\":null,\"iconAnchor\":[15,15],\"iconSize\":[30,30],\"iconUrl\":\"/dp/libs/leaflet/images/photo.png\"},\"_initHooksCalled\":true},\"title\":\"\",\"alt\":\"\",\"clickable\":true,\"draggable\":false,\"keyboard\":true,\"zIndexOffset\":0,\"opacity\":1,\"riseOnHover\":false,\"riseOffset\":250}},{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"Point\",\"coordinates\":[0.390625,0.064453125]},\"options\":{\"icon\":{\"options\":{\"className\":\"\",\"shadowUrl\":null,\"iconAnchor\":[15,15],\"iconSize\":[30,30],\"iconUrl\":\"/dp/libs/leaflet/images/photo.png\"},\"_initHooksCalled\":true},\"title\":\"\",\"alt\":\"\",\"clickable\":true,\"draggable\":false,\"keyboard\":true,\"zIndexOffset\":0,\"opacity\":1,\"riseOnHover\":false,\"riseOffset\":250}},{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"Polygon\",\"coordinates\":[[[0.19921875,0.26953125],[0.203125,0.34375],[0.27734375,0.60546875],[0.494140625,0.6171875],[0.55078125,0.72265625],[0.642578125,0.689453125],[0.666015625,0.693359375],[0.69921875,0.609375],[0.720703125,0.5625],[0.685546875,0.46484375],[0.623046875,0.4765625],[0.62890625,0.4921875],[0.5390625,0.50390625],[0.515625,0.421875],[0.39453125,0.44921875],[0.33984375,0.240234375],[0.19921875,0.26953125]]]},\"options\":{\"stroke\":true,\"color\":\"#ff0000\",\"dashArray\":null,\"lineCap\":null,\"lineJoin\":null,\"weight\":4,\"opacity\":0.5,\"fill\":true,\"fillColor\":null,\"fillOpacity\":0.2,\"clickable\":true,\"smoothFactor\":1,\"noClip\":false,\"icon\":{\"options\":{\"className\":\"\",\"shadowUrl\":null,\"iconAnchor\":[15,15],\"iconSize\":[30,30],\"iconUrl\":\"/dp/libs/leaflet/images/photo.png\"},\"_initHooksCalled\":true},\"title\":\"\",\"alt\":\"\",\"draggable\":false,\"keyboard\":true,\"zIndexOffset\":0,\"riseOnHover\":false,\"riseOffset\":250,\"gid\":\"15a8c6a6-36e4-4246-a0b5-9f76405513e8\",\"itemId\":\"547fc0cb699731702f9cf23e\",\"itemName\":\"三期\"}},{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"Polygon\",\"coordinates\":[[[0.1875,0.111328125],[0.1953125,0.26171875],[0.361328125,0.23046875],[0.37109375,0.2109375],[0.65234375,0.1796875],[0.638671875,0.072265625],[0.1875,0.111328125]]]},\"options\":{\"stroke\":true,\"color\":\"#ff0000\",\"dashArray\":null,\"lineCap\":null,\"lineJoin\":null,\"weight\":4,\"opacity\":0.5,\"fill\":true,\"fillColor\":null,\"fillOpacity\":0.2,\"clickable\":true,\"smoothFactor\":1,\"noClip\":false,\"icon\":{\"options\":{\"className\":\"\",\"shadowUrl\":null,\"iconAnchor\":[15,15],\"iconSize\":[30,30],\"iconUrl\":\"/dp/libs/leaflet/images/photo.png\"},\"_initHooksCalled\":true},\"title\":\"\",\"alt\":\"\",\"draggable\":false,\"keyboard\":true,\"zIndexOffset\":0,\"riseOnHover\":false,\"riseOffset\":250,\"gid\":\"15a8c6a6-36e4-4246-a0b5-9f76405513e8\",\"itemId\":\"547fc0cb699731702f9cf23f\",\"itemName\":\"深圳公园里四期\"}},{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"Polygon\",\"coordinates\":[[[0.501953125,0.220703125],[0.36328125,0.24609375],[0.40625,0.431640625],[0.53125,0.40625],[0.55078125,0.4921875],[0.703125,0.443359375],[0.638671875,0.203125],[0.501953125,0.220703125]]]},\"options\":{\"stroke\":true,\"color\":\"#ff0000\",\"dashArray\":null,\"lineCap\":null,\"lineJoin\":null,\"weight\":4,\"opacity\":0.5,\"fill\":true,\"fillColor\":null,\"fillOpacity\":0.2,\"clickable\":true,\"smoothFactor\":1,\"noClip\":false,\"icon\":{\"options\":{\"className\":\"\",\"shadowUrl\":null,\"iconAnchor\":[15,15],\"iconSize\":[30,30],\"iconUrl\":\"/dp/libs/leaflet/images/photo.png\"},\"_initHooksCalled\":true},\"title\":\"\",\"alt\":\"\",\"draggable\":false,\"keyboard\":true,\"zIndexOffset\":0,\"riseOnHover\":false,\"riseOffset\":250,\"gid\":\"15a8c6a6-36e4-4246-a0b5-9f76405513e8\",\"itemId\":\"547fc0cb699731702f9cf23d\",\"itemName\":\"二期商业\"}},{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"Polygon\",\"coordinates\":[[[0.734375,0.587890625],[0.681640625,0.712890625],[0.5703125,0.73046875],[0.61328125,0.794921875],[0.5625,0.89453125],[0.791015625,0.88671875],[0.810546875,0.80078125],[0.734375,0.587890625]]]},\"options\":{\"stroke\":true,\"color\":\"#ff9800\",\"dashArray\":null,\"lineCap\":null,\"lineJoin\":null,\"weight\":5,\"opacity\":0.5,\"fill\":true,\"fillColor\":null,\"fillOpacity\":0.2,\"clickable\":true,\"smoothFactor\":1,\"noClip\":false,\"icon\":{\"options\":{\"className\":\"\",\"shadowUrl\":null,\"iconAnchor\":[15,15],\"iconSize\":[30,30],\"iconUrl\":\"/dp/libs/leaflet/images/photo.png\"},\"_initHooksCalled\":true},\"title\":\"\",\"alt\":\"\",\"draggable\":false,\"keyboard\":true,\"zIndexOffset\":0,\"riseOnHover\":false,\"riseOffset\":250,\"gid\":\"15a8c6a6-36e4-4246-a0b5-9f76405513e8\",\"itemId\":\"547fc0cb699731702f9cf23d\",\"itemName\":\"二期商业\"}}]}","SellLine":"60%"},{"ProjectId":"52327c423debf68027000008","ProjectNo":"深圳金域中央花园","TotalArea":0.00,"BuildArea":0.00,"GreenArea":0.00,"LandUseType":0,"Status":4,"CreatedId":"2eb92951228063e75dcb58bb5ba8b62181339042","CreatedTime":"2016-03-02","ModefiedId":"2eb92951228063e75dcb58bb5ba8b62181339042","ModefiedTime":"2016-03-02","Application":null,"Longitude":"114.104902","Latitude":"22.62509","AreaImage":"a7183d1c-5b9b-436e-9b06-378c0a0f97bf","AreaRemark":null,"SellLine":null},{"ProjectId":"52ba76043cf7fbe61100001a","ProjectNo":"深圳金域九悦花园","TotalArea":0.00,"BuildArea":0.00,"GreenArea":0.00,"LandUseType":0,"Status":4,"CreatedId":"6349c30f92100ef672b0446d572a366032d6659d","CreatedTime":"2016-03-02","ModefiedId":"6349c30f92100ef672b0446d572a366032d6659d","ModefiedTime":"2016-03-02","Application":null,"Longitude":"114.02071595192","Latitude":"22.7122362517525","AreaImage":"ce6408dc-a9b5-468e-9663-f2c150de461d","AreaRemark":null,"SellLine":null},{"ProjectId":"52ba76053cf7fbe61100001b","ProjectNo":"深圳留仙洞项目","TotalArea":0.00,"BuildArea":0.00,"GreenArea":0.00,"LandUseType":0,"Status":4,"CreatedId":"67c29dbfd4c495732070c9879f57ed31f50d4754","CreatedTime":"2016-02-25","ModefiedId":"44423b4d838783ce6c3ee3d6d643e4f42c2d4468","ModefiedTime":"2016-03-04","Application":null,"Longitude":"113.943564891815","Latitude":"22.5796695520946","AreaImage":"12d5d72c-57e8-4e20-b77f-2dcad87268f2","AreaRemark":"{\"type\":\"FeatureCollection\",\"features\":[{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"Polygon\",\"coordinates\":[[[0.06640625,0.103515625],[0.072265625,0.193359375],[0.1796875,0.166015625],[0.375,0.12890625],[0.359375,0.060546875],[0.06640625,0.087890625],[0.06640625,0.103515625]]]},\"options\":{\"stroke\":true,\"color\":\"#ff0000\",\"dashArray\":null,\"lineCap\":null,\"lineJoin\":null,\"weight\":4,\"opacity\":0.5,\"fill\":true,\"fillColor\":null,\"fillOpacity\":0.2,\"clickable\":true,\"smoothFactor\":1,\"noClip\":false,\"itemId\":\"5514f7b271fe65ac066cb09a\",\"itemName\":\"留仙洞三期（5＃）\"}},{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"Polygon\",\"coordinates\":[[[0.07421875,0.20703125],[0.0703125,0.23828125],[0.12890625,0.4140625],[0.26171875,0.419921875],[0.30859375,0.5078125],[0.3671875,0.46875],[0.408203125,0.384765625],[0.390625,0.32421875],[0.296875,0.34765625],[0.27734375,0.302734375],[0.193359375,0.306640625],[0.166015625,0.1796875],[0.07421875,0.20703125]]]},\"options\":{\"stroke\":true,\"color\":\"#ff0000\",\"dashArray\":null,\"lineCap\":null,\"lineJoin\":null,\"weight\":4,\"opacity\":0.5,\"fill\":true,\"fillColor\":null,\"fillOpacity\":0.2,\"clickable\":true,\"smoothFactor\":1,\"noClip\":false,\"itemId\":\"5514f7b271fe65ac066cb09a\",\"itemName\":\"留仙洞三期（5＃）\"}},{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"Polygon\",\"coordinates\":[[[0.1796875,0.169921875],[0.2109375,0.29296875],[0.28125,0.283203125],[0.30859375,0.33203125],[0.404296875,0.3046875],[0.36328125,0.142578125],[0.1796875,0.169921875]]]},\"options\":{\"stroke\":true,\"color\":\"#ff0000\",\"dashArray\":null,\"lineCap\":null,\"lineJoin\":null,\"weight\":4,\"opacity\":0.5,\"fill\":true,\"fillColor\":null,\"fillOpacity\":0.2,\"clickable\":true,\"smoothFactor\":1,\"noClip\":false,\"itemId\":\"54f90e297e162d0416cdb7a9\",\"itemName\":\"留仙洞一期（3＃）\"}},{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"Point\",\"coordinates\":[0.02734375,0.26171875]},\"options\":{\"icon\":{\"options\":{\"className\":\"\",\"shadowUrl\":null,\"iconAnchor\":[15,15],\"iconSize\":[30,30],\"iconUrl\":\"/dp/libs/leaflet/images/photo.png\"},\"_initHooksCalled\":true},\"title\":\"\",\"alt\":\"\",\"clickable\":true,\"draggable\":false,\"keyboard\":true,\"zIndexOffset\":0,\"opacity\":1,\"riseOnHover\":false,\"riseOffset\":250,\"gid\":\"8f27dfa8-21c9-4e16-88a9-cffc84163b75\"}},{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"Point\",\"coordinates\":[0.19921875,0.05078125]},\"options\":{\"icon\":{\"options\":{\"className\":\"\",\"shadowUrl\":null,\"iconAnchor\":[15,15],\"iconSize\":[30,30],\"iconUrl\":\"/dp/libs/leaflet/images/photo.png\"},\"_initHooksCalled\":true},\"title\":\"\",\"alt\":\"\",\"clickable\":true,\"draggable\":false,\"keyboard\":true,\"zIndexOffset\":0,\"opacity\":1,\"riseOnHover\":false,\"riseOffset\":250}},{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"Point\",\"coordinates\":[0.4296875,0.380859375]},\"options\":{\"icon\":{\"options\":{\"className\":\"\",\"shadowUrl\":null,\"iconAnchor\":[15,15],\"iconSize\":[30,30],\"iconUrl\":\"/dp/libs/leaflet/images/photo.png\"},\"_initHooksCalled\":true},\"title\":\"\",\"alt\":\"\",\"clickable\":true,\"draggable\":false,\"keyboard\":true,\"zIndexOffset\":0,\"opacity\":1,\"riseOnHover\":false,\"riseOffset\":250}},{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"Polygon\",\"coordinates\":[[[0.45703125,0.26171875],[0.435546875,0.296875],[0.48828125,0.36328125],[0.5234375,0.3125],[0.513671875,0.26171875],[0.48046875,0.24609375],[0.45703125,0.26171875]]]},\"options\":{\"stroke\":true,\"color\":\"#ff0000\",\"dashArray\":null,\"lineCap\":null,\"lineJoin\":null,\"weight\":4,\"opacity\":0.5,\"fill\":true,\"fillColor\":null,\"fillOpacity\":0.2,\"clickable\":true,\"smoothFactor\":1,\"noClip\":false}},{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"Point\",\"coordinates\":[0.248046875,0.22265625]},\"options\":{\"icon\":{\"options\":{\"className\":\"\",\"shadowUrl\":null,\"iconAnchor\":[15,15],\"iconSize\":[30,30],\"iconUrl\":\"/dp/libs/leaflet/images/photo.png\"},\"_initHooksCalled\":true},\"title\":\"\",\"alt\":\"\",\"clickable\":true,\"draggable\":false,\"keyboard\":true,\"zIndexOffset\":0,\"opacity\":1,\"riseOnHover\":false,\"riseOffset\":250}},{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"Point\",\"coordinates\":[0.373046875,0.251953125]},\"options\":{\"icon\":{\"options\":{\"className\":\"\",\"shadowUrl\":null,\"iconAnchor\":[15,15],\"iconSize\":[30,30],\"iconUrl\":\"/dp/libs/leaflet/images/photo.png\"},\"_initHooksCalled\":true},\"title\":\"\",\"alt\":\"\",\"clickable\":true,\"draggable\":false,\"keyboard\":true,\"zIndexOffset\":0,\"opacity\":1,\"riseOnHover\":false,\"riseOffset\":250}},{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"Point\",\"coordinates\":[0.482421875,0.29296875]},\"options\":{\"icon\":{\"options\":{\"className\":\"\",\"shadowUrl\":null,\"iconAnchor\":[15,15],\"iconSize\":[30,30],\"iconUrl\":\"/dp/libs/leaflet/images/photo.png\"},\"_initHooksCalled\":true},\"title\":\"\",\"alt\":\"\",\"clickable\":true,\"draggable\":false,\"keyboard\":true,\"zIndexOffset\":0,\"opacity\":1,\"riseOnHover\":false,\"riseOffset\":250}}]}","SellLine":"60%"},{"ProjectId":"5513e1c3493fdce42f42d9b0","ProjectNo":"深圳三馆项目","TotalArea":0.00,"BuildArea":0.00,"GreenArea":0.00,"LandUseType":0,"Status":4,"CreatedId":"2eb92951228063e75dcb58bb5ba8b62181339042","CreatedTime":"2016-03-02","ModefiedId":"2eb92951228063e75dcb58bb5ba8b62181339042","ModefiedTime":"2016-03-02","Application":null,"Longitude":"114.247084","Latitude":"22.718213","AreaImage":"7b1b3845-04c9-4b12-8555-3ce40a304386","AreaRemark":null,"SellLine":null},{"ProjectId":"5513e1c7493fdce42f42d9b1","ProjectNo":"深圳万科时代广场","TotalArea":0.00,"BuildArea":0.00,"GreenArea":0.00,"LandUseType":0,"Status":4,"CreatedId":"e2f0e8396443beab00eaa1f7cb6c2cf7ad8a346a","CreatedTime":"2016-03-02","ModefiedId":"2eb92951228063e75dcb58bb5ba8b62181339042","ModefiedTime":"2016-03-02","Application":null,"Longitude":"114.243665","Latitude":"22.714701","AreaImage":"a13d7f27-f320-40ed-aa43-242075e6c4cf","AreaRemark":null,"SellLine":null}],"Total":7}})
          })
        },
        building: function (projectid) {
          return $http.get('/api/ProjectEx/building?projectid=' + projectid);
        },
        building2: function (projectid) {
          return $http.get('/api/ProjectEx/building2?projectid=' + projectid);
        }
      },
      sxtHouseService:{
        getZ: function (totalW, totalH, m, w, h) {
          var x;
          var y;
          var z;
          z = Math.sqrt((totalH * totalW) / (h * w * m));
          x = Math.ceil(totalW / (z * w));
          y = Math.ceil(totalH / (z * h));
          z = Math.sqrt((totalH * totalW) / (h * x * y * w));
          //console.log('result', x, y, z);
          return {
            x: x,
            y: y,
            z: z
          }
        }
      }
    })
  }
})();
