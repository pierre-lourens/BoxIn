import React from "react";
import styled from "styled-components";
import Chart from "chart.js";

import { getDay, parseISO, addBusinessDays } from "date-fns";
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

  reduceData = () => {
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

    const taskData = this.reduceData();
    console.log("taskData is", taskData);

    const startedTasksArray = [];
    const completedTasksArray = [];

    // store that data in arrays for chart
    daysArray.forEach((day) => {
      if (taskData.startedTasks[day]) {
        startedTasksArray.push(taskData.startedTasks[day]);
      }
      if (taskData.completedTasks[day]) {
        completedTasksArray.push(taskData.completedTasks[day]);
      }
    });

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
            backgroundColor: "#9C7C3A",
          },
          {
            label: "Number of tasks completed",
            data: completedTasksArray,
            fill: true,
            backgroundColor: "#3A5D9C",
          },
        ],
      },
      options: {
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
