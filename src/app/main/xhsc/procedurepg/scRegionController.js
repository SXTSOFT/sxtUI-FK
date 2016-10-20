/**
 * Created by jiuyuong on 2016/3/30.
 */
(function () {
  'use strict';

  angular
    .module('app.xhsc')
    .controller('scRegionController', scRegionController);

  /** @ngInject */
  function scRegionController($scope, $stateParams, sxt, $rootScope, xhUtils, remote, $timeout, $q, $state, $mdDialog, utils, db) {
    var vm = this,
      projectId = $stateParams.projectId,
      acceptanceItemID = $stateParams.acceptanceItemID,
      acceptanceItemName = $stateParams.acceptanceItemName,
      area = $stateParams.area,
      assessmentID = $stateParams.assessmentID,
      isReport = vm.isReport = $stateParams.isReport;
    vm.maxRegion = $stateParams.maxRegion;
    $rootScope.title = $stateParams.acceptanceItemName;
    $rootScope.sendBt = false;
    vm.maxRegion = $stateParams.maxRegion;
    vm.building = [];
    vm.nums = {
      qb: 0,
      wtj: 0,//未提交
      ytj: 0//已检查
    }
    function setNum(status, region) {
      if ((vm.maxRegion == 8 && region.RegionType == 8) || vm.maxRegion == 16 && region.RegionType >= 8) {
        vm.nums.qb++;
        switch (status) {
          case  0:
            vm.nums.wtj++;
            break;
          case  1:
            vm.nums.ytj++;
            break;
        }
      }
    }

    function load() {

      vm.nums = {
        qb: 0,
        wtj: 0,//未提交
        ytj: 0//已检查
      }

      function initRegion(region) {
        function ConvertClass(status) {
          var style;
          switch (status) {
            case 0:
              style = "wait";
              break;
            case 1:
              style = "pass";
              break;
            default:
              break;
          }
          return style;
        }

        function _init(region) {
          function setStatus(statusArr) {
            if (angular.isArray(statusArr) && statusArr.find(function (k) {
                return k == acceptanceItemID;
              })) {
              return 1;
            }
            return 0;
          }

          region.Status = setStatus(region.StatusList)
          if (region.RegionType == 4) {
            vm.building.push(region);
          }
          if (region && region.RegionType == 8 || region && region.RegionType == 16) {
            region.style = ConvertClass(region.Status);
            setNum(region.Status, region);
          }
          if (region && region.Children.length) {
            region.Children.forEach(function (r) {
              _init(r);
            });
          }
          if (region.RegionType == 4) {
            region.floors = [];
            region.Children.forEach(function (k) {
              if (!k.Children.length) {
                region.floors.push(k)
              }
            })
          }
        }

        _init(region);
      }

      vm.isRegionShow = function (region) {
        if (vm.maxRegion > 8) {
          if (region.Children && region.Children.length) {
            var f = region.Children.find(function (o) {
              return o.Status == vm.filterNum || vm.filterNum == -1;
            });
            if (f) {
              return true;
            }
          }
        }
        return region.Status == vm.filterNum || vm.filterNum == -1;
      }

      function callBack(r) {
        vm.loading = true;
        var project = r.data.data, _area;
        if (angular.isArray(project.Children)) {
          project.Children.forEach(function (k) {
            initRegion(k);
          });
        }
        vm.houses = project.Children;
        function DynamicItems() {
          /**
           * @type {!Object<?Array>} Data pages, keyed by page number (0-index).
           */
          this.loadedPages = {};

          /** @type {number} Total number of items. */
          this.numItems = 0;

          /** @const {number} Number of items to fetch per request. */
          this.PAGE_SIZE = 1;

          this.fetchNumItems_();
        };
        // Required.
        DynamicItems.prototype.getItemAtIndex = function (index) {
          var pageNumber = Math.floor(index / this.PAGE_SIZE);
          var page = this.loadedPages[pageNumber];

          if (page) {
            return page[index % this.PAGE_SIZE];
          } else if (page !== null) {
            this.fetchPage_(pageNumber);
          }
        };
        // Required.
        DynamicItems.prototype.getLength = function () {
          return this.numItems;
        };

        DynamicItems.prototype.fetchPage_ = function (pageNumber) {
          // Set the page to null so we know it is already being fetched.
          this.loadedPages[pageNumber] = null;

          // For demo purposes, we simulate loading more items with a timed
          // promise. In real code, this function would likely contain an
          // $http request.
          $timeout(angular.noop, 0).then(angular.bind(this, function () {
            this.loadedPages[pageNumber] = [];
            var pageOffset = pageNumber * this.PAGE_SIZE;
            for (var i = pageOffset; i < pageOffset + this.PAGE_SIZE; i++) {
              if (vm.building[i]) {
                this.loadedPages[pageNumber].push(vm.building[i]);
              }
            }
          }));
        };

        DynamicItems.prototype.fetchNumItems_ = function () {
          $timeout(angular.noop, 0).then(angular.bind(this, function () {
            this.numItems = vm.building.length;
          }));
        };
        vm.dynamicItems = new DynamicItems();
      }

      remote.Assessment.GetRegionTreeInfo(projectId, 'pack' + assessmentID).then(callBack);
    }

    load();

    vm.selected = function (r) {
      var routeData = {
        areaId: r.RegionID,
        regionId: r.RegionID,
        RegionName: r.RegionName,
        name: r.FullRegionName,
        regionType: r.RegionType,
        db: assessmentID,
        measureItemID: acceptanceItemID,
        pname: acceptanceItemName
      }
      $state.go('app.xhsc.scsl._sc', routeData);
    }
    //总包点击事件

    vm.zk = function (item) {
      item.show = !item.show;
    }
    vm.filterNum = isReport == '1' ? 1 : -1;
    vm.filter = function (num) {
      vm.filterNum = num;
    }
  }
})();
