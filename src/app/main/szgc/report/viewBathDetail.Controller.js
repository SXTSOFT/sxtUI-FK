/**
 * Created by guowei on 2016/2/2.
 */
(function(){
  'use strict';
  angular
    .module('app.szgc')
    .controller('viewBathDetailController',viewBathDetailController);
  function viewBathDetailController($scope,api,$stateParams,utils,$q,$state,$mdDialog) {

    $stateParams.bathid = $stateParams.bathid||$stateParams.bathId;
    var vm = this;
    vm.back = function(){
      $state.go('app.szgc.report.viewBath')
    }
    vm.isPartner = api.szgc.vanke.isPartner(1);
    vm.goAdd = function () {
      $state.go('app.szgc.ys.addnew',{
        projectid:$scope.titol.regionId,
        name:$scope.titol.RegionName,
        batchId:$stateParams.bathid,
        //procedureTypeId:project.procedureTypeId,
        procedureId:$scope.titol.ProcedureId,
        //type:project.type,
        idTree:$scope.titol.RegionIdTree,
        procedureName:$scope.titol.ProcedureName,
        nameTree:$scope.titol.RegionNameTree
      });
    }
    var newItem = function(name) {
      return {
        colspan: 1,
        rowspan: 1,
        name: name || '',
        isShow: function() { //是否显示此单元格
          return this.colspan != 0 && this.rowspan != 0;
        }
      }
    }
    //主控项目主要属性
    var newZKItem = function (TargetName, Remark, PassText, NoPassText, Id, MPCheckValue) {
      return {
        MPCheckValue:MPCheckValue,
        TargetName: TargetName,
        Remark: Remark,
        PassText: PassText,
        NoPassText: NoPassText,
        Id: Id,
        children: [],
        add: function (TargetName, Remark, PassText, NoPassText, MPCheckValue) {
          var me = this;
          me.children.push(newZKItem(TargetName, Remark, PassText, NoPassText, MPCheckValue))
        }
      }
    }

    var bingTargets = function(Rows) {
      var targets = {
        zk: [],
        yb: []
      }
      if (Rows.length) {
        Rows.forEach(function (item) {
          if (item.DeviationLimit) {
            //item.DeviationPre = item.DeviationLimit.substring(0, 1);
            //item.DeviationLimit = item.DeviationLimit.substring(1)
          }
          if (item.TargetTypeId == '018C0866-1EFA-457B-9737-7DCEFEA148F6') {
            targets.zk.push(new newZKItem(item.TargetName, item.Remark, item.PassText, item.NoPassText, item.Id,item.MPCheckValue))
          } else {
            targets.yb.push(item);
            if ($scope.data.ProcedureId =='2814510f-0188-4993-a153-559b40d0b5e8') {
              if (targets.yb.length == 3 || targets.yb.length == 7) {
                targets.yb.push({
                  TargetName: '-',
                  DeviationLimit: '≥80',
                  items: (function () {
                    var ns = [];
                    for (var i = targets.yb.length - 1; i >= 0; i--) {
                      var n = targets.yb[i];
                      if (n.TargetName && n.TargetName.substring(0, 1) == '-') break;
                      ns.push(n)
                    };
                    return ns;
                  })(),
                  checked: false,
                  getPassRatio: function () {
                    var sum = 0, l = 0;
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
              if (targets.yb.length == 8) {
                targets.yb.push({
                  TargetName: '--',
                  DeviationLimit: '≥85',
                  checked: false,
                  getPassRatio: function () {
                    var sum = 0, l = 0;
                    targets.yb.forEach(function (item) {
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
          }
        });
      } else {
        targets.zk.push(new newZKItem());
        targets.yb.push({
          TargetName: ''
        }); //需要名字，为让后面不判断是否为undefinded
      }
      targets.info = (function () { //用于合并单位格计算
        return {
          zyLength: 0,
          zyColLength: 0,
          ybLength: 0,
          ybColLength: 0,
          current: {},
          addzk: function () { //添加一个主控项目
            var me = this;
            me.zyLength++;
            me.additem(targets.zk, me.zyColLength);
          },
          additem: function (arr, len) { //添加一个项目（主控或一般）主要把列（names）和其它项目保持一致
            arr.push({
              names: (function () {
                var names = [];
                while (names.length < len) {
                  names.push(newItem());
                }
                return names;
              })()
            });
          },
          addyb: function () {
            var me = this;
            me.ybLength++;
            me.additem(targets.yb, me.ybColLength);

          },
          addcol: function (arr) {
            arr.forEach(function (item) {
              item.names.push(newItem());
            });
          },
          addybcol: function (iszk) {
            var me = this;
            if (iszk) {
              me.zyColLength++;
              me.addcol(targets.zk);
            } else {
              me.ybColLength++;
              me.addcol(targets.yb);
            }
          },
          cbRow: function (arr) {
            var ix = 0;
            arr.forEach(function (item) {
              for (var i = 0, l = item.names.length; i < l; i++) {
                var n = item.names[i];
                if (n.rowspan != 0) {
                  var rowspan = 1;
                  for (var ii = ix + 1, ll = arr.length; ii < ll; ii++) {
                    var next = arr[ii].names[i];
                    if (next.name != '' && n.name == next.name) {
                      rowspan++;
                      next.rowspan = 0;
                    } else {
                      next.rowspan = 1;
                      break;
                    }

                  }
                  n.rowspan = rowspan;
                }
              }
              ix++;
            });
            arr.forEach(function (item) {
              var p = null,
                colspan = 1;
              item.names.forEach(function (n) {
                if (!p || n.name == '' || p.name != n.name || p.rowspan != n.rowspan) {
                  if (p)
                    p.colspan = colspan;
                  n.colspan = 1;
                  colspan = 1;
                  p = n;

                } else {
                  colspan++;
                  n.colspan = 0;
                }
              })
              p.colspan = colspan;
            });
          },
          zyCount: function () {
            var me = this;
            me.zyLength = targets.zk.length;
            me.ybLength = targets.yb.length;
            me.cbRow(targets.zk);
            me.cbRow(targets.yb);
            return this.zyLength;
          },
          ybCount: function () {
            var me = this;
            me.zyLength = targets.zk.length;
            me.ybLength = targets.yb.length;
            me.cbRow(targets.zk);
            me.cbRow(targets.yb);
            return this.ybLength;
          },
          selected: function (n, iszk) {
            this.current[iszk ? 'zk' : 'yb'] = n;
            if (!iszk)
              targets.yb.forEach(function (it) {
                it.selected = false;
              });
            else
              targets.zk.forEach(function (it) {
                it.selected = false;
              });
            n.selected = true;
          },
          remove: function (iszk) {
            if (!this.current[iszk ? 'zk' : 'yb']) {
              alert('请选择行');
              return;
            }
            if (iszk) {
              if (targets.zk.length == 1) return;
              var ix = targets.zk.indexOf(this.current.zk);
              if (ix != -1) {
                targets.zk.splice(ix, 1);
                if (ix = targets.zk.length - 1)
                  ix = targets.zk.length - 1;
                this.selected(targets.zk[ix], true);

              }
            } else {
              if (targets.yb.length == 1) return;
              var ix = targets.yb.indexOf(this.current.yb);
              if (ix != -1) {
                targets.yb.splice(ix, 1);

                if (ix = targets.yb.length - 1)
                  ix = targets.yb.length - 1;
                this.selected(targets.yb[ix]);
              }
            }
          },
          removecol: function (iszk) {
            if (iszk) {
              var ix = this.zyColSelected;
              if (targets.zk[0].names.length == 1) return;
              this.zyColLength--;
              targets.zk.forEach(function (item) {
                item.names.splice(ix, 1);
              });
            } else {
              var ix = this.ybColSelected;
              if (targets.yb[0].names.length == 1) return;
              this.ybColLength--;
              targets.yb.forEach(function (item) {
                item.names.splice(ix, 1);
              });
            }
          },
          sortUp: function (iszk) {
            if (!this.current[iszk ? 'zk' : 'yb']) {
              alert('请选择行');
              return;
            }
            if (iszk) {
              var ix = targets.zk.indexOf(this.current.zk);
              if (ix != -1) {
                if (ix == 0) return;
                targets.zk[ix] = targets.zk[ix - 1];
                targets.zk[ix - 1] = this.current.zk;
              }
            } else {
              var ix = targets.yb.indexOf(this.current.yb);
              if (ix != -1) {
                if (ix == 0) return;
                targets.yb[ix] = targets.yb[ix - 1];
                targets.yb[ix - 1] = this.current.yb;
              }
            }
          },
          sortDown: function (iszk) {
            if (!this.current[iszk ? 'zk' : 'yb']) {
              alert('请选择行');
              return;
            }
            if (iszk) {
              var ix = targets.zk.indexOf(this.current.zk);
              if (ix != -1) {
                if (ix == targets.zk.length - 1) return;
                targets.zk[ix] = targets.zk[ix + 1];
                targets.zk[ix + 1] = this.current.zk;
              }
            } else {
              ix = targets.yb.indexOf(this.current.yb);
              if (ix != -1) {
                if (ix == targets.yb.length - 1) return;
                targets.yb[ix] = targets.yb[ix + 1];
                targets.yb[ix + 1] = this.current.yb;
              }
            }
          },
          cbCol: function (arr) {
            var maxL = 0;
            arr.forEach(function (item) {
              if (!item.names) {
                item.names = [];
                 var ns = [];
                  ns = (item.TargetName || '').split('>')
                for (var i = 0, l = ns.length; i < l; i++) {
                  item.names.push(newItem(ns[i]));
                }
              }
              if (maxL < item.names.length)
                maxL = item.names.length;

            });
            arr.forEach(function (item) {
              while (maxL > item.names.length)
                item.names.push(newItem());

            });
            return maxL
          },
          init: function () {
            var me = this;
            me.zyColLength = me.cbCol(targets.zk);
            me.ybColLength = me.cbCol(targets.yb);
          }
        }
      })();
      targets.info.init();
      return targets;
    }
    //符合率计算
    var fhl = function (jl, vk) {
      if (jl == vk) return '100';
      //var r = ((1 - accDiv(Math.abs(jl - vk), jl)) * 100).toString();
      var r = ((1 - utils.math.div(Math.abs(jl - vk), jl)) * 100).toString();
      var rs = r.split('.');
      if (rs.length == 2 && rs[1].length > 2) {
        return rs[0] + '.' + rs[1].substring(0, 2);
      }
      return rs.join('.');
    }


    $scope.ybHGL = function (yb) {
      var hgl;
      for (var i = 0, l = yb.length; i < l; i++) {
        var ybd = parseFloat(yb[i].PassRatio);
        if (!isNaN(ybd) && (!hgl || hgl > ybd)) hgl = ybd;
      }
      return hgl;
    }
    $scope.ybHGLPJ = function (yb) {
      var hgl = 0, c = 0;
      for (var i = 0, l = yb.length; i < l; i++) {
        var ybd = parseFloat(yb[i].PassRatio);
        if (!isNaN(ybd)) {
          hgl = utils.math.sum(hgl, ybd);
          c++;
        }
      }
      return  c == 0 ? '' : utils.math.div(hgl, c);
    }
    $scope.zkIsOk = function (zk) {
      //主控项是否全合格
      for (var i = 0, l = zk.length; i < l; i++) {
        if (zk[i].MPCheckValue==0) {
          return false;
        }
      }


      return true;

    }

    $scope.ybIsOk = function (yb) {
      for (var i = 0, l = yb.length; i < l; i++) {
        if ((yb[i].ok && !yb[i].ok()) || (yb[i].PassRatio && yb[i].PassRatio < 80)) return false;
      }
      return true;
    }


    $scope.data = {};
    $scope.titol = {};
    $scope.jlTitol = {};

    $scope.egTitol = {};
    $stateParams.titol = {};

            $scope.th = []
            for (var i = 1; i <= 20; i++) {
                $scope.th.push({
                    aglin: "center",
                    Value: i
                })
            }
    //验收批数据
    $q.all([
      api.szgc.ProcProBatchRelationService.getbyid($stateParams.bathid),
      api.szgc.addProcessService.getCheckStepByBatchId($stateParams.bathid, {status: 4})
    ]).then(function (rs) {
      var r = rs[0];
      $stateParams.titol = r.data;
      $scope.titol = r.data;
      $scope.titol.Applications = [];
      //截取班组组长名称
      var fishIndex = 0;
      var lastIndex = 0;
      if ($scope.titol.GrpName) {
        fishIndex = $scope.titol.GrpName.indexOf("(");
        lastIndex = $scope.titol.GrpName.indexOf(")");
        if (fishIndex > 0 && lastIndex > 0) {
          $scope.titol.GrpName = $scope.titol.GrpName.substring(fishIndex + 1, lastIndex);
        } else {
          $scope.titol.GrpName = "";
        }
      }
      $scope.data.ProcedureId = r.data.ProcedureId;
      $scope.data.projectInfo = r.data.RegionNameTree + ' - ' + r.data.ProcedureName;

      var cbr = rs[1];

      $scope.jlTitol = {};

      $scope.egTitol = {};
      cbr.data.Rows.forEach(function(item) {
        if (item.Application) {
          $scope.titol.Applications.push({ RoleId: item.RoleId, CheckNo: item.CheckNo, Application: item.Application });
        }
        if (item.RoleId == "jl") {
          $scope.jlTitol = item;
        } else if (item.RoleId == "eg") {
          $scope.egTitol = item;
        }
      });
      $scope.data.ps = {
          zb: false,
          zb1:false,
          jl: false,
          jl1:false,
          eg: false,
          eg1: false,
          _3rd: false,
          _3rd1:false
      }

      api.szgc.addProcessService.getAll($stateParams.bathid, {status: 4}).then(function(result) {
        var group = [],
          gk = {}, eg, zb;
        result.data.Rows.forEach(function (item) {
          var g = gk[item.CheckStepId];
          if (!g) {
            g = gk[item.CheckStepId] = [];
            if (item.RoleId == 'eg' || item.RoleId == '3rd') eg = g;
            else if (item.RoleId == 'zb') zb = g;
            else if (!$scope.data.jl) {
              $scope.data.jl = item.CheckWorker;
              $scope.data.jldate = item.CreatedTime;
            }
            group.push(g);
          }
          g.push(item);
        });

        var jl = [];
        $scope.data.zb = zb && zb[0].CheckWorker;
        //$scope.data.zbFll = eg && eg[0].CreatedTime;
        $scope.data.vk = eg && eg[0].CheckWorker;
        $scope.data.vkdate = eg && eg[0].CreatedTime;
        group.forEach(function (item) {
          if (item[0].RoleId == 'jl') {
            var i = 0;
            item.forEach(function (it) {
              if (it.TargetTypeId != '018C0866-1EFA-457B-9737-7DCEFEA148F6') {
                // console.log("eg[i].PassRatio", eg);
                var _eg = eg && eg.find(function (p) {
                    return p.TargetId == it.TargetId;
                  });
                if (_eg) {
                  it.VKPassRatio = (_eg.PassRatio == 0) ? '' : _eg.PassRatio;
                } else {
                  it.VKPassRatio = ''
                }
                var _zb = zb && zb.find(function (p) {
                    return p.TargetId == it.TargetId;
                  });
                if (_zb) {
                  it.ZbPassRatio = (_zb.PassRatio == 0) ? '' : _zb.PassRatio;
                } else {
                  it.ZbPassRatio = ''
                }

                it.FHL = _eg && fhl(it.PassRatio, it.VKPassRatio);
                it.ZBFHL = _zb && fhl(it.ZbPassRatio, it.PassRatio);
              }
              ;
              i++;
            });
            jl.push({
              ix: jl.length + 1,
              text: '第' + (jl.length + 1) + '次',
              d: bingTargets(item)
            });
          }
        });
        $scope.data.ps.jl = jl.length != 0;
        if (!jl.length) {
          group.forEach(function (item) {
            if (item[0].RoleId == 'zb') {
              jl.push({
                ix: jl.length + 1,
                text: '第' + (jl.length + 1) + '次',
                d: bingTargets(item)
              });
              item.forEach(function (it) {
                if (it.TargetTypeId != '018C0866-1EFA-457B-9737-7DCEFEA148F6') {

                  it.ZbPassRatio = it.PassRatio;
                  it.PassRatio = '';
                  it.CheckNum = '';
                  it.MaxDeviation = '';


                  //it.FHL = eg && eg[i] && fhl(it.PassRatio, it.VKPassRatio);
                  //it.ZBFHL = zb && zb[i] && fhl(it.ZbPassRatio, it.PassRatio);
                }
              });
            }
          })
        }
        //console.log('j1',jl)
        jl.forEach(function (item) {
          item.step = cbr.data.Rows.find(function (it) {
            return it.RoleId == 'jl' && it.CheckNo == item.ix;
          });
          item.eg = eg ? cbr.data.Rows.find(function (it) {
            return it.RoleId != 'jl' && it.CheckNo == eg[0].HistoryNo;
          }) : null;
          item.zb = zb ? cbr.data.Rows.find(function (it) {
            return it.RoleId == 'zb' && it.CheckNo == zb[0].HistoryNo;
          }) : null;

          item._3rd = zb ? cbr.data.Rows.find(function (it) {
            return it.RoleId == '3rd' && it.CheckNo == zb[0].HistoryNo;
          }) : null;

          $scope.data.ps.eg = !!item.eg;
          $scope.data.ps.zb = !!item.zb;
          $scope.data.ps.eg = !!item.eg;
          $scope.data.ps._3rd = !!item._3rd


          $q.all([
            item.eg && !item.eg.load ? api.szgc.addProcessService.getAllCheckDataValue(item.eg.Id) : $q(function (r) {
              r()
            }),
            item.zb && !item.zb.load ? api.szgc.addProcessService.getAllCheckDataValue(item.zb.Id) : $q(function (r) {
              r()
            }),
            item._3rd && !item._3rd.load ? api.szgc.addProcessService.getAllCheckDataValue(item._3rd.Id) : $q(function (r) {
              r()
            })
          ]).then(
            function (rs) {
              item.eg && (item.eg.load = true);
              item.zb && (item.zb.load = true);
              /*              (item.eg = item.eg||{}).yb = [];
               (item.zb = item.zb||{}).yb = [];*/

              item.d.yb.forEach(function (yb) {
                if (yb.TargetTypeId != '018C0866-1EFA-457B-9737-7DCEFEA148F6') { //不是主控
                  var jlyb = item.d.yb.find(function (jl) {
                    return jl.TargetId == yb.TargetId;
                  });
                  //yb.points = [];
                  jlyb.egPoints = [];
                  jlyb.zbPoints = [];
                  jlyb._3rdPoints = [];
                  //item.eg.yb.push(yb);

                  var row = [];
                  rs[0] && rs[0].data.Rows.forEach(function (item) {
                    $scope.data.ps.eg1 = true;
                    if (yb.TargetId == item.TargetId) {
                      //jlyb.egPoints.push(item);
                      if (row.length == 20) {
                        //yb.points.push(row)
                        jlyb.egPoints.push(row);
                        row = [];
                        row.push(item);
                      } else {
                        row.push(item);
                      }
                    }
                  });
                  if (row.length > 0) {
                    var len = row.length;
                    while (len < 20) {
                      row.push({
                        Value: ""
                      });
                      len++;
                    }
                    jlyb.egPoints.push(row);
                  }

                  row = [];
                  rs[1] && rs[1].data.Rows.forEach(function (item) {
                    $scope.data.ps.zb1 = true;
                    if (yb.TargetId == item.TargetId) {
                      //jlyb.egPoints.push(item);
                      if (row.length == 20) {
                        //yb.points.push(row)
                        jlyb.zbPoints.push(row);
                        row = [];
                        row.push(item);
                      } else {
                        row.push(item);
                      }
                    }

                  });
                  if (row.length > 0) {
                    var len = row.length;
                    while (len < 20) {
                      row.push({
                        Value: ""
                      });
                      len++;
                    }
                    jlyb.zbPoints.push(row);
                  }

                  row = [];
                  rs[2] && rs[2].data.Rows.forEach(function (item) {
                    $scope.data.ps._3rd1 = true;
                    if (yb.TargetId == item.TargetId) {
                      //jlyb.egPoints.push(item);
                      if (row.length == 20) {
                        //yb.points.push(row)
                        jlyb._3rdPoints.push(row);
                        row = [];
                        row.push(item);
                      } else {
                        row.push(item);
                      }
                    }

                  });
                  if (row.length > 0) {
                    var len = row.length;
                    while (len < 20) {
                      row.push({
                        Value: ""
                      });
                      len++;
                    }
                    jlyb._3rdPoints.push(row);
                  }
                }
              });
            }
          );
          item.text += '/共' + jl.length + '次'
        });

        $scope.data.sources = jl;
        $scope.data.selected = jl[jl.length - 1]; //取最后一次的验收数据

        $scope.data.selected.d.yb.forEach(function (item) {
          if (item.CheckNum == 0 && item.MaxDeviation == 0 && item.PassRatio == 0) {
            item.CheckNum = undefined;
            item.MaxDeviation = undefined;
            item.PassRatio = undefined;
          }
        });
      });


      $scope.$watch('data.selected',function () {
        if ($scope.data.selected && $scope.data.selected.d) {
          var s = $scope.data.selected;
          if (!s.load) {
            s.load = true;
            api.szgc.addProcessService.getAllCheckDataValue(s.step.Id).then(function (result) {
              if (result.data.Rows.length) {
                $scope.data.ps.jl1 = true;
              }
              s.d.yb.forEach(function (yb) {
                var row = [];
                yb.points = [];
                result.data.Rows.forEach(function (item) {
                  if (yb.Id == item.CheckDataId) {
                    if (row.length == 20) {
                      yb.points.push(row)
                      row = [];
                      row.push(item);
                    } else {
                      row.push(item);
                    }

                  }
                })
                if (row.length > 0) {
                  var len = row.length;
                  while (len < 20) {
                    row.push({
                      Value: ""
                    });
                    len++;
                  }
                  yb.points.push(row);
                }
              });
            })
          }
        }
      });
    });
  }
})();
