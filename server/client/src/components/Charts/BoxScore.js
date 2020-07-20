import React from "react";
import styled from "styled-components";
import Chart from "chart.js";

import { parseISO, differenceInDays, differenceInMinutes } from "date-fns";
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

class BoxScore extends React.Component {
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
        let daysAgo = differenceInDays(new Date(), parseISO(task.updatedAt));
        let daysSinceCreated = differenceInDays(
          new Date(),
          parseISO(task.createdAt)
        );

        if (!chartData.earnedOnDay.hasOwnProperty(daysSinceCreated)) {
          chartData.earnedOnDay[daysSinceCreated] = 0;
        }
        // for making a new task
        chartData.earnedOnDay[daysSinceCreated] += 10;

        if (task.status === "complete") {
          // figure out how many days it has been since it was completed

          if (!chartData.earnedOnDay.hasOwnProperty(daysAgo)) {
            chartData.earnedOnDay[daysAgo] = 0;
          }

          // for completing the task
          chartData.earnedOnDay[daysAgo] += 20;

          // measure if it was five minutes before estimated time
          console.log(task.estimatedTime);
          console.log(task.actualTime);
          const diff = task.estimatedTime - task.actualTime;
          console.log("diff is", diff);

          if (diff <= 5 && diff >= 0) {
            chartData.earnedOnDay[daysAgo] += 100;
          } else if (Math.abs(diff) <= 5) {
            console.log("yep!!");
            chartData.earnedOnDay[daysAgo] += 50;
          }
        }

        return chartData;
      },
      { earnedOnDay: {} }
    );
  };

  buildChart = () => {
    const myChartRef = this.chartRef.current.getContext("2d");

    const taskData = this.reduceTaskData();

    const daysArray = [];
    const scoreArray = [];

    // figure out the highest number in the properties (number of days)
    const sortedDaysArray = Object.keys(taskData.earnedOnDay).sort(
      (a, b) => a - b
    );
    console.log(sortedDaysArray);
    const earliestDay = sortedDaysArray[sortedDaysArray.length - 1];

    for (let i = 0; i <= earliestDay; i++) {
      daysArray[i] = i;

      if (taskData.earnedOnDay[i]) {
        scoreArray[i] = taskData.earnedOnDay[i];
      } else {
        scoreArray[i] = 0;
      }
    }

    const getSum = (array, endIndex) => {
      let sum = 0;
      for (let i = 0; i <= endIndex; i++) {
        sum += array[i];
      }
      return sum;
    };
    daysArray.reverse();
    scoreArray.reverse();

    // take every prior element of scoreArray and add
    const totalsArray = scoreArray.map((score, index) => {
      if (index > 0) {
        return getSum(scoreArray, index);
      } else {
        return score;
      }
    });

    console.log("taskData is", taskData);
    console.log("daysArray is", daysArray);
    console.log("scoreArray is", scoreArray);
    console.log("totalsArray is", totalsArray);

    if (typeof myLineChart !== "undefined") myLineChart.destroy();

    myLineChart = new Chart(myChartRef, {
      type: "bar",
      data: {
        //Bring in data
        labels: daysArray,
        datasets: [
          {
            label: "Daily Score",
            data: scoreArray,
            fill: true,
            backgroundColor: "#3A5D9C",
            yAxisID: "left-y-axis",
          },
          {
            label: "Total Score",
            data: totalsArray,
            fill: true,
            type: "line",
            backgroundColor: "rgba(83, 156, 42, 0.4)",
            borderColor: "rgba(83, 156, 42, 1)",
            // backgroundColor: "539C2A",
            yAxisID: "right-y-axis",
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

export default withRouter(connect(mapStateToProps)(BoxScore));

const GraphContainer = styled.div`
  height: 600px;
  @media (max-width: 900px) {
    height: 300px;
  }
  width: 100%;
`;
