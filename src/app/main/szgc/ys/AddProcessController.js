/**
 * Created by zhangzhaoyong on 16/2/1.
 */
(function(){
  'use strict';
  angular
    .module('app.szgc')
    .controller('AddProcessController',AddProcessController);

  /** @ngInject */
  function AddProcessController($scope, $filter, $stateParams, utils,  $q, api,auth,$state){


    //给默认时间
    var dateFilter = $filter('date');
    $scope.m = {};
$scope.back = function(){
  history.back();
}
    $scope.m.CheckDateF = new Date();
    $scope.m.CheckDate = dateFilter($scope.m.CheckDateF, 'yyyy-MM-dd HH:dd:ss');


    var pid = $stateParams.projectid,
      rname = $stateParams.name,
      batchId = $stateParams.batchId,
      procedure = $scope.$parent.project.procedureId || $stateParams.procedureId,
      procedureName = $scope.$parent.project.procedureName || $stateParams.procedureName,
      rt = $scope.$parent.project.type || $stateParams.type,
      idtree = $scope.$parent.project.idTree || $stateParams.idTree,
      nametree = $scope.$parent.project.nameTree || $stateParams.nameTree,
      token = $stateParams.token,
      flag = $stateParams.flag;

    console.log('----传参数----', $stateParams);
    $scope.flag = $stateParams.flag;
    if (!procedure) {
      $state.go('app.szgc.ys');
      return;
    }
    var user=auth.current(),
        initIng = true;
    $scope.isPartner = api.szgc.vanke.isPartner();
    $scope.data = {
      pics: [],
      isFirst: !batchId || batchId == 'new',
      projectName: nametree,
      procedureName: procedureName,
      projectInfo: nametree + ' - ' + procedureName,
      rName: rname,
      curHistory: {
        BatchNo: 1,
        Count: 1,
        WorkRatio: 100,
        CheckNo: 1
      },
      batchs: [],
      curStep: {},
      historys: null,
      groups: null,
      submitUsers: null,
      flag:flag
    };

    var resetWorkRatio = function () {
      var bs = $scope.data.batchs,
        len = 0,
        sk = 0,
        last = null;
      bs.forEach(function (item) {
        if (item.changed) {
          sk += isNaN(parseFloat(item.WorkRatio)) ? 0 : parseFloat(item.WorkRatio);
        } else {
          len++;
          last = item;
        }
      });
      if (!last)
        last = bs[bs.length - 1];

      var p = parseFloat(((100 - sk) / len).toFixed(2)),
        t = 0,
        k = 0;
      if (p < 0) {
        bs.forEach(function (item) {
          item.changed = false;
        })
        resetWorkRatio();
      } else {
        bs.forEach(function (item) {
          item.BatchNo = (++k);
          if (item != last) {
            item.WorkRatio = item.changed ? item.WorkRatio : p;
            t += item.WorkRatio;
          }
        });
        last.WorkRatio = parseFloat((100 - t).toFixed(2));
      }
    };
    $scope.addBatch = function () {
      $scope.data.batchs.push({
        BatchNo: $scope.data.batchs.length + 1,
        Count: 1,
        WorkRatio: 100
      });
      resetWorkRatio();
    }
    $scope.removeBatch = function (item) {
      var bs = $scope.data.batchs,
        ix = bs.indexOf(item);
      bs.splice(ix, 1);
      resetWorkRatio();
    }
    $scope.changeBatch = function (item) {
      if (item.WorkRatio) {
        var rd = parseFloat(item.WorkRatio);
        if (isNaN(rd) || rd < 0 || rd > 100)
          item.changed = false;
        else {
          item.changed = true;
        }
        resetWorkRatio();
      } else {
        item.changed = true;
        resetWorkRatio();
      }

    }

    api.szgc.ProcedureService.getAppImg(pid, procedure, api.szgc.vanke.isPartner(1) ? 'partner' : '').then(function (r) {
      if (r.data) {
        $scope.data.curStep.GroupImg2 = r.data.Id;

      }
    });




    if (!$scope.isPartner) {
      $scope.data.submitUsers = [{
        id: user.Id,
        type: api.szgc.vanke.isPartner(1) ? 'jl' : 'eg',
        name: user.RealName + '(本人)'
      }];
      $scope.data.curStep.CheckWorker = $scope.data.submitUsers[0].id;
    }

    $q(function (resolve) {
      if (!$scope.data.isFirst) { //如果是进入进入验收批
        api.szgc.ProcProBatchRelationService.getbyid(batchId).then(resolve);
        //console.log('复验')
      } else {
        //行内新增验收批。查询已经录入了的验收批
        api.szgc.addProcessService.getBatchRelation({
          regionIdTree: idtree,
          procedureId: procedure,
          regionId: pid
        }).then(function (result) {
          //如果已经录入了把第一条BatchNo最大的返回取它的BatchNo，把Id制空
          //没有Id才会插入一条数据
          var b = result.data.Rows.length ? result.data.Rows[0] : null;

          if (b) {
            b.Id = null;
            b.BatchNo = parseInt(result.data.Rows[0].BatchNo) + 1;//第几次验收批
            b.Remark = '';//描述
            b.Count = 1;//第几次验收
          }
          else
            flag = false;

          resolve({
            data: b
          });
        });

      }
    }).then(function (result) {
      var batch = result.data,

        isB = $scope.data.isB = !!batch;
      if (flag) {
        batch.BatchNo = parseInt(batch.BatchNo);
        $scope.data.curHistory = batch;

      }
      else if (batch && !flag) {

        batch.Count = batch.Count + 1;
        $scope.data.curHistory = batch;
      }
      $q.all([
        api.szgc.TargetService.getAll(procedure),
        isB&&!flag ? $q(function (resolve) {
          resolve({
            data: {
              Rows: [{
                UnitId: batch.CompanyId,
                UnitName: batch.CompanyName
              }]
            }
          });
        }) : api.szgc.ProjectSettingsSevice.query({
          projectId: idtree,
          unitType: 2
        }),

        isB&&!flag ? $q(function (resolve) {
          resolve({
            data: {
              Rows: [{
                UnitId: batch.ParentCompanyId,
                UnitName: batch.ParentCompanyName
              }]
            }
          });
        }) : api.szgc.ProjectSettingsSevice.query({
          projectId: idtree,
          unitType: 3
        }),
        isB&&!flag ? $q(function (resolve) {
          resolve({
            data: {
              Rows: [{
                UnitId: batch.SupervisorCompanyId,
                UnitName: batch.SupervisorCompanyName
              }]
            }
          });
        }) : api.szgc.vanke.isPartner(1) ? api.szgc.vanke.getPermissin() : api.szgc.ProjectSettingsSevice.query({
          treeId: idtree,
          unitType: 1,
          includeChild: true
        })
      ]).then(function (results) {

        batch = batch || $scope.data.curHistory;

        $scope.data.batchs.push(batch);

        $scope.data.supervision = results[1].data.Rows;
        if (isB && $scope.data.supervision.length && !batch.CompanyId)
          batch.CompanyId = $scope.data.supervision[0].UnitId;
        if (isB) {
          $scope.data.curHistory.GrpId = batch.GrpId;
          $scope.data.groups = [{
            id: batch.GrpId,
            name: batch.GrpName
          }];

        }

        console.log('$scope.data.curHistory', $scope.data.curHistory);

        $scope.data.supervision1 = results[2].data.Rows;

        console.log('----results---',results);
        console.log('---- 监理1$scope.data.supervision1---',$scope.data.supervision1);

        if (isB && $scope.data.supervision1.length && !batch.ParentCompanyId) {
          batch.ParentCompanyId = $scope.data.supervision1[0].UnitId;
        }
        if (api.szgc.vanke.isPartner(1) && !flag) {
          batch.Count = (batch.JLCount || 0) + 1;
          var fd = results[3].data.Rows.find(function(it) {
            return it.UnitId = api.szgc.vanke.getPartner()
          });
          var nn = [];
          if (fd) {
            nn.push(fd);
            if (!batch.SupervisorCompanyId)
              batch.SupervisorCompanyId = fd.UnitId;
            $scope.data.construction = nn;
          }
        } else {
          batch.Count = (batch.WKCount || 0) + 1;
          var nn = [];
          results[3].data.Rows.forEach(function (r) {
            if (nn.find(function (r1) { return r1.UnitId == r.UnitId }) == null) {
              nn.push({
                UnitId: r.UnitId,
                UnitName: r.UnitName
              })
            }
          })
          $scope.data.construction = nn;
          if ($scope.data.construction.length && !batch.SupervisorCompanyId)
            batch.SupervisorCompanyId = $scope.data.construction[0].UnitId;
        }

        results[0].data.Rows.forEach(function(item) {
          item.TargetName = RemoveStr(item.TargetName);
          item.checked = true;

          if (item.TargetTypeId == '018C0866-1EFA-457B-9737-7DCEFEA148F6') {
            $scope.targets.zk.push(item);
          } else {
            item.CheckNum = (item.CheckNum == 0) ? "" : item.CheckNum;
            item.PassRatio = (item.PassRatio == 0) ? "" : item.PassRatio;
            $scope.targets.yb.push(item);
          }
          //appConfig.procedureId
          if (procedure =='2814510f-0188-4993-a153-559b40d0b5e8') {
            if ($scope.targets.yb.length == 3 || $scope.targets.yb.length == 7) {
              $scope.targets.yb.push({
                TargetName: '-',
                DeviationLimit: '≥80',
                items: (function () {
                  var ns = [];
                  for (var i = $scope.targets.yb.length - 1; i >= 0; i--) {
                    var n = $scope.targets.yb[i];
                    if (n.TargetName && n.TargetName.substring(0, 1) == '-') break;
                    ns.push(n)
                  };
                  return ns;
                })(),
                checked:false,
                getPassRatio: function () {
                  var sum=0,l=0;
                  this.items.forEach(function (item) {
                    if (item.PassRatio) {
                      sum = utils.math.sum(item.PassRatio, sum);
                      l++;
                    }
                  });
                  if (l == 0) return null;
                  return utils.math.div(sum, l);
                },
                ok: function () {
                  var p = this.getPassRatio();
                  return !p || p >= 80;
                }
              });
            }
            if ($scope.targets.yb.length == 8) {
              $scope.targets.yb.push({
                TargetName: '--',
                DeviationLimit: '≥85',
                checked: false,
                getPassRatio: function () {
                  var sum = 0,l=0;
                  $scope.targets.yb.forEach(function (item) {
                    if (!item.getPassRatio) {
                      sum = utils.math.sum(item.PassRatio, sum);
                      l++;
                    }
                  });
                  if (l == 0) return null;
                  return utils.math.div(sum, l);
                },
                ok: function () {
                  var p = this.getPassRatio();
                  return !p || p >= 85;
                }
              });
            }
          }
        });
        //utils.scrollTop();
        initIng = true;
      });
    });


    $scope.$watch('data.curHistory.SupervisorCompanyId', function() {

      if ($scope.data.curHistory.SupervisorCompanyId) {
        var s1 = api.szgc.vanke.isPartner() ? [] : [$scope.data.submitUsers[0]];
        api.szgc.vanke.employees($scope.data.curHistory.SupervisorCompanyId).then(function(result) {
          result.data.data.forEach(function(item) {
            s1.push({
              type: 'jl',
              id: item.employee_id,
              name: item.name + (item.phone ? '(' + item.phone + ')' : '')
            });
          });
          var fd = s1.find(function(f) {
            return f.id == user.Id
          });
          if (!fd) {
            fd = {
              type: 'jl',
              id: user.Id,
              name: user.RealName + '(本人)'
            };
            s1.push(fd);
          }
          if (fd) {
            if (fd.name.indexOf('(本人)') == -1)
              fd.name += '(本人)';

            $scope.data.curStep.CheckWorker = fd.id;
          }
          $scope.data.submitUsers = s1;

        });
      }
    })
    var resetGroup = function() {
      //console.log('111')
      var g = [];

      $scope.data.groups = [];
      $q.all([!$scope.data.isB && $scope.data.curHistory.CompanyId ? api.szgc.vanke.teams($scope.data.curHistory.CompanyId) : $q(function(resolve) {

        resolve({
          data: {
            data: []
          }
        })
      }), !$scope.data.isB && $scope.data.curHistory.ParentCompanyId && $scope.data.curHistory.ParentCompanyId != $scope.data.curHistory.CompanyId ? api.szgc.vanke.teams($scope.data.curHistory.ParentCompanyId) : $q(function(resolve) {
        resolve({
          data: {
            data: []
          }
        })
      })]).then(function(results) {
        results[0].data.data.forEach(function(item) {
          var ns = [];
          item.managers.forEach(function(it) {
            ns.push(it.name);
          });
          g.push({
            id: item.team_id,
            name: $scope.data.curHistory.CompanyName + ' - ' + item.name + (ns.length ? '(' + ns.join(';') + ')' : '')
          });
        });
        results[1].data.data.forEach(function(item) {
          var ns = [];
          item.managers.forEach(function(it) {
            ns.push(it.name);
          });
          g.push({
            id: item.team_id,
            name: $scope.data.curHistory.ParentCompanyName + ' - ' + item.name + (ns.length ? '(' + ns.join(';') + ')' : '')
          });
        });
        //console.log('----',$scope.data.groups);
        if (g.length)
          $scope.data.groups = g;

      })

    }
    $scope.$watch('data.curHistory.ParentCompanyId', resetGroup)
    $scope.$watch('data.curHistory.CompanyId', resetGroup);

    $scope.targets = {
      zk: [],
      yb: []
    }
    //ProcedureService.getbyid(procedure).then(function (result) {
    //    $scope.data.procedure = result.data;
    //});




    //移除重复项
    var RemoveStr = function(str) {
      var strarr = str.split('>');
      var strarr2 = [];
      strarr.forEach(function(item) {
        item = item.replace(/(^\s*)|(\s*$)/g, '');
        if (!strarr2.length || strarr2[strarr2.length - 1] != item) {
          strarr2.push(item);
        }
      });
      return strarr2.join('>');
    };

    //批量保存
    var toSaveTargets = function(step) {
      var savetargets = [];
      $scope.targets.zk.forEach(function (zkitem) {
        if (zkitem.checked) {
          //遍历获取主控数据
          savetargets.push({
            CheckStepId: step.Id,
            TargetId: zkitem.Id,
            PassText: zkitem.PassText,
            NoPassText: zkitem.NoPassText,
            ProcedureId: procedure,
            MPCheckValue: zkitem.MPCheckValue,
            CheckWorker: step.CheckWorker,
            TargetTypeId: zkitem.TargetTypeId,
            Sort: zkitem.Sort,
            Status: 4,
            RoleId: step.RoleId,
            HistoryNo: step.CheckNo,
            Remark: zkitem.Remark,
            CheckDate: $scope.m.CheckDate
          });
        }
      })

      //遍历获取一般项目数据
      $scope.targets.yb.forEach(function (zkitem) {
        if (zkitem.checked) {
          savetargets.push({
            CheckStepId: step.Id,
            TargetId: zkitem.Id,
            CheckNum: zkitem.CheckNum, //检查点数
            PassRatio: zkitem.PassRatio, //合格率
            MaxDeviation: zkitem.MaxDeviation, //最大偏差
            ProcedureId: procedure,
            DeviationLimit: zkitem.DeviationLimit,
            TargetTypeId: zkitem.TargetTypeId,
            Sort: zkitem.Sort,
            Status: 4,
            RoleId: step.RoleId,
            HistoryNo: step.CheckNo,
            Remark: zkitem.Remark,
            CheckDate: $scope.m.CheckDate
          });
        }
      })
      return savetargets;
    }
    $scope.save = function(addForm) {

      var m = /(((20[0-9][0-9]-(0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|(20[0-3][0-9]-(0[2469]|11)-(0[1-9]|[12][0-9]|30))) (20|21|22|23|[0-1][0-9]):[0-5][0-9]:[0-5][0-9])/
      var s = $scope.m.CheckDate;
      if(!m.test(s)){
        utils.alert('日期格式不对!(yyyy-MM-dd HH:dd:ss)');
        return;
      }
      if ($scope.data.pics.length == 0) {
        utils.alert('请上传原验收表扫描件');
        return;
      }
      utils.confirm(null, '确认向验收批：' + $scope.data.curHistory.BatchNo + ' 添加新记录吗?',
        function() {
          $scope._save(addForm);
        })
    }


    $scope._save = function (addForm) {


      $scope.isSaveing = true;
      //addForm
      var data = $scope.data,
        step = data.curStep,
        batch = data.curHistory;
      if (!batch.GrpId) {
        utils.alert('请选择班组', function () {
          $scope.isSaveing = false;
        });
        return;
      }
      step.RoleId = data.submitUser.type;
      step.CheckNo = batch.Count;
      step.MainResult = $scope.zkIsOk() ? 1 : 0;
      step.OtherResult = $scope.ybIsOk() ? 1 : 0;
      step.AllResult = $scope.zkIsOk() && $scope.ybIsOk() ? 1 : 0;
      step.MinPassRatio = $scope.targets.yb.length == 0 ? 100 : $scope.ybHGL();
      step.Status = 4;
      if (step.CheckWorkerName) {
        var ix = step.CheckWorkerName.indexOf('(');
        if (ix != -1)
          step.CheckWorkerName = step.CheckWorkerName.substring(0, ix);
      }


      batch.ProcedureId = procedure;
      batch.EngineeringProjectId = idtree.split('>')[0];
      batch.Status = 4;
      batch.RegionId = pid;
      batch.RegionType = rt;
      batch.RegionIdTree = idtree;
      batch.RegionNameTree = nametree;
      //console.log('batch.RegionNameTree', batch.RegionNameTree)
      batch.RegionName = rname;
      //将第一验收批的信息复制到所有验收批
      data.batchs.forEach(function (item) {
        if (item != batch) {
          item.ProcedureId = batch.ProcedureId;
          item.EngineeringProjectId = batch.EngineeringProjectId;
          item.Status = batch.Status;
          item.RegionId = batch.RegionId;
          item.RegionType = batch.RegionType;
          item.RegionIdTree = batch.RegionIdTree;
          item.RegionNameTree = batch.RegionNameTree;
          item.RegionName = batch.RegionName;
          item.SupervisorCompanyId = batch.SupervisorCompanyId;
          item.SupervisorCompanyName = batch.SupervisorCompanyName;
          item.ParentCompanyName = batch.ParentCompanyName;
          item.ParentCompanyId = batch.ParentCompanyId;
          item.CompanyId = batch.CompanyId;
          item.CompanyName = batch.CompanyName;
          item.GrpId = batch.GrpId;
          item.GrpName = batch.GrpName;
        }
      });
      var targets = toSaveTargets(step);

      //console.log('CheckData', targets)
      api.szgc.addProcessService.postCheckData({
        Batch: data.batchs,
        Step: step,
        CheckData: targets
      }).then(function (result) {
        api.szgc.ProcedureService.deleteAppImg(step.GroupImg2);
        $scope.isSaveing = false;
        $scope.$parent.project.filter(true);
        utils.alert('提交完成').then(function () {
            $state.go('app.szgc.ys');
        });
      });
    }
    $scope.rowIsOk = function(pc, hg, mk) {
      mk = parseInt(mk);
      if (isNaN(mk)) return true;
      pc = pc.replace('mm', '');
      var zf = pc.indexOf('±') != -1;
      var isIn = pc.indexOf(',');
      if (isIn) {
        var ins = pc.split(',');
      }
    }
    $scope.zkIsOk = function(n) {
      //主控项是否全合格
      for (var i = 0, l = $scope.targets.zk.length; i < l; i++) {
        if ($scope.targets.zk[i].checked && !$scope.targets.zk[i].isOK) {
          return false;
        }
      }


      return true;

    }
    $scope.ybIsOk = function() {
      for (var i = 0, l = $scope.targets.yb.length; i < l; i++) {
        var yb = $scope.targets.yb[i];
        if ((yb.ok && !yb.ok()) || (yb.checked && !yb.isOK)) return false;
      }
      return true;
    }
    $scope.ybBlur = function(item) {
      var zdpc = item.MaxDeviation;
      var pattern = /^[0-9]+([.]\d{1,2})?$/;
      if (zdpc) {
        if (!pattern.test(zdpc)) {
          if (!pattern.test(zdpc)) {
            utils.alert("您输入最大偏差值格式不正确！");
            item.MaxDeviation = '';
          }
        }
      }

    }
    $scope.ybIsOkRow = function (item) {
      //if (item.getPassRatio) {
      //    return item.ok();
      //}
      if (!item.checked) {
        item.isOK = true;
        return item.isOK;
      }
      var zdpc = item.MaxDeviation;
      //var pattern = /^[0-9]+([.]\d{1,2})?$/;
      //if (zdpc) {
      //    if (!pattern.test(zdpc)) {
      //        item.isOK = false;
      //        return false;
      //    }
      //}
      zdpc = parseFloat(zdpc);
      var hgl = parseFloat(item.PassRatio),
        pc = item.DeviationLimit,
        op = pc.substring(0, 1);
      if (isNaN(hgl) || isNaN(zdpc)) {
        item.isOK = false;
        return true;
      }
      if (hgl < 80) {
        item.isOK = false;
        return false;
      }
      var isIn = pc.match(/(-?[\d.])+/g); //(\.\d{2})?：

      // console.log("isIn", isIn);
      if (isIn && isIn.length > 0) {
        var min = 0,
          max = parseFloat(isIn[0]);

        if (isIn && isIn.length > 1) {
          min = parseFloat(isIn[1]);
          if (max < min) {
            max = min;
            min = parseFloat(isIn[0]);
          }
        }
        if (max < min) {
          var t11 = max;
          max = min;
          min = t11;
        }

        if (op == '±') {
          min = -max;
        } else if (op == '+') {
          min = 0;
        } else if (op == '-') {
          max = -max;
        } else if (op == '≥') {
          min = max;
          max = 10000000;
        } else if (op == '＞') {
          min = utils.math.sum(max, 0.1);
          max = 10000000;
        } else if (op == '≤') {
          min = -10000000;
        } else if (op == '＜') {
          max = utils.math.sub(max, 0.1);
          min = -10000000;
        }
        max = utils.math.mul(max, 1.5);
        if (min > 0)
          min = utils.math.mul(min, 0.5);
        else
          min = utils.math.mul(min, 1.5);
        //console.log(min, max, zdpc)
        if (zdpc < min || zdpc > max) {
          item.isOK = false;
          return false;
        }
        item.isOK = true;
        return item.isOK;
      } else {
        item.isOK = true;
        return item.isOK;
      }
    }
    $scope.ybHGL = function() {
      var hgl;
      for (var i = 0, l = $scope.targets.yb.length; i < l; i++) {
        var ybd = parseFloat($scope.targets.yb[i].PassRatio);
        if (!isNaN(ybd) && (!hgl || hgl > ybd)) hgl = ybd;
      }
      return hgl;
    }
    $scope.ybHGLPJ = function() {
      var hgl = 0,c=0;
      for (var i = 0, l = $scope.targets.yb.length; i < l; i++) {
        var ybd = parseFloat($scope.targets.yb[i].PassRatio);
        if (!isNaN(ybd)) {
          hgl = utils.math.sum(hgl, ybd);
          c++;
        }
      }
      return c == 0 ? '' : utils.math.div(hgl, c);
    }


  }
})();
