(function(angular){
  'use strict';

  angular
    .module('app.szgc')
    .controller('HomeYjController', HomeYjController);

  /** @ngInject */
  function HomeYjController($stateParams, api,$q,utils,$scope,$mdDialog)
  {
    var vm = this;
    vm.isE = function (b) {
      return !vm.areas ||(b?vm.yj==vm.areas[0]:vm.yj==vm.areas[vm.areas.length-1]);
    };
    vm.setP = function (p) {
      vm.currentP = p;
      vm.currentD = null;
      vm.filter();
      vm.context.render(vm.yj.items);
    };
    vm.context = {
      onLayerClick:function (layer) {
        if(vm.currentD == layer.data){
          vm.currentD = null;
        }
        else {
          vm.currentD = layer.data;
        }
        vm.filter();
        vm.context.render(vm.yj.items);
/*        vm.context.render(vm.yj.items.filter(function (item) {
          return item.Id == layer.data.Id;
        }));*/
        $scope.$apply();
      },
      onOptions:function (options) {
        var c1 = 'rgba(225,225,225)';
        var rs = vm.results.filter(function (item) {
            return item.RegionId==options.id && (!vm.currentP || vm.currentP.id==item.ProcedureId);
          });
        if(rs.find(function (item) {
            return !!item.ZbDate && !!item.JLDate;
          })){
          c1 = 'rgb(0,150,136)'
        }
        else if(rs.find(function (item) {
            return !!item.JLDate;
          })){
          c1 = 'rgb(0,195,213)'
        }
        else if(rs.find(function (item) {
            return !!item.ZbDate;
          })){
          c1 = 'rgb(44, 157, 251)'
        }
        options = options||{};
        options.color = c1;
        if(vm.currentD && options.id == vm.currentD.Id){
          options.fillOpacity = 0.8;
        }
        options.textColor = rs.find(function (item) {
          return item.JLDate && ((item.JLLast!=0 && item.JLLast>=80) ||(item.JLFirst!=0 &&item.JLFirst>=80))
        })?'red':'black';
        return options;
      }
    };
    $q.all([
      api.szgc.vanke.yj($stateParams.itemId),
      api.szgc.BatchSetService.getAll({status:4,batchType:128})
    ]).then(function (rs) {
      var r = rs[0];
      vm.ps = rs[1].data.Rows.map(function (item) {
        return {
          id:item.ProcedureId,
          name:item.ProcedureName,
          sortName:item.Remark||item.ProcedureName
        }
      });
      vm.areas = r.data.Rows.filter(function (item) {
        return item.RegionType==128;
      }).map(function (item) {
        return {
          itemId:$stateParams.itemId+'>'+item.Id,
          itemName:$stateParams.itemName+'>'+item.RegionName,
          name:item.RegionName
        }
      });
      vm.setYj(vm.areas[0]);
    });
    vm.setYj = function (item) {
      (item.items?$q(function (r) {
        r()
      }):api.szgc.vanke.yj(item.itemId).then(function (r) {
        item.items = r.data.Rows;

      })).then(function () {
        vm.yj = item;
        var yjId = item.itemId.split('>'),
          projectId = yjId[0];
        yjId = yjId[yjId.length - 1];
        $q.all([api.szgc.addProcessService.queryByProjectAndProdure3(projectId,{
          regionIdTree: item.itemId,
          isGetChilde: 1
        }),
        api.szgc.FilesService.group(yjId)]).then(function (rs) {
          vm.results = rs[0].data.Rows;
          vm.filter();
          var fs = rs[1];
          if(fs.data.Files.length==0){
            utils.alert('未设置图纸');
          }
          else{
            vm.context.file = fs.data.Files[0].Url.replace('/s_', '/');
            vm.context.ran();
            vm.context.render(item.items);
            vm.context.resize();
          }
        });
      });

      /*if(!item.items) {
        api.szgc.vanke.yj(item.itemId).then(function (r) {
          item.items = r.data.Rows;
          vm.yj = item;
        });
      }
      else{
        vm.yj = item;
      }*/
    }

    vm.filter = function () {
      vm.rows = vm.results.filter(function (item) {
        return (!vm.currentP || vm.currentP.id==item.ProcedureId)
         &&(!vm.currentD || vm.currentD.Id==item.RegionId)
      })
    };
    vm.openView = function (batch) {
      $mdDialog.show({
        locals: {
          $stateParams: batch
        },
        controller: 'viewBathDetailController as vm',
        templateUrl: 'app/main/szgc/report/viewBathDetail-app-dlg.html',
        parent: angular.element(document.body),
        clickOutsideToClose: true,
        fullscreen: true
      })
      .then(function (answer) {

      }, function () {

      });
    }
  }

})(angular);
