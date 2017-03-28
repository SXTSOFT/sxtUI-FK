/**
 * Created by leshuangshuang on 16/8/5.
 */
(function () {
  'use strict';

  angular
    .module('app.material')
    .config(config)
  /** @anInject */
  function config(apiProvider) {
    var $http = apiProvider.$http,
      $q = apiProvider.$q;

    apiProvider.register('material', {
      ProcedureService: {
        getAll: function (args) {
          return $http.get($http.url('/api/PProcedure', args));
        },
        getAppImg: $http.db({
          dataType: 3
        }).bind(function (regionId, produceId, roleid) {
          return $http.get('/api/projects/' + regionId + '/Procedure/' + produceId + '/APPImgs?roleId=' + roleid);
        }),
        deleteAppImg: function (id) {
          return $http.delete('/api/APPImgs/' + id);
        }
      },
      ProcedureTypeService: {
        getAll: $http.db({
          _id: 'Ms_ProcedureType',
          idField: 'Id',
          dataType: 5,
          filter: function (item, args) {
            return item.BatchType == args.batchType;
          }
        }).bind(function (args) {
          return $http.get($http.url('/api/ProcedureType', args));
        })
      },
      addProcessService: {
        queryByProjectAndProdure2: function (projectid, bathParens) {
          return $http.get($http.url('/api/Project/' + projectid + '/baths', bathParens));
        },
        queryByProjectAndProdure3: function (projectid, bathParens) {
          return $http.get($http.url('/api/Project/' + projectid + '/baths1', bathParens));
        },
        delProcess: function (id) {
          return $http.delete($http.url('/api/PPBatchRelation/' + id));
        },
        //根据区域树获取验收批数据
        getBatchRelation: $http.db({
          _id: 'Ms_bathlist',
          idField: 'Id',
          dataType: 5,
          filter: function (item, param) {
            return item.RegionIdTree == param.regionIdTree
              && item.ProcedureId == param.procedureId && (!param.regionId || param.regionId == param.RegionId)
          }
        }).bind(function (parems) {
          return $http.get($http.url('/api/MLBatchRelation/GetBatchRelationAllHistoryList', parems));
        }),
        getCheckStepByBatchId: $http.db({
          dataType: 5
        }).bind(function (batchRelationId, parems) {
          return $http.get($http.url('/api/BatchRelation/' + batchRelationId + '/CheckStep', parems));
        }),
        getAll: function (batchId, parems) {
          return $http.get($http.url('/api/BatchSet/' + batchId + '/PPCheckDataList', parems));
        },
        Insert: $http.db({
          _id: 'Ms_MaterialcheckData',
          idField: 'Id',
          upload: true
        }).bind(function (data) {
          return $http.post($http.url('/api/MLMaterialCheckData/Insert'), data);
        }),
        getAllCheckDataValue: function (batchId, parems) {
          return $http.get($http.url('/api/BatchSet/' + batchId + '/checkDataValues', parems));
        },
        GetBatchsTargetByHistryNo: $http.db({
          _id: 'Ms_batchs_status',
          idField: 'Id',
          dataType: 5,
          filter: function (item, parems) {
            return item.BatchRelationId == parems.BatchRelationId;
          }
        }).bind(function (parems) {
          return $http.get($http.url('/api/PPCheckData/GetBatchsTargetByHistryNo', parems));
        }),
        GetBatchsTargetByHistry: $http.db({
          _id: 'Ms_batchs_status',
          idField: 'Id',
          dataType: 5
        }).bind(function (projectId) {
          return $http.get($http.url('/api/PPCheckData/GetBatchsTargetByHistry', { projectId: projectId }));
        })
      },
      UserStashService: {
        get: $http.db({
          dataType: 3
        }).bind(function (key) {
          return $http.get('/api/UserStash?sKey=' + encodeURIComponent(key));
        }),
        create: function (key, value) {
          return $http.post('/api/UserStash', {
            SKey: key,
            SValue: value
          })
        },
        delete: function (key) {
          return $http.delete('/api/UserStash?sKey=' + encodeURIComponent(key));
        }
      },
      ProcedureBathSettingService: {
        create: function (setting) {
          return $http.post('/api/ProcedureBathSetting', setting);
        },
        delete: function (id) {
          return $http.delete('/api/ProcedureBathSetting/' + id);
        },
        query: $http.db({
          _id: 'Ms_batchsetting',
          idField: 'Id',
          dataType: 5
        }).bind(function () {
          return $http.get('/api/ProcedureBathSetting');
        }),
        get: function (id) {
          return $http.get('/api/ProcedureBathSetting/' + id);
        }
      },
      BatchSetService: {
        getAll: $http.db({
          _id: 'Ms_ProcedureBatchSet',
          idField: function (item) {
            return item.BatchType + '-' + item.ProcedureId
          },
          dataType: 5,
          filter: function (item, args) {
            return (item.BatchType | args.batchType) == item.BatchType;
          }
        }).bind(function (args) {
          return $http.get($http.url('/api/MLProcedureBatchSet', args));
        }, function (result) {
          var n = {
            data: {
              Rows: []
            }
          };
          result.data.Rows.forEach(function (p) {
            if (!n.data.Rows.find(function (p1) {
              return p1.ProcedureId == p.ProcedureId;
            })) {
              n.data.Rows.push(p);
            }
          });
          return n;
        })
      },

      //获取材料类型
      MaterialTypeService: {
        GetProcedureType: $http.db({
          _id: 'Ms_MaterialType',
          idField: 'Id',
          dataType: 5,
        }).bind(function () {
          return $http.get($http.url('/api/MLProcedureType'));
        })
      },

      SupplierService: {
        GetAll: $http.db({
          _id: 'Ms_Supplier',
          idField: 'Id',
          dataType: 5,
        }).bind(function (args) {
          return $http.get($http.url('/api/MLSupplier', args));
        })
      },

      MaterialService: {
        GetAll: $http.db({
          _id: 'Ms_MaterialCheckData',
          idField: 'Id',
          dataType: 5,
        }).bind(function (args) {
          return $http.get($http.url('/api/MLMaterialCheckData', args));
        }),
        GetInfoById: $http.db({
          _id: 'Ms_MaterialCheckDataInfo',
          idField: 'Id',
          filter: function (item, id) {
            return item.Id == id;
          },
          dataType: 5,
        }).bind(function (id) {
          return $http.get($http.url('/api/MLMaterialCheckData/GetInfoById', { Id: id }));
        }),
        GetBrandModels:$http.db({
          _id: 'Ms_BrandModels',
          idField: 'Id',
          dataType: 5,
          filter: function (item, procedureId,supplierId) {
            return item.ProcedureId == procedureId && item.SupplierId == supplierId;
          },
        }).bind(function (args) {
          return $http.get($http.url('/api/MLPProcedure/GetBrandModels', args));
        }),
        GetMLFilesById: $http.db({
          _id: 'Ms_MaterialCheckDataFiles',
          idField: 'MaterialCheckDataId',
          dataType: 5,
          filter: function (item, id) {
            return item.MaterialCheckDataId == id;
          },
        }).bind(function (id) {
          return $http.get($http.url('/api/MLMaterialCheckData/GetMLFilesById', { id: id }));
        }),
        MaterialCount: $http.db({
          dataType: 3
        }).bind(function (key) {
          return $http.get('/api/MLMaterialCheckData/GetMaterialCount');
        }),
        getPartners: $http.db({
          _id: 'Ms_MaterialPartners',
          idField: function (item) {
            return item.UnitId + item.RegionIdTree;
          },
          dataType: 5,
          filter: function (item, regionIdTree) {
            return item.RegionIdTree == regionIdTree;
          },
        }).bind(function (regionIdTree,unitType) {
          return $http.get($http.url('/api/ProjectSetting/GetByTree', { treeId: regionIdTree, unitType: unitType }));
        })
      },

      CheckStepService: {
        getAll: $http.db({
          _id: 'Ms_checkstep',
          idField: 'Id',
          dataType: 5,
          filter: function (item, procedureId, args) {
            return item.ProcedureId == procedureId
              && item.RegionIdTree == args.regionIdTree
          }
        }).bind(function (procedureId, args) {
          return $http.get($http.url('/api/procedure/' + procedureId + '/CheckStep', args));
        }),
        cache: $http.db({
          _id: 's_checkstep',
          idField: 'Id',
          dataType: 5
        }).bind(function (projectId) {
          return $http.get($http.url('/api/procedure/CheckStep', { regionIdTree: projectId }));
        })
      },
      ProcProBatchRelationService: {
        getbyid: $http.db({
          _id: 'Ms_checkstep',
          dataType: 3,
          filter: function (item, id) {
            return item.BatchRelationId == id;
          }
        }).bind(function (id) {
          return $http.get('/api/PPBatchRelation/' + id);
        }, function (result) {
          if (result.data.BatchRelationId) {
          }
          return result;
        }),
        getReport: function (regionTreeId) {
          return $http.post('/api/PPBatchRelation/GetRelationReportData', { regionTreeId: regionTreeId })
        }
      },
      TargetRelationService: {
        create: $http.db({
          _id: 'Ms_MaterialTargetRelation',
          idField: 'Id',
          upload: true
        }).bind(function (data) {
          return $http.post($http.url('/api/MaterialTargetRelation'), data);
        }),
        getByProjectId: $http.db({
          _id: 'Ms_MaterialTargetRelationList',
          idField: 'Id',
          dataType: 5,
          filter: function (item, data) {
            return item.ProjectId == data.projectId && item.MaterialId == data.materialId;
          }
        }).bind(function (args) {
          return $http.get($http.url('/api/MaterialTargetRelation/GetByProjectId', args));
        }),

        getByCheckDataId: $http.db({
          _id: 'Ms_CheckDataTargetRelation',
          idField: 'Id',
          dataType: 5,
          filter: function (item, args) {
            return item.ProjectId == args.projectId && item.MaterialId == args.materialId && item.CheckDataId == args.checkDataId;
          }
        }).bind(function (args) {
          return $http.get($http.url('/api/MaterialTargetRelations/GetSelect', { projectId: args.projectId, materialId: args.materialId, checkDataId: args.checkDataId }));
        })
      },
      TargetService: {
        getAll: $http.db({
          _id: 'Ms_MaterialTargetList',
          idField: 'Id',
          dataType: 5,
          filter: function (item, args) {
            return item.ProcedureId == args;
          }
        }).bind(function (args) {
          return $http.get($http.url('/api/MLPProcedure/' + args + '/MLEngineeringTarget/null'));
        })
      }
    })
  }
})();

