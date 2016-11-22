/**
 * Created by emma on 2016/11/21.
 */
(function(){
  'use strict';

  angular
    .module('app.plan')
    .component('planReport',{
      templateUrl:'app/main/plan/component/plan-report.html',
      controller:planReportController,
      controllerAs:'vm'
    });

  /**@ngInject*/
  function planReportController(){
    var vm = this;
    vm.data = {
      "CompanyStatisticss": [
        {
          "CompanyId": "1",
          "CompanyName": "星河",
          "ProjectStatisticss": [
            {
              "ProjectId": "101",
              "ProjectName": "星河一期",
              "SectionStatisticss": [
                {
                  "SectionId": "10101",
                  "SectionName": "一标",
                  "TaskStatisticss": [
                    {
                      "SectionID": "10101",
                      "BuildingId": "10101",
                      "BuildName": "10101",
                      "TaskId": "10101",
                      "TaskName": "一标task1",
                      "ScheduledEndTime": "2016-11-21T07:37:52.594Z",
                      "ActualEndTime": "2016-11-21T07:37:52.594Z",
                      "CompleteStatus": "AdvanceComplete",
                      "DelayDays": 0,
                      "NextTaskId": "10101",
                      "NextTaskName": "10101",
                      "NextTaskDuration": 0
                    },
                    {
                      "SectionID": "10101",
                      "BuildingId": "10103",
                      "BuildName": "10103",
                      "TaskId": "10103",
                      "TaskName": "一标task2",
                      "ScheduledEndTime": "2016-11-21T07:37:52.594Z",
                      "ActualEndTime": "2016-11-21T07:37:52.594Z",
                      "CompleteStatus": "AdvanceComplete",
                      "DelayDays": 0,
                      "NextTaskId": "10103",
                      "NextTaskName": "10103",
                      "NextTaskDuration": 0
                    }
                  ]
                },{
                  "SectionId": "10201",
                  "SectionName": "二标",
                  "TaskStatisticss": [
                    {
                      "SectionID": "10201",
                      "BuildingId": "10201",
                      "BuildName": "10201",
                      "TaskId": "10201",
                      "TaskName": "10201",
                      "ScheduledEndTime": "2016-11-21T07:37:52.594Z",
                      "ActualEndTime": "2016-11-21T07:37:52.594Z",
                      "CompleteStatus": "AdvanceComplete",
                      "DelayDays": 0,
                      "NextTaskId": "10201",
                      "NextTaskName": "10201",
                      "NextTaskDuration": 0
                    },
                    {
                      "SectionID": "10201",
                      "BuildingId": "10203",
                      "BuildName": "10203",
                      "TaskId": "10203",
                      "TaskName": "10203",
                      "ScheduledEndTime": "2016-11-21T07:37:52.594Z",
                      "ActualEndTime": "2016-11-21T07:37:52.594Z",
                      "CompleteStatus": "AdvanceComplete",
                      "DelayDays": 0,
                      "NextTaskId": "10203",
                      "NextTaskName": "10203",
                      "NextTaskDuration": 0
                    }
                  ]
                }
              ]
            },{
              "ProjectId": "201",
              "ProjectName": "星河二期",
              "SectionStatisticss": [
                {
                  "SectionId": "20101",
                  "SectionName": "20101",
                  "TaskStatisticss": [
                    {
                      "SectionID": "20101",
                      "BuildingId": "20101",
                      "BuildName": "20101",
                      "TaskId": "20101",
                      "TaskName": "20101",
                      "ScheduledEndTime": "2016-11-21T07:37:52.594Z",
                      "ActualEndTime": "2016-11-21T07:37:52.594Z",
                      "CompleteStatus": "AdvanceComplete",
                      "DelayDays": 0,
                      "NextTaskId": "20101",
                      "NextTaskName": "20101",
                      "NextTaskDuration": 0
                    },
                    {
                      "SectionID": "20101",
                      "BuildingId": "20103",
                      "BuildName": "20103",
                      "TaskId": "20103",
                      "TaskName": "20103",
                      "ScheduledEndTime": "2016-11-21T07:37:52.594Z",
                      "ActualEndTime": "2016-11-21T07:37:52.594Z",
                      "CompleteStatus": "AdvanceComplete",
                      "DelayDays": 0,
                      "NextTaskId": "20103",
                      "NextTaskName": "20103",
                      "NextTaskDuration": 0
                    }
                  ]
                },{
                  "SectionId": "20201",
                  "SectionName": "20201",
                  "TaskStatisticss": [
                    {
                      "SectionID": "20201",
                      "BuildingId": "20201",
                      "BuildName": "20201",
                      "TaskId": "20201",
                      "TaskName": "20201",
                      "ScheduledEndTime": "2016-11-21T07:37:52.594Z",
                      "ActualEndTime": "2016-11-21T07:37:52.594Z",
                      "CompleteStatus": "AdvanceComplete",
                      "DelayDays": 0,
                      "NextTaskId": "20201",
                      "NextTaskName": "20201",
                      "NextTaskDuration": 0
                    },
                    {
                      "SectionID": "20201",
                      "BuildingId": "20203",
                      "BuildName": "20203",
                      "TaskId": "20203",
                      "TaskName": "20203",
                      "ScheduledEndTime": "2016-11-21T07:37:52.594Z",
                      "ActualEndTime": "2016-11-21T07:37:52.594Z",
                      "CompleteStatus": "AdvanceComplete",
                      "DelayDays": 0,
                      "NextTaskId": "20203",
                      "NextTaskName": "20203",
                      "NextTaskDuration": 0
                    }
                  ]
                }
              ]
            }
          ],
          "StatisticsResult": {
            "TotalTaskNumber": 0,
            "AdvanceCompleteNumber": 0,
            "NormalCompleteNumber": 0,
            "LightDelayNumber": 0,
            "ModerateDelayNumber": 0,
            "HightDelayNumber": 0,
            "SeriousDelayNumber": 0,
            "AdvanceCompletePercent": 0,
            "NormalCompletePercent": 0,
            "LightDelayPercent": 0,
            "ModerateDelayPercent": 0,
            "HightDelayPercent": 0,
            "SeriousDelayPercent": 0
          }
        },
        {
          "CompanyId": "2",
          "CompanyName": "万科",
          "ProjectStatisticss": [
            {
              "ProjectId": "201",
              "ProjectName": "201",
              "SectionStatisticss": [
                {
                  "SectionId": "20101",
                  "SectionName": "20101",
                  "TaskStatisticss": [
                    {
                      "SectionID": "20101",
                      "BuildingId": "20101",
                      "BuildName": "20101",
                      "TaskId": "20101",
                      "TaskName": "20101",
                      "ScheduledEndTime": "2016-11-21T07:37:52.594Z",
                      "ActualEndTime": "2016-11-21T07:37:52.594Z",
                      "CompleteStatus": "AdvanceComplete",
                      "DelayDays": 0,
                      "NextTaskId": "20101",
                      "NextTaskName": "20101",
                      "NextTaskDuration": 0
                    },
                    {
                      "SectionID": "20101",
                      "BuildingId": "20103",
                      "BuildName": "20103",
                      "TaskId": "20103",
                      "TaskName": "20103",
                      "ScheduledEndTime": "2016-11-21T07:37:52.594Z",
                      "ActualEndTime": "2016-11-21T07:37:52.594Z",
                      "CompleteStatus": "AdvanceComplete",
                      "DelayDays": 0,
                      "NextTaskId": "20103",
                      "NextTaskName": "20103",
                      "NextTaskDuration": 0
                    }
                  ]
                },{
                  "SectionId": "20201",
                  "SectionName": "20201",
                  "TaskStatisticss": [
                    {
                      "SectionID": "20201",
                      "BuildingId": "20201",
                      "BuildName": "20201",
                      "TaskId": "20201",
                      "TaskName": "20201",
                      "ScheduledEndTime": "2016-11-21T07:37:52.594Z",
                      "ActualEndTime": "2016-11-21T07:37:52.594Z",
                      "CompleteStatus": "AdvanceComplete",
                      "DelayDays": 0,
                      "NextTaskId": "20201",
                      "NextTaskName": "20201",
                      "NextTaskDuration": 0
                    },
                    {
                      "SectionID": "20201",
                      "BuildingId": "20203",
                      "BuildName": "20203",
                      "TaskId": "20203",
                      "TaskName": "20203",
                      "ScheduledEndTime": "2016-11-21T07:37:52.594Z",
                      "ActualEndTime": "2016-11-21T07:37:52.594Z",
                      "CompleteStatus": "AdvanceComplete",
                      "DelayDays": 0,
                      "NextTaskId": "20203",
                      "NextTaskName": "20203",
                      "NextTaskDuration": 0
                    }
                  ]
                }
              ]
            },{
              "ProjectId": "201",
              "ProjectName": "201",
              "SectionStatisticss": [
                {
                  "SectionId": "20101",
                  "SectionName": "20101",
                  "TaskStatisticss": [
                    {
                      "SectionID": "20101",
                      "BuildingId": "20101",
                      "BuildName": "20101",
                      "TaskId": "20101",
                      "TaskName": "20101",
                      "ScheduledEndTime": "2016-11-21T07:37:52.594Z",
                      "ActualEndTime": "2016-11-21T07:37:52.594Z",
                      "CompleteStatus": "AdvanceComplete",
                      "DelayDays": 0,
                      "NextTaskId": "20101",
                      "NextTaskName": "20101",
                      "NextTaskDuration": 0
                    },
                    {
                      "SectionID": "20101",
                      "BuildingId": "20103",
                      "BuildName": "20103",
                      "TaskId": "20103",
                      "TaskName": "20103",
                      "ScheduledEndTime": "2016-11-21T07:37:52.594Z",
                      "ActualEndTime": "2016-11-21T07:37:52.594Z",
                      "CompleteStatus": "AdvanceComplete",
                      "DelayDays": 0,
                      "NextTaskId": "20103",
                      "NextTaskName": "20103",
                      "NextTaskDuration": 0
                    }
                  ]
                },{
                  "SectionId": "20201",
                  "SectionName": "20201",
                  "TaskStatisticss": [
                    {
                      "SectionID": "20201",
                      "BuildingId": "20201",
                      "BuildName": "20201",
                      "TaskId": "20201",
                      "TaskName": "20201",
                      "ScheduledEndTime": "2016-11-21T07:37:52.594Z",
                      "ActualEndTime": "2016-11-21T07:37:52.594Z",
                      "CompleteStatus": "AdvanceComplete",
                      "DelayDays": 0,
                      "NextTaskId": "20201",
                      "NextTaskName": "20201",
                      "NextTaskDuration": 0
                    },
                    {
                      "SectionID": "20201",
                      "BuildingId": "20203",
                      "BuildName": "20203",
                      "TaskId": "20203",
                      "TaskName": "20203",
                      "ScheduledEndTime": "2016-11-21T07:37:52.594Z",
                      "ActualEndTime": "2016-11-21T07:37:52.594Z",
                      "CompleteStatus": "AdvanceComplete",
                      "DelayDays": 0,
                      "NextTaskId": "20203",
                      "NextTaskName": "20203",
                      "NextTaskDuration": 0
                    }
                  ]
                }
              ]
            }
          ],
          "StatisticsResult": {
            "TotalTaskNumber": 0,
            "AdvanceCompleteNumber": 0,
            "NormalCompleteNumber": 0,
            "LightDelayNumber": 0,
            "ModerateDelayNumber": 0,
            "HightDelayNumber": 0,
            "SeriousDelayNumber": 0,
            "AdvanceCompletePercent": 0,
            "NormalCompletePercent": 0,
            "LightDelayPercent": 0,
            "ModerateDelayPercent": 0,
            "HightDelayPercent": 0,
            "SeriousDelayPercent": 0
          }
        }
      ],
      "StatisticsResult": {
        "TotalTaskNumber": 0,
        "AdvanceCompleteNumber": 0,
        "NormalCompleteNumber": 0,
        "LightDelayNumber": 0,
        "ModerateDelayNumber": 0,
        "HightDelayNumber": 0,
        "SeriousDelayNumber": 0,
        "AdvanceCompletePercent": 0,
        "NormalCompletePercent": 0,
        "LightDelayPercent": 0,
        "ModerateDelayPercent": 0,
        "HightDelayPercent": 0,
        "SeriousDelayPercent": 0
      }
    }
  }
})();
