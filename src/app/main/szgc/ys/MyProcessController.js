/**
 * Created by zhangzhaoyong on 16/2/1.
 */
/**
 * Created by zhangzhaoyong on 16/2/1.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .controller('MyProcessController',MyProcessController);

  /** @ngInject */
  function MyProcessController($scope, api, utils, $state,$q,sxt,xhUtils){

    var vm = this;
    $scope.is = function(route){
      return $state.is(route);
    }
    $scope.delProcess = function(BatchRelationId) {
      utils.confirm(null, '确认删除验收批吗？',
        function() {
          $scope.delmyProcess(BatchRelationId);
        });
    };

    $scope.delmyProcess = function(BatchRelationId) {
      api.szgc.addProcessService.delProcess(BatchRelationId).then(function(result) {

        if (result.status == 200) {
          $scope.project.filter(true);
          utils.alert('删除成功！')
        }
      });
    };




    $scope.isPartner = api.szgc.vanke.isPartner();
    $scope.project = {
      isMore: true,
      states: [{
        id: -1,
        color: '',
        title: '全部',
        selected: true,
      }, {
        id: 0,
        color: 'slategrey',
        title: '未验收',
        selected: true,
        c: 0
      }, {
        id: 1,
        color: 'brown',
        title: '初验不合格',
        selected: true,
        c: 0
      }, {
        id: 2,
        color: 'green',
        title: '初验合格',
        selected: true,
        c: 0
      }, {
        id: 3,
        color: 'red',
        title: '复验不合格',
        selected: true,
        c: 0
      }, {
        id: 4,
        color: 'blue',
        title: '复验合格',
        selected: true,
        c: 0
      }],
      onQueryed: function(data) {
        $scope.project.data = data;
        $scope.project.filter();
      },
      //filterBatch: function (sources) {
      //    console.log('sources', sources);
      //},
      filter: function(reload) {
        if (!$scope.project.procedureId || !$scope.project.data || !$scope.project.data.items) return;
        if (reload === true || ($scope.project.data && !$scope.project.data.fd)) {
          $scope.project.data.fd = true;
          api.szgc.CheckStepService.getAll($scope.project.procedureId, {
            regionIdTree: $scope.project.idTree,
            Status: 4
          }).then(function(result) {
            $scope.project.data.total = $scope.project.data.items.length;
            var checkedCount = 0,
              cmpCount = 0;
            var results = [];

            $scope.project.data.items.forEach(function(item2) {
              var item = null; //results.find(function (k) { return k.RegionId == it.RegionId && k.BatchNo == it.BatchNo });
              if (!item) {
                item = utils.copy(item2);
                item.state = 0;
                item.checkedCount = 0;
                item.Remark = item.BatchRelationId = item.MinPassRatio = item.CheckDate = item.CheckWorkerName = item.BatchNo = null;
                results.push(item);
              }

              result.data.Rows.forEach(function(it) {
                var qd = item;
                if (it.RegionId == qd.$id) {
                  if (!qd.BatchNo)
                    qd.BatchNo = it.BatchNo;
                  else if (qd.BatchNo != it.BatchNo) {
                    qd = results.find(function(k) {
                      return k.$id == it.RegionId && k.BatchNo == it.BatchNo
                    });
                    if (!qd) {
                      qd = utils.copy(item2);
                      qd.BatchRelationId = it.BatchRelationId;
                      qd.BatchNo = it.BatchNo;
                      qd.state = 0;
                      qd.Remark = it.Remark;
                      qd.checkedCount = 0;
                      qd.MinPassRatio = qd.CheckDate = qd.CheckWorkerName = null;
                      results.push(qd);
                    }
                  }
                  if (!it.CheckNo) {

                  } else if (it.CheckNo == 1) {
                    qd.state = it.AllResult ? 2 : 1;
                  } else {
                    qd.state = it.AllResult ? 4 : 3;
                  }


                  if (it.CheckNo)
                    qd.checkedCount++;
                  if (it.RoleId == 'jl') {
                    qd.BatchRelationId = it.BatchRelationId;
                    qd.Remark = it.Remark;
                    qd.MinPassRatio = it.MinPassRatio;
                    qd.CheckDate = it.CheckDate;
                    qd.CheckWorkerName = it.CheckWorkerName;
                  } else if (it.CheckWorkerName) {
                    qd.MinPassRatio1 = it.MinPassRatio;
                    qd.CheckDate1 = it.CheckDate;
                    qd.CheckWorkerName1 = it.CheckWorkerName;
                  }
                }
              });

              //item.


            });

            results.forEach(function(item) {

              if (item.state != 0)
                checkedCount++;
              if (item.state == 2 || item.state == 4)
                cmpCount++;
            });

            $scope.project.data.checkedCount = checkedCount;
            $scope.project.data.cmpCount = cmpCount;
            $scope.project.data.results = results;
            $scope.project.filter();
          });

        } else if ($scope.project.data.items) {
          //仅通过states过虑
          var rows = [];

          $scope.project.states.forEach(function(item) {
            item.c = 0;
          });
          $scope.project.data.results.forEach(function(item) {
            if ($scope.project.states.find(function(it) {
                if (it.id == item.state || it.id == -1) {
                  it.c++;
                  item.color = it.color;
                  item.stateName = it.title;
                }
                return it.selected && it.id == item.state
              })) {
              rows.push(item);
            }
          });
          $scope.project.rows = rows;
        }
      }
    };
    $scope.checkState = function(state) {
      if (state.id == -1) {
        if(state.selected){
          state.selected = false;
          $scope.project.states.forEach(function(item) {
            item.selected = false;
          });
        }else{
          state.selected = true;
          $scope.project.states.forEach(function(item) {
            item.selected = true;
          });
        }
      } else {
        state.selected = !state.selected;
        var newArr1 = angular.copy($scope.project.states);
        var newArr = newArr1.splice(1,$scope.project.states.length-1);
        var i=0;
        newArr.forEach(function(item){
          if(!item.selected){
            i--;
          }else{
            i++;
          }
          if(i == newArr.length){
            $scope.project.states[0].selected = true;
          }else{
            $scope.project.states[0].selected = false;
          }

        })

      }
      $scope.project.filter();
    };
    api.szgc.ProcedureTypeService.getAll({startrowIndex:0,maximumRows:100,Status:5}).then(function(result) {
      $scope.project.procedureTypes = result.data.Rows;
    });
    var pt, ptype;
    var queryProcedures = function() {
      var t = 1;
      if ($scope.project.type) {
        switch ($scope.project.type) {
          case 1:
              t = 2;
            break;
          case 2:
            t = 8;
            break;
          case 8:
            t = 32;
            break;
          case 32:
            t = 64;
            break;
        }
      }
      if (pt == t && $scope.project.procedureTypeId == ptype) return;
      pt = t;
      ptype = $scope.project.procedureTypeId;
      api.szgc.BatchSetService.getAll({status:4,batchType: t}).then(function(result) {
        var data = [];
        result.data.Rows.forEach(function(item) {
          //if ($scope.project.procedureTypeName != item.ProcedureType)
          //$scope.project.ProcedureType = item.ProcedureType;
          if (!$scope.project.procedureTypeId || $scope.project.procedureTypeId == item.ProcedureTypeId) {
            data.push(item);
          }
        });
        $scope.project.procedures = data;
      });
    }

    //$scope.$watch('project.type', queryProcedures);
    //$scope.$watch('project.procedureTypeId', queryProcedures);
    $scope.$watch('project.procedureId', function(a,b) {
      if(a != b){
        if ( !$scope.project.pid) {
          utils.alert("项目不能为空！");
          return;
        }else{
          $scope.project.filter(true);
        }
      }

    });

    //以下离线相关
    api.szgc.vanke.projects().then(function (r) {
      $scope.project.projects = r.data.data;
    });
    var queryOffline = function () {
      return api.szgc.ProjectSettings.offline.query().then(function (result) {
        $scope.project.offlines = result.data;
      });
    }
    queryOffline();
    api.uploadTask(function (cfg,item) {
      return true
    }).then(function (result) {
      //$scope.project.tasks = result.rows;
    });
    $scope.download =function ($event,project,item) {
      item.downloading = true;
      var idTree = project.project_id+'>'+item.project_item_id;
      api.download([
        //项目区域
        function (tasks) {
          return api.szgc.vanke.buildings({
            project_id: item.project_id,
            project_item_id: item.project_item_id,
            page_size: 0,
            page_number: 1
          }).then(function (result) {
            result.data.data.forEach(function (build) {
              tasks.push(function () {
                return api.szgc.vanke.rooms({
                  building_id: build.building_id,
                  page_size: 0,
                  page_number: 1
                });
              })
            });
          });
        },//下载户型
        function (tasks,downFile) {
          return $q(function (resolve,reject) {
            api.szgc.vanke.room_types(item.project_item_id).then(function (result) {
              var tk = [];
              result.data.data.forEach(function (type) {
                tk.push(api.szgc.FilesService.group(item.project_item_id+'-'+type.type_id));
                //5类工序
                [1,2,3,4,5].forEach(function (m) {
                  tasks.push(function () {
                    return api.szgc.ProjectExService.get(item.project_item_id+'-'+type.type_id+'-'+m)
                  });
                });
              });
              //图纸
              $q.all(tk).then(function (rs) {
                var pics = xhUtils.getMapPic(3);
                rs.forEach(function (r) {
                  if(r.data.Files && r.data.Files.length){
                    var f = r.data.Files[0];
                    //f.Url = f.Url.replace('~/','/');
                    pics.forEach(function (tile) {
                      tasks.push(function () {
                        return downFile('map','tile_'+f.Id+'_'+tile+'.jpg',sxt.app.api+'/api/picMap/load/'+tile+'.png?path='+f.Url.replace('/s_','/')+'&size=256');
                      });
                    })
                  }
                });
                resolve();
              }).catch(reject);
            })
          });
        },
        function () {
          return api.szgc.ProjectSettingsSevice.query({treeId:idTree,unitType:1,includeChild:true});
        },
        function () {
          return api.szgc.ProjectSettingsSevice.query({treeId:idTree,unitType:2,includeChild:true});
        },
        function () {
          return api.szgc.ProjectSettingsSevice.query({treeId:idTree,unitType:3,includeChild:true});
        },
        //验收状态
        function () {
          return api.szgc.addProcessService.getBatchRelation({regionIdTree:idTree});
        },
        //检查项目
        function () {
          return api.szgc.CheckStepService.cache(idTree);
        }
      ].concat( //如果原来没有全局基础数据,也要加上
        $scope.project.offlines && $scope.project.offlines.length? []:[
        //专业
        function () {
          return api.szgc.vanke.skills({page_size:0,page_number:1});
        },
        //工序级别关系
        function () {
          return api.szgc.BatchSetService.getAll({status:4,batchType:255})
        },
        //专业分类关系
        function () {
          return api.szgc.ProcedureTypeService.getAll({startrowIndex:0,maximumRows:100,Status:5});
        },
        //工序验收批设置
        function () {
          return api.szgc.ProcedureBathSettingService.query();
        },
        //工序验收表
        function () {
          return api.szgc.TargetService.getAll()
        }]))(function (percent,current,total) {
        item.percent = parseInt(percent *100) +' %';
        item.current = current;
        item.total = total;
      },function () {
        item.downloading = false;
        api.szgc.ProjectSettings.offline.create({
          Id:idTree,
          name:project.name+'>'+item.name,
          project:project,
          item:item
        }).then(function () {
          queryOffline().then(function () {
            utils.alert('下载完成');
          });
        })

      },function () {
        item.downloading = false;
        utils.alert('下载失败');
      },{timeout:20000});
    };
    $scope.upload =function () {
      api.upload(function (cfg,item) {
        if(cfg._id=='s_files' && item && item.Url.indexOf('base64')==-1){
          return false;
        }
        return true;
      },function (percent,current,total) {
        $scope.project.percent = parseInt(percent *100) +' %';
        $scope.project.current = current;
        $scope.project.total = total;
      },function () {
        $scope.project.uploaded = 1;
        api.uploadTask(function () {
          return true
        },null);
        utils.alert('上传完成');
      },function () {
        $scope.project.uploaded = 0;
        utils.alert('上传失败');
      },{
        uploaded:function (cfg,row,result) {
          cfg.db.delete(row._id);
        }
      });
    }
    $scope.deleteItem = function ($event,project,item) {

    }
    $scope.loadProject_items= function (project) {
      if(!project.items){
        return api.szgc.vanke.project_items({
          project_id: project .project_id,
          page_size: 0,
          page_number: 1
        }).then(function (result) {
          project.items = result.data.data;
        });
      }
      else{
        project.items = null;
      }
    }
  }
})();
