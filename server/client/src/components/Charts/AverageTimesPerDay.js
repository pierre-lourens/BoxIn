import React from "react";
import styled from "styled-components";
import Chart from "chart.js";

import {
  getDay,
  parseISO,
  addBusinessDays,
  differenceInDays,
  differenceInSeconds,
} from "date-fns";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

let myLineChart;

//--Chart Style Options--//
Chart.defaults.global.defaultFontFamily = "'PT Sans', sans-serif";
Chart.defaults.global.legend.display = true;
Chart.defaults.global.elements.line.tension = 0;
//--Chart Style Options--//

// this graph will show the average cumulative average estimated time and
// cumulate average actual work time per day, on each day of the week

class AverageTimesPerDay extends React.Component {
  chartRef = React.createRef();

  componentDidMount() {
    if (this.props.userData.hasOwnProperty("tasks")) {
      this.buildChart();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.userData.hasOwnProperty("tasks")) {
      this.buildChart();
    }
  }

  reduceTaskData = () => {
    console.log("Props for bar graph are", this.props);
    // create two objects, one for estimated time and one for completed time
    // taskNumbers will be used to divide to get average
    return this.props.userData.tasks.reduce(
      (chartData, task) => {
        const daysArray = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];

        // increment any tasks started that day
        let dayStarted = getDay(parseISO(task.createdAt));

        dayStarted = daysArray[dayStarted];

        // check if that day already exists on accumulator
        if (!chartData.startedTasks.hasOwnProperty(dayStarted)) {
          chartData.startedTasks[dayStarted] = 0;
        }
        // increment the correct day on startedTasks
        chartData.startedTasks[dayStarted] += 1;

        // check if a task was completed
        if (task.status === "complete") {
          // check the day of the week that it was completed
          let dayCompleted = getDay(parseISO(task.updatedAt));

          dayCompleted = daysArray[dayCompleted];

          // increment the correct day on taskNumbers
          if (!chartData.completedTasks.hasOwnProperty(dayCompleted)) {
            chartData.completedTasks[dayCompleted] = 0;
          }
          chartData.completedTasks[dayCompleted] += 1;
        }
        return chartData;
      },
      { startedTasks: {}, completedTasks: {} }
    );
  };

  reduceTimeData = () => {
    console.log("Props for bar graph are", this.props);
    // would like to return the average measured time per day of the week
    // need to have the number of entries per day and the total time per day, to divide
    let reducedTimeData = this.props.userData.timeEntries.reduce(
      (chartData, timeEntry) => {
        // determine the day of the week for the start date and end date

        let dayStarted = getDay(parseISO(timeEntry.startDate));
        let dayEnded = getDay(parseISO(timeEntry.endDate));

        // only proceed if the start date and end date are the same day; outliers skew data
        if (dayStarted !== dayEnded) {
          return chartData;
        }

        // change our day number to the appropriate string
        const daysArray = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];

        dayStarted = daysArray[dayStarted];
        let day = dayStarted;

        // determine the elapsed time between start date and end date
        const elapsedTime = differenceInSeconds(
          parseISO(timeEntry.endDate),
          parseISO(timeEntry.startDate)
        );

        // add the elapsed time to the apropriate totalTimePerDay
        if (!chartData.totalTimePerDay.hasOwnProperty(day)) {
          chartData.totalTimePerDay[day] = 0;
        }
        chartData.totalTimePerDay[day] += elapsedTime;
        // increment numberOfEntriesPerDay
        if (!chartData.numberofEntriesPerDay.hasOwnProperty(day)) {
          chartData.numberofEntriesPerDay[day] = 0;
        }
        chartData.numberofEntriesPerDay[day] += 1;

        return chartData;
      },
      { numberofEntriesPerDay: {}, totalTimePerDay: {} }
    );

    // let's add a new property for average times
    reducedTimeData = { ...reducedTimeData, averageTimes: {} };

    // do the division for averaging
    // we'll round so it looks good in the chart
    for (const key in reducedTimeData.totalTimePerDay) {
      reducedTimeData.averageTimes[key] = Math.round(
        reducedTimeData.totalTimePerDay[key] /
          reducedTimeData.numberofEntriesPerDay[key]
      );
    }

    return reducedTimeData.averageTimes;
  };

  buildChart = () => {
    const myChartRef = this.chartRef.current.getContext("2d");

    const daysArray = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const taskData = this.reduceTaskData();
    const timeData = this.reduceTimeData();
    console.log("taskData is", taskData);
    console.log("timeData is", timeData);

    const startedTasksArray = [];
    const completedTasksArray = [];
    const averageTimeArray = [];

    // store that data in arrays for chart
    daysArray.forEach((day) => {
      if (taskData.startedTasks[day]) {
        startedTasksArray.push(taskData.startedTasks[day]);
      } else {
        startedTasksArray.push(0);
      }

      if (taskData.completedTasks[day]) {
        completedTasksArray.push(taskData.completedTasks[day]);
      } else {
        completedTasksArray.push(0);
      }

      if (timeData[day]) {
        averageTimeArray.push(timeData[day]);
      } else {
        averageTimeArray.push(0);
      }
    });

    console.log("taskData is", taskData);
    console.log("startedTasksArray is", startedTasksArray);
    console.log("completedTasksArray is", completedTasksArray);
    console.log("averageTimeArray is", averageTimeArray);
    console.log("timeData is", timeData);

    if (typeof myLineChart !== "undefined") myLineChart.destroy();

    myLineChart = new Chart(myChartRef, {
      type: "bar",
      data: {
        //Bring in data
        labels: daysArray,
        datasets: [
          {
            label: "Number of tasks started",
            data: startedTasksArray,
            fill: true,
            backgroundColor: "#3A5D9C",
          },
          {
            label: "Number of tasks completed",
            data: completedTasksArray,
            fill: true,
            backgroundColor: "#9C7C3A",
            yAxisID: "left-y-axis",
          },
          {
            label: "Average tracked time per day",
            data: averageTimeArray,
            fill: true,
            type: "line",
            yAxisID: "right-y-axis",
            borderColor: "#9C7C3A",
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            { id: "left-y-axis", type: "linear", position: "left" },
            { id: "right-y-axis", type: "linear", position: "right" },
          ],
        },
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 5,
            left: 15,
            right: 15,
            bottom: 15,
          },
        },
      },
    });
  };

  render() {
    return (
      <GraphContainer>
        <canvas id='myChart' ref={this.chartRef} />
      </GraphContainer>
    );
  }
}

function mapStateToProps(state) {
  return { userData: state.userData };
}

export default withRouter(connect(mapStateToProps)(AverageTimesPerDay));

const GraphContainer = styled.div`
  height: 450px;
  @media (max-width: 900px) {
    height: 300px;
  }
  width: 100%;
`;
