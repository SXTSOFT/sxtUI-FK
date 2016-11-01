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
  function MyProcessController($scope, api, utils, $state,$q,sxt,xhUtils,$timeout,$window,$mdSidenav,appCookie,$rootScope){

    var vm = this;
    $scope.isPartner = api.szgc.vanke.isPartner();
    vm.hasMaterial = !api.szgc.vanke.isPartner()||api.szgc.vanke.getRoleId()=='jl';

    $scope.is = function(route){
      return $state.is(route);
    };

    $scope.getImgURl = function (img) {
      if(img != null)
        return sxt.app.api + img.substring(1);
    };

    $scope.getNetwork = function () {
      return api.getNetwork();
    };

    vm.setYJ = function (f) {
      var yj = $scope.project.data && $scope.project.data.items && $scope.project.data.items.find(function (it) {
          return it.type === f;
        });
      $rootScope.$emit('sxtSelect:setSelected',{item:yj,index:$scope.project.data.index});
      vm.closeNav('nav_region');
    }
    vm.yjButton = function (f) {
      return $scope.project.type!==f && $scope.project.data && $scope.project.data.items && $scope.project.data.items.find(function (it) {
          return it.type === f;
        })
    }
    //获取所有材料验收信息
    vm.load = function () {
      api.material.MaterialService.GetAll().then(function(result){
        $scope.mlCheckData = result.data.Rows;
      });
    };


    $scope.goMaterialDetail = function (id) {
      $state.go('app.szgc.ys.detail',{id:id});
    };


    $scope.roleId = api.szgc.vanke.getRoleId();
    $scope.project = {
      roleId:$scope.roleId,
      isPartner:$scope.isPartner,
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
        //$scope.project.filter();
      },
      //filterBatch: function (sources) {
      //    console.log('sources', sources);
      //},
      filter: function(reload) {
        vm.loading = true;
        if (!$scope.project.procedureId || !$scope.project.data || !$scope.project.data.items) return;
        if (reload === true || ($scope.project.data && !$scope.project.data.fd)) {
          $scope.project.data.fd = true;
          api.szgc.addProcessService.getBatchRelation({
            procedureId: $scope.project.procedureId,
            regionIdTree: $scope.project.idTree,
            Status: 4
          }).then(function (result) {
            $scope.project.data.total = $scope.project.data.items.length;
            if ($scope.project.type === 128) {
              if (result.data.Rows) {
                result.data.Rows.forEach(function (item) {
                  var state = $scope.project.states.find(function (it) {
                    return it.id == item.ECCheckResult
                  });
                  if (state) {
                    state.c++;
                    item.color = state.color;
                    item.stateName = state.title + ((item.ECCheckResult == 1 || item.ECCheckResult == 3) && item.MinPassRatio && item.MinPassRatio >= 80 ? '(偏差)' : '');
                  }
                  item.hasTask = $scope.hasTasks(item);
                })
                $scope.project.data.items.forEach(function (item) {
                  item.batchs = result.data.Rows.filter(function (it) {
                    return it.RegionId == item.$id;
                  });
                });
              }
              vm.loading = false;
            }
            else {
              var checkedCount = 0,
                cmpCount = 0;
              var results = [];

              $scope.project.data.items.forEach(function (item2) {
                var item = null; //results.find(function (k) { return k.RegionId == it.RegionId && k.BatchNo == it.BatchNo });
                if (!item) {
                  item = utils.copy(item2);
                  item.state = 0;
                  item.checkedCount = 0;
                  item.Remark = item.BatchRelationId = item.MinPassRatio = item.CheckDate = item.CheckWorkerName = item.BatchNo = null;
                  results.push(item);
                }

                if (result.data.Rows) {
                  result.data.Rows.forEach(function (it) {
                    var qd = item;
                    if (it.RegionId == qd.$id || it.RegionName== qd.$name) {
                      if (!qd.BatchNo)
                        qd.BatchNo = it.BatchNo;
                      else if (qd.BatchNo != it.BatchNo) {
                        qd = results.find(function (k) {
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
                      //if (!it.CheckNo) {

                      //} else if (it.CheckNo == 1) {
                      //    qd.state = it.AllResult ? 2 : 1;
                      //} else {
                      //    qd.state = it.AllResult ? 4 : 3;
                      //}
                      qd.state = it.ECCheckResult;
                      qd.checkedCount = it.JLCount + it.WKCount + it.ZbCount;
                      qd.MinPassRatio0 = it.ZbLast || it.ZbFirst;
                      qd.CheckDate0 = it.ZbDate;
                      qd.BatchRelationId = it.Id;
                      qd.Remark = it.Remark;
                      qd.MinPassRatio = it.JLLast || it.JLFirst;
                      qd.CheckDate = it.JLDate;
                      qd.CheckWorkerName = it.JLUser;
                      qd.ZbCount = it.ZbCount;
                      qd.JLCount = it.JLCount;
                      qd.WKCount = it.WKCount;
                      qd.MinPassRatio1 = it.WKLast;
                      qd.CheckDate1 = it.VKDate;
                      qd.CheckWorkerName1 = it.WKLastUser;
                      qd.ZbChecked = $scope.roleId == 'zb' ? it.ZbChecked : true;
                    }
                  });
                }
              });

              results.forEach(function (item) {

                if (item.state != 0)
                  checkedCount++;
                if (item.state == 2 || item.state == 4)
                  cmpCount++;
              });

              $scope.project.data.checkedCount = checkedCount;
              $scope.project.data.cmpCount = cmpCount;
              $scope.project.data.results = results;
              $scope.project.filter();
            }

          });

        }
        else if ($scope.project.data.items) {
          //仅通过states过虑
          var rows = [];

          $scope.project.states.forEach(function (item) {
            item.c = 0;
          });
          if ($scope.project.data.results) {
            $scope.project.data.results.forEach(function (item) {
              if ($scope.project.states.find(function (it) {
                  if (it.id == item.state || it.id == -1) {
                    it.c++;
                    item.color = it.color;
                    item.stateName = it.title + ((item.state == 1 || item.state == 3) && item.MinPassRatio && item.MinPassRatio >= 80 ? '(偏差)' : '');
                  }
                  return it.selected && it.id == item.state
                })) {
                rows.push(item);
              }
            });
          }

          $scope.project.rows = rows;
          vm.loading = false;
        }
      }
    };
    $scope.$watch('project.pid',function () {
      if($scope.project.pid)
        $scope.project.type2 = $scope.project.type;
    });
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



    vm.openNav = function (id) {
      $mdSidenav(id).open()
    };
    vm.closeNav = function (id) {
      $mdSidenav(id).close().then(function () {
        vm.ys();
      });
    };
    vm.ys = function () {
      if (!$scope.project.pid || !$scope.project.procedureId) {
        if(!$scope.project.pid){
          vm.openNav('nav_region');
        }
        else if(!$scope.project.procedureId && $scope.project.type!==64){
          vm.openNav('nav_procedure');
        }
        //utils.alert("必须选择项目和工序！");
      }else{
        $timeout(function () {
          vm.searBarHide = true;
          $scope.project.filter(true);
        },300);
      }
    }


/*    $scope.$watch('project.procedureId', function(a,b) {
      if(a != b){
        if ( !$scope.project.pid) {
          utils.alert("项目不能为空！");
          return;
        }else{
          $scope.project.filter(true);
        }
      }

    });*/


    var queryOffline = function () {
      return api.szgc.ProjectSettings.offline.query().then(function (result) {
        $scope.project.offlines = result.data;
      });
    }

    $scope.hasTasks = function (item) {
      return  $scope.project && $scope.project.tasks && $scope.project.tasks.find(function (t) {
          return t.procedure == $scope.project.procedureId
           && t.projectid == item.$id;
        });
    }
    $scope.requeryTasks = function () {
      api.uploadTask(function (cfg,item) {
        return true
      }).then(function (result) {
        $scope.project.tasks = result.rows;
      });
    }
    //$scope.requeryTasks();
    $scope.isOffline = function (item) {
      return !!$scope.project.offlines.find(function (t) {
        return t.Id.indexOf(item.project_item_id)!=-1;
      });
    }
    $scope.download =function ($event,project,item) {
      item.downloading = true;
      var idTree = project.project_id+'>'+item.project_item_id;
      api.download([
        //项目区域
        function (tasks,downFile) {
          return $q(function (resolve,reject) {
            api.szgc.vanke.buildings({
              project_id: item.project_id,
              project_item_id: item.project_item_id,
              page_size: 0,
              page_number: 1
            }).then(function (result) {
              var tk = [];
              result.data.data.forEach(function (build) {
                tasks.push(function () {
                  return api.szgc.vanke.floors(build.building_id);
                });
                if(build.building_id.length >= 32){
                  tk.push(api.szgc.FilesService.group(build.building_id));
                }
              });
              $q.all(tk).then(function (rs) {
                var pics = xhUtils.getMapPic(2);
                rs.forEach(function (r) {
                  if(r.data.Files && r.data.Files.length){
                    var f = r.data.Files[0];
                    pics.forEach(function (tile) {
                      tasks.push(function () {
                        return downFile('map','tile_'+f.Id+'_'+tile+'.jpg',sxt.app.api+'/api/picMap/load/'+tile+'.png?path='+f.Url.replace('/s_','/')+'&size=256');
                      });
                    })
                  }
                });
                resolve();
              },reject);
            },reject);
          });
        },//下载户型
        function (tasks,downFile) {
          return $q(function (resolve,reject) {
            api.szgc.vanke.room_types(item.project_item_id).then(function (result) {
              var tk = [];
              result.data.data.forEach(function (type) {
                tk.push(api.szgc.FilesService.group(item.project_item_id+'-'+type.type_id));
                //5类工序
                [1,2,3,4,5,6].forEach(function (m) {
                  tasks.push(function () {
                    return api.szgc.ProjectExService.get(item.project_item_id+'-'+type.type_id+'-'+m)
                  });
                });
              });
              //图纸
              $q.all(tk).then(function (rs) {
                var pics = xhUtils.getMapPic(2);
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
        function (tasks) {
          return api.szgc.ProjectSettingsSevice.query({treeId:idTree,unitType:1,includeChild:true}).then(function (result) {
            var units = [];
            result.data.Rows.forEach(function (s) {
              if(units.indexOf(s.UnitId)==-1){
                units.push(s.UnitId);
                tasks.push(function () {
                  return api.szgc.vanke.teams(s.UnitId);
                })
              }
            })
          });
        },
        function (tasks) {
          return api.szgc.ProjectSettingsSevice.query({treeId:idTree,unitType:2,includeChild:true}).then(function (result) {
            var units = [];
            result.data.Rows.forEach(function (s) {
              if(units.indexOf(s.UnitId)==-1){
                units.push(s.UnitId);
                tasks.push(function () {
                  return api.szgc.vanke.teams(s.UnitId);
                })
              }
            })
          });
        },
        function (tasks) {
          return api.szgc.ProjectSettingsSevice.query({treeId:idTree,unitType:3,includeChild:true}).then(function (result) {
            var units = [];
            result.data.Rows.forEach(function (s) {
              if(units.indexOf(s.UnitId)==-1){
                units.push(s.UnitId);
                tasks.push(function () {
                  return api.szgc.vanke.teams(s.UnitId);
                })
              }
            });
          });
        },
        //验收状态
        function () {
          return api.szgc.addProcessService.getBatchRelation({regionIdTree:idTree});
        },
        //检查项目
/*        function () {
          return api.szgc.CheckStepService.cache(idTree);
        },*/
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

        //获取材料供应商
        function () {
          return api.material.SupplierService.GetAll({startrowIndex:0,maximumRows:100,Status:4});
        },

        //获取材料类型
        function () {
          return api.material.MaterialTypeService.GetProcedureType();
        },

        //获取材料
        function () {
          return api.material.BatchSetService.getAll({status:4});
        },

        //获取所有材料验收详细信息
        function () {
          return api.material.MaterialService.GetInfoById();
        },

        //获取所有材料验收所选附件
        function () {
          return api.material.MaterialService.GetMLFilesById();
        },

        //工序验收表
        function () {
          return api.szgc.TargetService.getAll()
        }])(function (percent,current,total) {
          item.percent = parseInt(percent *100) +' %';
        item.current = current;
        item.total = total;
      },function () {
        item.downloading = false;
        var offline = {
          Id:idTree,
          name:project.name+'>'+item.name,
          project:project,
          item:item,
          date: new Date()
        };
        api.szgc.ProjectSettings.offline.create(offline).then(function () {
          queryOffline().then(function () {
/*            var off = $scope.project.offlines.find(function (item) {
              return item.Id == offline.Id;
            });*/
            utils.alert('下载完成。');
            //$scope.indexDb(off);
          });

        });

      },function () {
        item.downloading = false;
        utils.alert('下载失败');
      },{timeout:30000});
    };
    $scope.indexDb =function (item) {
      item.indexing = true;
      api.task([function () {
        return api.szgc.TargetService.getAll.db().allDocs();
      },function () {
        return api.szgc.ProjectSettingsSevice.query.db().allDocs();
      },
        function () {
          return api.szgc.addProcessService.getBatchRelation.db().allDocs();//索引
        },function () {
          return api.szgc.CheckStepService.getAll.db().allDocs();
        },
        function () {
          return api.szgc.ProcedureBathSettingService.query.db().allDocs();//索引
        },function () {
          return api.szgc.vanke.teams.db().allDocs();
        }])(function (percent,current,total) {
        item.percent = parseInt(percent *100) +' %';
        item.current = current;
        item.total = total;
      },function () {
        item.indexing = false;
        utils.alert('索引完成');
      },function () {
        item.indexing = false;
      },{
        timeout:300000
      });
    }
    $scope.upload =function () {
      if(api.getNetwork()==1){
        utils.alert('离线模式下不能上传!');
        return;
      }
      $scope.uploading = true;
      api.upload(function (cfg,item) {
        if(cfg._id=='s_files' && item && item.Url.indexOf('base64')==-1){
          return false;
        }
        return true;
      },function (percent,current,total,task) {
        $scope.project.percent = parseInt(percent *100) +' %';
        $scope.project.current = current;
        $scope.project.total = total;
        task && task.then(function (row) {
          try {
            api.upload(function (up) {
              return up._id == row.Id || up._id == row.tid;
            }, null);
          }catch (ex){

          }
          return row;
        })
      },function () {
        $scope.project.uploaded = 1;
        api.uploadTask(function () {
          return true
        },null);
        utils.alert('上传完成');
        var ts = [];
        $scope.project.tasks.forEach(function (t) {
          if(t.idtree){
            var tree = t.idtree.split('>'),
              tree2 = tree[0]+'>'+tree[1];
            if(!ts.find(function (t) {
                return t==tree2;
              })){
              ts.push(tree2);
            }
          }
        });
        if(ts.length){ //刷新状态
          var tasks = [];
          ts.forEach(function (t) {
            tasks.push(function () {
              return api.szgc.addProcessService.getBatchRelation({regionIdTree:t});
            })
          });
          api.task(tasks)(function () {

          },function () {

          });
        }
        $scope.project.tasks = [];
        $scope.uploading= false;
      },function (err) {
        $scope.project.uploaded = 0;
        utils.alert('上传失败'+(err && err.errcode));
        $scope.uploading =false;
      },{
        timeout:600000,
        uploaded:function (cfg,row,result) {
          cfg.db && cfg.db.delete(row);
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

    //init load
/*    $timeout(function () {
/!*      api.szgc.ProcedureTypeService.getAll({startrowIndex:0,maximumRows:100,Status:5}).then(function(result) {
        $scope.project.procedureTypes = result.data.Rows;
      });*!/

    },300)*/

    $scope.$watch('vm.selectedIndex',function () {
      var index = vm.selectedIndex;
      if(!vm.hasMaterial && index!==0){
        index++;
      }
      switch (index) {
        case 0:
          if(!appCookie.get('projects')) {
            $timeout(function () {
              vm.ys();
            }, 300);
          }
          $scope.requeryTasks();
          break;
        case 1:
          if(vm.hasMaterial) {
            vm.load();
          }
          break;
        case 2:
          //以下离线相关
          if(api.getNetwork()==0) {
            api.szgc.vanke.projects().then(function (r) {
              $scope.project.projects = r.data.data;
            });
          }
          queryOffline();
          break;
        case 3:
          $scope.requeryTasks();
          break;
      }
    })
  }
})();
