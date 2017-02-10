/**
 * Created by emma on 2016/7/27.
 */
(function() {
    'use strict';

    angular
        .module('app.xhsc')
        .controller('schztbController', schztbController);

    /**@ngInject*/
    function schztbController($stateParams, $rootScope, remote) {
        var vm = this;
        var iMax = 20;
        vm.info = {
            pname: $stateParams.pname,
            name: $stateParams.name
        };
        vm.regionId = $stateParams.regionId;
        vm.AcceptanceItemID = $stateParams.measureItemID;
        $rootScope.title = vm.info.name + '(' + vm.info.pname + ')';
        vm.back = function() {
            history.back();
        }
        vm.twentyRows = [];
        vm.goBack = function() {
            window.history.go(-1);
        }
        for (var i = 0; i < 20; i++) {
            vm.twentyRows.push({});
        }
        remote.Assessment.getMeasure({
            RegionID: $stateParams.regionId, //'0001500000000010000000001',//,
            AcceptanceItemID: $stateParams.measureItemID, //'c9ba481a76644c949d13fdb14b4b4adb',//,
            RecordType: 1,
            RelationID: $stateParams.db //'a55164d5c46f454ca8df799f520bbba8'//
        }, "nodb").then(function(result) {

            console.log(result)
            var newD = [];
            vm.checkUser = result.data[0].data.checkUser;

            result.data[0].data.record.forEach(function(item) {
                //item.newList
                item.rows = item.rows ? item.rows : [];
                var arr = [];
                item.List.forEach(function(ee) {
                    if (!arr.find(function(m) {
                            return m.MeasurePointID == ee.MeasurePointID;
                        })) {
                        arr.push(ee);
                    }
                })
                item.List = arr;
                if (!item.List.length) {
                    //if(!item.newList.length){
                    //   item.List=item.List.filter(function (o) {
                    //   });
                    var rowSpan = 0,
                        t1 = 0,
                        t2 = 0,
                        tempq = [],
                        tempa = [];
                    item.Children = result.data[0].data.record.filter(function(r) {
                        if (r.ParentAcceptanceIndexID == item.AcceptanceIndexID) {
                            if (r.List.length == 0) return false;
                            r.rows = [];
                            var ps = [];
                            var numbers = [];
                            for (var i = 0; i < r.QualifiedPointNum.length; i++) {
                                var q = r.QualifiedPointNum[i].Value;
                                var p = r.UnqualifiedPointNum[i].Value;
                                tempa.push({ Role: r.QualifiedPointNum[i].Role, allDot: q + p });
                            }
                            for (var i = 0; i < r.QualifiedPointNum.length; i++) {
                                tempq.push(r.QualifiedPointNum[i]);
                            }
                            r.QualifiedRate.forEach(function(v) {
                                v.Value = v.Value * 100;
                            })
                            r.List.forEach(function(m) {
                                m.MeasureValue.forEach(function(r1) {
                                    var fstatus = m.MeasureStatus.find(function(_r) {
                                        return _r.Role == r1.Role;
                                    })
                                    if (fstatus) {
                                        r1.Status = fstatus.Value;
                                    }
                                })
                                var p = ps.find(function(p1) {
                                    return p1.ParentMeasureValueID == m.ParentMeasureValueID;
                                });
                                if (!p) {
                                    p = {
                                        ParentMeasureValueID: m.ParentMeasureValueID,
                                        ms: []
                                    };
                                    ps.push(p);
                                }
                                p.ms.push(m);
                            });
                            ps.forEach(function(p) {
                                if (p.ms.length <= 20) {
                                    r.rows.push(p.ms);
                                } else {
                                    var ms = [];
                                    p.ms.forEach(function(m) {
                                        if (ms.length < 20) {
                                            ms.push(m);
                                        } else {
                                            item.rows.push(ms);
                                            ms = [m];
                                        }
                                    });
                                    r.rows.push(ms);
                                }
                            });
                            r.rows.forEach(function(ms) {
                                while (ms.length < 20) {
                                    ms.push({});
                                }
                            });
                            rowSpan += r.rows.length;
                            return true;
                        }
                        return false;
                    });
                    item.rowSpan = rowSpan;
                    newD.push(item);
                    var atemp = [],
                        btemp = [];
                    if (tempa) {
                        for (var i = 0; i < tempa.length; i++) {
                            var f = atemp.find(function(t) {
                                return t.Role == tempa[i].Role;
                            })
                            if (!f) {
                                f = {
                                    Role: tempa[i].Role,
                                    t: tempa[i].allDot
                                }
                                atemp.push(f)
                            } else {
                                f.t += tempa[i].allDot
                            }
                        }
                    }
                    if (tempq) {
                        for (var i = 0; i < tempq.length; i++) {
                            var f = btemp.find(function(t) {
                                return t.Role == tempa[i].Role;
                            })
                            if (!f) {
                                f = {
                                    Role: tempq[i].Role,
                                    t: tempq[i].Value
                                }
                                btemp.push(f)
                            } else {
                                f.t += tempq[i].Value
                            }
                        }
                    }
                    var arra = [],
                        arrb = [];
                    for (var i = 0; i < btemp.length; i++) {
                        var a = btemp[i].t / atemp[i].t;
                        arra.push({ Role: btemp[i].Role, Value: a });
                    }
                    for (var i = 0; i < atemp.length; i++) {
                        var a = btemp[i].t + '/' + atemp[i].t;
                        arrb.push({ Role: btemp[i].Role, Value: a });
                    }
                    item.allDot = arrb;
                    item.Qual = arra;
                    //console.log(btemp);
                    //item.allDot = item.allDot;
                } else if (!item.ParentAcceptanceIndexID) {

                    var roles = [];
                    item.rows = [];
                    var ps = [];
                    item.QualifiedRate.forEach(function(v) {
                        v.Value = v.Value * 100;
                        var f = roles.find(function(r) {
                            return r.Role == v.Role;
                        })
                        if (!f) {
                            roles.push({ Role: v.Role });
                        }
                    })

                    var numbers = [];
                    for (var i = 0; i < item.QualifiedPointNum.length; i++) {
                        var q = item.QualifiedPointNum[i].Value;
                        var p = item.UnqualifiedPointNum[i].Value;
                        numbers.push({ Role: item.QualifiedPointNum[i].Role, allDot: q + '/' + p });
                    }
                    item.numbers = numbers;

                    item.List.forEach(function(m) {
                        var exist = 0;
                        roles.forEach(function(r) {
                            var f = m.ExtendedField1 && m.ExtendedField1.find(function(_r) {
                                return _r.Role == r.Role;
                            })
                            if (!f) {
                                m.ExtendedField1 && m.ExtendedField1.push({ Role: r.Role, Value: ',' })
                            }
                        })
                        m.ExtendedField1 && m.ExtendedField1.forEach(function(fileds) {
                            var i = fileds.Value.indexOf(',')
                            if (i > 0) {
                                exist = 1;
                            }
                        })
                        if (!exist) {
                            m.MeasureValue.forEach(function(r) {
                                var fi = m.MeasureStatus.find(function(_r) {
                                    return _r.Role == r.Role;
                                })
                                if (fi) {
                                    r.Status = fi.Value;
                                }
                            })
                        }

                        var p = ps.find(function(p1) {
                            return p1.ParentMeasureValueID == m.ParentMeasureValueID;
                        });
                        if (!p) {
                            p = {
                                ParentMeasureValueID: m.ParentMeasureValueID,
                                ms: []
                            };
                            ps.push(p);
                        }

                        if (exist) {
                            var max = 0,
                                nums = [];
                            for (var i = 0; i < m.ExtendedField1.length; i++) {
                                if (m.ExtendedField1[i].Value.indexOf(',')) {
                                    var num = m.ExtendedField1[i].Value.split(',');
                                    nums.push(num);
                                    if (num.length > max) max = num.length;
                                }
                            }
                            //console.log(nums)
                            var values = [];
                            for (var i = 0; i < max; i++) {
                                var temp = [];
                                for (var j = 0; j < roles.length; j++) {
                                    temp.push({ Role: roles[j].Role, Value: nums[j] && nums[j][i] || '', Status: m.MeasureStatus[j] && m.MeasureStatus[j].Value });
                                }
                                values.push(temp);
                            }
                            values.forEach(function(v) {
                                p.ms.push({
                                    MeasureValue: v,
                                    MeasureValueId: m.MeasureValueId[0].Value
                                });
                            });
                            p.ParentMeasureValueID = m.MeasureValueId;
                            m.ExtendedField1.forEach(function(fs, index) {})

                        } else {
                            p.ms.push(m);
                            if (item.IndexName.indexOf('尺寸一致性') != -1) {
                                m.MeasureValue.forEach(function(_r, index) {
                                        _r.Value = _r.Value + '/' + m.DesignValue[index].Value;
                                    })
                                    //m.MeasureValue = m.MeasureValue + '<br/>' + m.DesignValue;
                                    // m.MeasureValue = m.MeasureValue;
                            }
                        }
                    });
                    ps.forEach(function(p) {
                        if (p.ms.length <= 20) {
                            item.rows.push(p.ms);
                        } else {
                            var ms = [];
                            p.ms.forEach(function(m) {
                                if (ms.length < 20) {
                                    ms.push(m);
                                } else {
                                    item.rows.push(ms);
                                    ms = [m];
                                }
                            });
                            item.rows.push(ms);
                        }
                    });
                    item.rows.forEach(function(ms) {
                        while (ms.length < 20) {
                            ms.push({});
                        }
                    })
                    newD.push(item);
                }


                //修正
                // var role=[];
                // item.QualifiedRate.forEach(function (ee) {
                //   role.push(ee.Role);
                // });

                // buildSource(item,role);
                // function  buildSource(item,role) {
                //   var len= Math.ceil(item.List.length/20)
                //   item.pointArr=[];
                //   var arr;
                //   for (var i=0;i<len;i++){
                //     arr=item.List.slice(i*20,i*20+20);
                //     item.pointArr.push(arr)
                //   }
                // }



                // function  buildSource(item,role) {
                //   var zb=item.List.filter(function (w) {
                //     return w.MeasureValue.find(function (n) {
                //       return n.Role==0;
                //     })
                //   });
                //   zb.forEach(function (o) {
                //       o.MeasureValue=o.MeasureValue.filter(function (t) {
                //           return t.Role==0;
                //       });
                //   });
                //   item.pointArr=[]
                //   var zbArr=[];
                //   var arr;
                //   var len= Math.ceil(zb.length/20)
                //   for (var i=0;i<len;i++){
                //     arr=zb.slice(i*20,i*20+20);
                //     zbArr.push(arr);
                //     item.pointArr.push(arr)
                //   }
                //
                //   var jl=item.List.filter(function (w) {
                //     return w.MeasureValue.find(function (n) {
                //       return n.Role==2;
                //     })
                //   });
                //   jl.forEach(function (o) {
                //     o.MeasureValue=o.MeasureValue.filter(function (t) {
                //       return t.Role==2;
                //     });
                //   });
                //   var jlArr=[];
                //   len= Math.ceil(jl.length/20)
                //   for (var i=0;i<len;i++){
                //     arr=jl.slice(i*20,i*20+20);
                //     jlArr.push(arr);
                //     item.pointArr.push(arr)
                //   }
                //
                //
                //   var  xmb=item.List.filter(function (w) {
                //     return w.MeasureValue.find(function (n) {
                //       return n.Role==4;
                //     })
                //   });
                //   xmb.forEach(function (o) {
                //     o.MeasureValue=o.MeasureValue.filter(function (t) {
                //       return t.Role==4;
                //     });
                //   });
                //   var xmbArr=[];
                //   len= Math.ceil(xmb.length/20)
                //   for (var i=0;i<len;i++){
                //     arr=jl.slice(i*20,i*20+20);
                //     xmbArr.push(arr);
                //     item.pointArr.push(arr)
                //   }
                //
                //   item.points={
                //     zbArr:zbArr,
                //     jlArr:jlArr,
                //     xmbArr:xmbArr
                //   }
                //
                //
                //   item.maxRow=xmbArr.length+jlArr.length+zbArr.length;
                // }
            });
            vm.scData = newD;
        });

        vm.printBatchCount = function() {
            // var $html = $("#divReport").clone(false);
            // $html.find('table tr[name="tRow"]').remove();
            // console.log($html.html())
            $('#export').val($("#divReport").html());
        }


    }
})();