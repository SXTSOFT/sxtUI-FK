/**
 * Created by UUI on 2016/9/27.
 */
(function(angular,undefined){
  'use strict';

  angular
    .module('app.plan')
    .component('planGantt',{
      templateUrl:'app/main/plan/component/plan-gantt.html',
      controller:plangantt,
      controllerAs:'vm'
    });

  /** @ngInject */
  function plangantt($mdDialog, $document, $animate, $scope, $timeout, ganttUtils, GanttObjectModel, ganttDebounce, moment, $window, $mdSidenav){
    var vm = this;
    var objectModel;
    var Tasks = [
      {
        "id": "65c3e993-7cc4-42df-4689-83483df39488",
        "name": "Milestones",
        "height": "3em",
        "classes": [],
        "tasks": [
          {
            "id": "337b2f4d-db44-96a4-eeca-daa741d3b6d1",
            "name": "Kickoff",
            "classes": [],
            "from": "2016-02-07T06:00:00.000Z",
            "to": "2016-02-07T07:00:00.000Z",
            "data": "Can contain any custom data or object"
          },
          {
            "id": "4053f65a-712c-97dc-8d41-98e72cec2ddd",
            "name": "Concept approval",
            "classes": [],
            "from": "2016-02-18T15:00:00.000Z",
            "to": "2016-02-18T15:00:00.000Z",
            "est": "2016-02-16T04:00:00.000Z",
            "lct": "2016-02-18T21:00:00.000Z"
          },
          {
            "id": "89bb5cf8-76d8-3d9a-2f47-25de3d9871ba",
            "name": "Development finished",
            "classes": [],
            "from": "2016-03-15T16:00:00.000Z",
            "to": "2016-03-15T16:00:00.000Z"
          },
          {
            "id": "dfb005b7-b35e-53fb-7797-accae48015bb",
            "name": "Shop is running",
            "classes": [],
            "from": "2016-03-22T10:00:00.000Z",
            "to": "2016-03-22T10:00:00.000Z"
          },
          {
            "id": "d7373b38-3140-45cf-40e8-de175821c147",
            "name": "Go-live",
            "classes": [],
            "from": "2016-03-29T14:00:00.000Z",
            "to": "2016-03-29T14:00:00.000Z"
          }
        ],
        "data": "Can contain any custom data or object"
      },
      {
        "id": "292a86cf-a3e0-20f2-9dda-cd8ee40d581e",
        "name": "Status meetings",
        "classes": [
          "",
          "md-light-blue-100-bg"
        ],
        "tasks": [
          {
            "id": "de06b136-7d7b-8331-01fc-00c95e85be94",
            "name": "Demo #1",
            "classes": [],
            "from": "2016-02-25T12:00:00.000Z",
            "to": "2016-02-25T15:30:00.000Z"
          },
          {
            "id": "d5994627-80b7-97f3-116f-fe48155c7ddc",
            "name": "Demo #2",
            "classes": [],
            "from": "2016-03-01T13:00:00.000Z",
            "to": "2016-03-01T16:00:00.000Z"
          },
          {
            "id": "60085ede-2901-61be-d955-5b6aea84ad10",
            "name": "Demo #3",
            "classes": [],
            "from": "2016-03-08T13:00:00.000Z",
            "to": "2016-03-08T16:00:00.000Z"
          },
          {
            "id": "22fb1976-9326-d6f0-de04-61a7a5a46823",
            "name": "Demo #4",
            "classes": [],
            "from": "2016-03-15T13:00:00.000Z",
            "to": "2016-03-15T16:00:00.000Z"
          },
          {
            "id": "3e9cfa12-85c8-331c-1a08-9f1bef9167aa",
            "name": "Demo #5",
            "classes": [],
            "from": "2016-03-24T07:00:00.000Z",
            "to": "2016-03-24T08:00:00.000Z"
          }
        ]
      },
      {
        "id": "ee8b5e3f-65e0-ce92-41f5-eae3f4e61c3c",
        "name": "Kickoff",
        "classes": [],
        "tasks": [
          {
            "id": "b855064f-683f-e137-bdeb-69541cbc0690",
            "name": "Day 1",
            "classes": [],
            "from": "2016-02-07T06:00:00.000Z",
            "to": "2016-02-07T14:00:00.000Z",
            "progress": 50
          },
          {
            "id": "39c7dcf0-50a0-4a56-13f0-6e61cac5b76d",
            "name": "Day 2",
            "classes": [],
            "from": "2016-02-08T06:00:00.000Z",
            "to": "2016-02-08T14:00:00.000Z"
          },
          {
            "id": "1368f5ef-180d-2cd5-05c4-275b2fe70a15",
            "name": "Day 3",
            "classes": [],
            "from": "2016-02-09T05:30:00.000Z",
            "to": "2016-02-09T09:00:00.000Z"
          }
        ]
      },
      {
        "id": "5506e0f5-a1e1-668d-67e8-e04bad341071",
        "name": "Create concept",
        "classes": [],
        "tasks": [
          {
            "id": "3499e5df-a8b3-e55a-f3de-8ae1642a51d8",
            "name": "Create concept",
            "classes": [
              "",
              "md-light-green-200-bg"
            ],
            "priority": 20,
            "from": "2016-02-10T05:00:00.000Z",
            "to": "2016-02-16T15:00:00.000Z",
            "est": "2016-02-08T05:00:00.000Z",
            "lct": "2016-02-18T17:00:00.000Z",
            "progress": 100
          }
        ]
      },
      {
        "id": "e4c362b2-0a9d-bbd4-219f-3cc71cc6d503",
        "name": "Finalize concept",
        "classes": [],
        "tasks": [
          {
            "id": "1d5964af-f770-eb0a-862c-b14894a69413",
            "name": "Finalize concept",
            "classes": [
              "",
              "md-light-blue-200-bg"
            ],
            "priority": 10,
            "from": "2016-02-17T05:00:00.000Z",
            "to": "2016-02-18T15:00:00.000Z",
            "progress": 100
          }
        ]
      },
      {
        "id": "2d3964af-f270-eb0a-882c-b12894a69411",
        "name": "Development",
        "classes": []
      },
      {
        "id": "73caeb1f-46c3-71ab-b028-43acd52c6def",
        "name": "Sprint 1",
        "classes": [],
        "parent": "2d3964af-f270-eb0a-882c-b12894a69411",
        "tooltips": false,
        "tasks": [
          {
            "id": "76caeb1f-16c3-71ab-b028-23acd52c6deh",
            "name": "Product list view",
            "classes": [
              "",
              "md-yellow-200-bg"
            ],
            "from": "2016-02-21T05:00:00.000Z",
            "to": "2016-02-25T12:00:00.000Z",
            "progress": 25,
            "dependencies": [
              {
                "to": "7fac4238-ae6b-8e72-a293-45f6dd87cae2"
              },
              {
                "from": "1d5964af-f770-eb0a-862c-b14894a69413"
              }
            ]
          }
        ]
      },
      {
        "id": "7fbc4038-ae6b-8e72-a293-85f6dd37cae1",
        "name": "Sprint 2",
        "classes": [],
        "parent": "2d3964af-f270-eb0a-882c-b12894a69411",
        "tasks": [
          {
            "id": "7fac4238-ae6b-8e72-a293-45f6dd87cae2",
            "name": "Order basket",
            "classes": [
              "",
              "md-orange-200-bg"
            ],
            "from": "2016-02-28T06:00:00.000Z",
            "to": "2016-03-01T13:00:00.000Z",
            "dependencies": [
              {
                "to": "4c530976-5518-0cea-a0f8-73e6ceab2af2"
              }
            ]
          }
        ]
      },
      {
        "id": "4c530976-5818-0cea-a0c8-23e6ceab2af6",
        "name": "Sprint 3",
        "classes": [],
        "parent": "2d3964af-f270-eb0a-882c-b12894a69411",
        "tasks": [
          {
            "id": "4c530976-5518-0cea-a0f8-73e6ceab2af2",
            "name": "Checkout",
            "classes": [
              "",
              "md-red-200-bg"
            ],
            "from": "2016-03-04T06:00:00.000Z",
            "to": "2016-03-08T13:00:00.000Z",
            "dependencies": [
              {
                "to": "fdbwa107-8f35-18xa-393b-2723a7fb0fe2"
              }
            ]
          }
        ]
      },
      {
        "id": "fdbda107-8f35-18aa-393b-2023a7fb0fe3",
        "name": "Sprint 4",
        "classes": [],
        "tasks": [
          {
            "id": "fdbwa107-8f35-18xa-393b-2723a7fb0fe2",
            "name": "Login & Signup & Admin Views",
            "classes": [],
            "from": "2016-03-11T06:00:00.000Z",
            "to": "2016-03-15T13:00:00.000Z",
            "dependencies": [
              {
                "to": "95c8dab4-ed9f-5bfa-b79d-6fe578e58661"
              },
              {
                "to": "11s98174-23b1-1f9e-f3b5-534b03415d42"
              }
            ]
          }
        ]
      },
      {
        "id": "13c055b1-00b4-941d-deac-6d0cf466cb6a",
        "name": "Hosting",
        "classes": [
          "",
          "md-pink-100-bg"
        ]
      },
      {
        "id": "26c8dab4-ed9f-5baa-b79d-6fe578e58660",
        "name": "Setup",
        "classes": [],
        "tasks": [
          {
            "id": "95c8dab4-ed9f-5bfa-b79d-6fe578e58661",
            "name": "HW",
            "classes": [],
            "from": "2016-03-18T06:00:00.000Z",
            "to": "2016-03-18T10:00:00.000Z"
          }
        ]
      },
      {
        "id": "41b98144-23b1-1f9e-f3b5-534b03415d41",
        "name": "Config",
        "classes": [],
        "tasks": [
          {
            "id": "11s98174-23b1-1f9e-f3b5-534b03415d42",
            "name": "SW / DNS/ Backups",
            "classes": [],
            "from": "2016-03-18T10:00:00.000Z",
            "to": "2016-03-21T16:00:00.000Z"
          }
        ]
      },
      {
        "id": "a4d82cdc-d314-d6ef-7d28-c98436bdc1d8",
        "name": "Server",
        "parent": "Hosting",
        "children": [
          "Setup",
          "Config"
        ]
      },
      {
        "id": "1eb1f430-06ad-437f-56d1-37fb27bce498",
        "name": "Deployment",
        "classes": [],
        "parent": "Hosting",
        "tasks": [
          {
            "id": "8b70c903-e942-1a72-c5f1-8c7002908ee7",
            "name": "Depl. & Final testing",
            "classes": [],
            "from": "2016-03-21T06:00:00.000Z",
            "to": "2016-03-22T10:00:00.000Z"
          }
        ]
      },
      {
        "id": "b52daea6-e12c-9e8b-5c75-957f4a6bcab1",
        "name": "Workshop",
        "classes": [],
        "tasks": [
          {
            "id": "3e8c8b19-abf3-a045-1958-518390de443a",
            "name": "On-side education",
            "classes": [],
            "from": "2016-03-24T07:00:00.000Z",
            "to": "2016-03-25T13:00:00.000Z"
          }
        ]
      },
      {
        "id": "ba5d20bf-d0f3-ec3a-3331-da0623e00bd2",
        "name": "Content",
        "classes": [],
        "tasks": [
          {
            "id": "92e8d627-772c-4f05-d886-5a838040ab99",
            "name": "Supervise content creation",
            "classes": [],
            "from": "2016-03-26T07:00:00.000Z",
            "to": "2016-03-29T14:00:00.000Z"
          }
        ]
      },
      {
        "id": "da9d9b10-2832-5357-4d3e-dec83999216d",
        "name": "Documentation",
        "classes": [],
        "tasks": [
          {
            "id": "71e15512-3910-6515-0586-39cc22646ede",
            "name": "Technical/User documentation",
            "classes": [],
            "from": "2016-03-26T06:00:00.000Z",
            "to": "2016-03-28T16:00:00.000Z"
          }
        ]
      }
    ];


    var Timespans =  [{
      "from": "2013-10-21T05:00:00.000Z",
      "to": "2013-10-25T12:00:00.000Z",
      "name": "Sprint 1 Timespan"
    }];
    vm.data = Tasks;
    vm.timespans = Timespans;

    // Data
    vm.live = {};
    vm.options = {
      mode                    : 'custom',
      scale                   : 'day',
      sortMode                : undefined,
      sideMode                : 'Tree',
      daily                   : true,
      maxHeight               : 300,
      width                   : true,
      zoom                    : 1,
      rowSortable             : true,
      columns                 : ['model.name', 'from', 'to'],
      treeTableColumns        : ['from', 'to'],
      columnsHeaders          : {
        'model.name': 'Name',
        'from'      : 'Start Time',
        'to'        : 'End Time'
      },
      columnsClasses          : {
        'model.name': 'gantt-column-name',
        'from'      : 'gantt-column-from',
        'to'        : 'gantt-column-to'
      },
      columnsFormatters       : {
        'from': function (from)
        {
          return angular.isDefined(from) ? from.format('lll') : undefined;
        },
        'to'  : function (to)
        {
          return angular.isDefined(to) ? to.format('lll') : undefined;
        }
      },
      treeHeaderContent       : '{{getHeader()}}',
      treeHeader:'abc',
      columnsHeaderContents   : {
        'model.name': '{{getHeader()}}',
        'from'      : '{{getHeader()}}',
        'to'        : '{{getHeader()}}'
      },
      autoExpand              : 'both',
      taskOutOfRange          : 'truncate',
      fromDate                : '',
      toDate                  : '',
      rowContentEnabled       : true,
      rowContent              : '{{row.model.name}}',
      taskContentEnabled      : true,
      taskContent             : '<i ng-click="scope.vm.editDialog($event, \'task\', task)" class="gantt-task-edit-button icon-pencil s12 icon"\n   aria-label="edit task">\n</i>\n<span class="gantt-task-name">\n    {{task.model.name}}\n    <md-tooltip md-direction="top" class="gantt-chart-task-tooltip">\n        <div layout="column" layout-align="center center">\n            <div class="tooltip-name">\n                {{task.model.name}}\n            </div>\n            <div class="tooltip-date">\n                <span>\n                    {{task.model.from.format(\'MMM DD, HH:mm\')}}\n                </span>\n                <span>-</span>\n                <span>\n                    {{task.model.to.format(\'MMM DD, HH:mm\')}}\n                </span>\n            </div>\n        </div>\n    </md-tooltip>\n</span>',
      allowSideResizing       : false,
      labelsEnabled           : true,
      currentDate             : 'line',
      currentDateValue        : new Date(),
      draw                    : true,
      readOnly                : false,
      groupDisplayMode        : 'group',
      filterTask              : '',
      filterRow               : '',
      timeFrames              : {
        'day'    : {
          start  : moment('8:00', 'HH:mm'),
          end    : moment('20:00', 'HH:mm'),
          working: true,
          default: true
        },
        'noon'   : {
          start  : moment('12:00', 'HH:mm'),
          end    : moment('13:30', 'HH:mm'),
          working: false,
          default: true
        },
        'weekend': {
          working: false
        },
        'holiday': {
          working: false,
          color  : 'red',
          classes: ['gantt-timeframe-holiday']
        }
      },
      dateFrames              : {
        'weekend'    : {
          evaluator: function (date)
          {
            return date.isoWeekday() === 6 || date.isoWeekday() === 7;
          },
          targets  : ['weekend']
        },
        '11-november': {
          evaluator: function (date)
          {
            return date.month() === 10 && date.date() === 11;
          },
          targets  : ['holiday']
        }
      },
      timeFramesWorkingMode   : 'hidden',
      timeFramesNonWorkingMode: 'visible',
      columnMagnet            : '15 minutes',
      timeFramesMagnet        : true,
      dependencies            : true,
      canDraw                 : function (event)
      {
        var isLeftMouseButton = event.button === 0 || event.button === 1;
        return vm.options.draw && !vm.options.readOnly && isLeftMouseButton;
      },
      drawTaskFactory         : function ()
      {
        return {
          id   : ganttUtils.randomUuid(),  // Unique id of the task.
          name : 'Drawn task', // Name shown on top of each task.
          color: '#AA8833' // Color of the task in HEX format (Optional).
        };
      },
      api                     : function (ganttApi)
      {
        // API Object is used to control methods and events from angular-gantt.
        vm.api = ganttApi;

        vm.api.core.on.ready($scope, function ()
        {
          // When gantt is ready, load data.
          // `data` attribute could have been used too.
          vm.load();

          // DOM events
          vm.api.directives.on.new($scope, function (directiveName, directiveScope, element)
          {
            /**
             * Gantt Task
             */
            if ( directiveName === 'ganttTask' )
            {
              element.on('mousedown touchstart', function (event)
              {
                event.preventDefault();
                event.stopPropagation();
                vm.live.row = directiveScope.task.row.model;
                if ( angular.isDefined(directiveScope.task.originalModel) )
                {
                  vm.live.task = directiveScope.task.originalModel;
                }
                else
                {
                  vm.live.task = directiveScope.task.model;
                }
                $scope.$digest();
              });

            }

            /**
             * Gantt Row
             */
            else if ( directiveName === 'ganttRow' )
            {

              element.on('click', function (event)
              {
                event.stopPropagation();
              });

              element.on('mousedown touchstart', function (event)
              {
                event.stopPropagation();
                vm.live.row = directiveScope.row.model;
                $scope.$digest();
              });

            }

            /**
             * Gantt Row Label
             */
            else if ( directiveName === 'ganttRowLabel' )
            {
              // Fix for double trigger due to gantt-sortable plugin
              element.off('click');

              element.on('click', function (event)
              {
                event.preventDefault();
                editDialog(event, 'row', directiveScope.row);
              });

              element.on('mousedown touchstart', function ()
              {
                vm.live.row = directiveScope.row.model;
                $scope.$digest();
              });

            }
          });

          vm.api.tasks.on.rowChange($scope, function (task)
          {
            vm.live.row = task.row.model;
          });

          objectModel = new GanttObjectModel(vm.api);
        });
      }
    };

    // Methods
    vm.toggleSidenav = toggleSidenav;
    vm.search = search;
    vm.setSortMode = setSortMode;
    vm.addDialog = addDialog;
    vm.editDialog = editDialog;
    vm.canAutoWidth = canAutoWidth;
    vm.getColumnWidth = getColumnWidth;
    vm.load = load;
    vm.reload = reload;

    //////////

    init();

    /**
     * Initialize
     */
    function init()
    {
      // Set Gantt Chart height at the init
      calculateHeight();

      angular.element($window).on('resize', function ()
      {
        $scope.$apply(function ()
        {
          calculateHeight();
        });
      });
    }

    /**
     * Max Height Fix
     */
    function calculateHeight()
    {
      vm.options.maxHeight = $document.find('#chart-container').offsetHeight;
    }

    /**
     * Add New Row
     */
    function addDialog(ev)
    {
      $mdDialog.show({
        controller         : 'GanttChartAddEditDialogController',
        controllerAs       : 'vm',
        templateUrl        : 'app/main/apps/gantt-chart/dialogs/add-edit/add-dialog.html',
        parent             : angular.element($document.body),
        targetEvent        : ev,
        clickOutsideToClose: true,
        locals             : {
          dialogData: {
            chartData : vm.data,
            dialogType: 'add'
          }
        }
      });
    }

    /**
     * Edit Dialog
     */
    function editDialog(ev, formView, formData)
    {
      $mdDialog.show({
        controller         : 'GanttChartAddEditDialogController',
        controllerAs       : 'vm',
        templateUrl        : 'app/main/apps/gantt-chart/dialogs/add-edit/edit-dialog.html',
        parent             : angular.element($document.body),
        targetEvent        : ev,
        clickOutsideToClose: true,
        locals             : {
          dialogData: {
            chartData : vm.data,
            dialogType: 'edit',
            formView  : formView,
            formData  : formData
          }
        }
      });
    }

    /**
     * Toggle sidenav
     *
     * @param sidenavId
     */
    function toggleSidenav(sidenavId)
    {
      $mdSidenav(sidenavId).toggle();
    }

    /**
     * Search
     * @param sidenavId
     */
    function search(option, keyword)
    {
      if ( option === 'rows' )
      {
        vm.options.filterRow = keyword;
      }
      else if ( option === 'tasks' )
      {
        vm.options.filterTask = keyword;
      }
    }

    /**
     * Sort Mode
     * @param mode
     */
    function setSortMode(mode)
    {
      vm.options.sortMode = mode;

      if ( angular.isUndefined(mode) )
      {
        vm.options.rowSortable = true;
      }
      else
      {
        vm.options.rowSortable = false;
      }
    }

    /**
     * Side Mode
     */
    $scope.$watch('vm.options.sideMode', function (newValue, oldValue)
    {
      if ( newValue !== oldValue )
      {
        vm.api.side.setWidth(undefined);

        $timeout(function ()
        {
          vm.api.columns.refresh();
        });
      }
    });

    function canAutoWidth(scale)
    {
      if ( scale.match(/.*?hour.*?/) || scale.match(/.*?minute.*?/) )
      {
        return false;
      }

      return true;
    }

    function getColumnWidth(widthEnabled, scale, zoom)
    {
      if ( !widthEnabled && vm.canAutoWidth(scale) )
      {
        return undefined;
      }

      if ( scale.match(/.*?week.*?/) )
      {
        return 150 * zoom;
      }

      if ( scale.match(/.*?month.*?/) )
      {
        return 300 * zoom;
      }

      if ( scale.match(/.*?quarter.*?/) )
      {
        return 500 * zoom;
      }

      if ( scale.match(/.*?year.*?/) )
      {
        return 800 * zoom;
      }

      return 40 * zoom;
    }

    // Reload data action
    function load()
    {
      //todo:绑定需要的数据
      vm.data = Tasks;
      vm.timespans = Timespans;

      // Fix for Angular-gantt-chart issue
      $animate.enabled(true);
      $animate.enabled($document.find('#gantt'), false);

    }

    /**
     * Reload Data
     */
    function reload()
    {
    //   msApi.resolve('ganttChart.tasks@get', function (response)
    // {
    //   vm.data = response.data;
    // });
    //
    //   msApi.resolve('ganttChart.timespans@get', function (response)
    //   {
    //     vm.timespans = response.data;
    //   });
    }

    // Visual two way binding.
    var ganttDebounceValue = 1000;

    var listenTaskJson = ganttDebounce(function (taskJson)
    {
      if ( angular.isDefined(taskJson) )
      {
        var task = angular.fromJson(taskJson);
        objectModel.cleanTask(task);
        var model = vm.live.task;
        angular.extend(model, task);
      }
    }, ganttDebounceValue);

    $scope.$watch('vm.live.taskJson', listenTaskJson);

    var listenRowJson = ganttDebounce(function (rowJson)
    {
      if ( angular.isDefined(rowJson) )
      {
        var row = angular.fromJson(rowJson);
        objectModel.cleanRow(row);
        var tasks = row.tasks;

        delete row.tasks;
        var rowModel = vm.live.row;

        angular.extend(rowModel, row);

        var newTasks = {};
        var i, l;

        if ( angular.isDefined(tasks) )
        {
          for ( i = 0, l = tasks.length; i < l; i++ )
          {
            objectModel.cleanTask(tasks[i]);
          }

          for ( i = 0, l = tasks.length; i < l; i++ )
          {
            newTasks[tasks[i].id] = tasks[i];
          }

          if ( angular.isUndefined(rowModel.tasks) )
          {
            rowModel.tasks = [];
          }

          for ( i = rowModel.tasks.length - 1; i >= 0; i-- )
          {
            var existingTask = rowModel.tasks[i];
            var newTask = newTasks[existingTask.id];

            if ( angular.isUndefined(newTask) )
            {
              rowModel.tasks.splice(i, 1);
            }
            else
            {
              objectModel.cleanTask(newTask);
              angular.extend(existingTask, newTask);

              delete newTasks[existingTask.id];
            }
          }
        }
        else
        {
          delete rowModel.tasks;
        }

        angular.forEach(newTasks, function (newTask)
        {
          rowModel.tasks.push(newTask);
        });
      }
    }, ganttDebounceValue);

    $scope.$watch('vm.live.rowJson', listenRowJson);

    $scope.$watchCollection('vm.live.task', function (task)
    {
      vm.live.taskJson = angular.toJson(task, true);
      vm.live.rowJson = angular.toJson(vm.live.row, true);
    });

    $scope.$watchCollection('vm.live.row', function (row)
    {
      vm.live.rowJson = angular.toJson(row, true);
      if ( angular.isDefined(row) && angular.isDefined(row.tasks) && row.tasks.indexOf(vm.live.task) < 0 )
      {
        vm.live.task = row.tasks[0];
      }
    });

    $scope.$watchCollection('vm.live.row.tasks', function ()
    {
      vm.live.rowJson = angular.toJson(vm.live.row, true);
    });
  }
})(angular,undefined);
