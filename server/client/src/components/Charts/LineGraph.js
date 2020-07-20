import React from "react";
import styled from "styled-components";
import Chart from "chart.js";

import { toDate, differenceInDays, parseISO, isDate } from "date-fns";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

let myLineChart;

//--Chart Style Options--//
Chart.defaults.global.defaultFontFamily = "'PT Sans', sans-serif";
Chart.defaults.global.legend.display = true;
Chart.defaults.global.elements.line.tension = 0;
//--Chart Style Options--//

class LineGraph extends React.Component {
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

  calculateTasksCompleted = () => {
    console.log("Props for line graph are", this.props);
    // creates two objects, each object having fourteen objects, one for each of the last 14 days
    return this.props.userData.tasks.reduce(
      (chartData, task) => {
        // only operate on non "deleted tasks"
        console.log("task is yah ", task);

        // find the difference in days betweeen creation date and today
        const daysSinceCreated = differenceInDays(
          new Date(),
          parseISO(task.createdAt)
        );

        console.log("daysSinceCreated is", daysSinceCreated);

        // if the difference is less than 14, increase the count for the day in the chartData obj
        if (daysSinceCreated < 14) {
          chartData.created[daysSinceCreated] += 1;
        }

        // if the task is marked complete, determine what day the task was completed on
        if (task.status === "complete") {
          // find the difference in days betweeen completion date and today
          const daysSinceCompleted = differenceInDays(
            new Date(),
            parseISO(task.updatedAt)
          );
          // if the difference is less than 14, increase the count for the day in the chartData obj
          if (daysSinceCompleted < 14) {
            chartData.completed[daysSinceCompleted] += 1;
          }
        }
        // return the chart
        return chartData;
      },
      {
        created: {
          13: 0,
          12: 0,
          11: 0,
          10: 0,
          9: 0,
          8: 0,
          7: 0,
          6: 0,
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
          0: 0,
        },
        completed: {
          13: 0,
          12: 0,
          11: 0,
          10: 0,
          9: 0,
          8: 0,
          7: 0,
          6: 0,
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
          0: 0,
        },
      }
    );
  };

  buildChart = () => {
    const myChartRef = this.chartRef.current.getContext("2d");
    const { data, average, labels } = this.props;

    const chartData = this.calculateTasksCompleted();
    console.log("chartData is", chartData);

    // transform each object in chartData for our chart
    const createdArray = [];
    const completedArray = [];

    for (const key in chartData.created) {
      createdArray[key] = chartData.created[key];
    }

    for (const key in chartData.completed) {
      completedArray[key] = chartData.completed[key];
    }

    createdArray.reverse();
    completedArray.reverse();

    console.log("created array is", createdArray);
    console.log("completedArray  is", completedArray);

    if (typeof myLineChart !== "undefined") myLineChart.destroy();

    myLineChart = new Chart(myChartRef, {
      type: "line",
      data: {
        //Bring in data
        labels: labels,
        datasets: [
          {
            label: "Tasks created",
            data: createdArray,
            fill: true,
            borderColor: "#4F3A0D",
          },
          {
            label: "Tasks completed",
            data: completedArray,
            fill: true,
            borderColor: "#3A5D9C",
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

export default withRouter(connect(mapStateToProps)(LineGraph));

const GraphContainer = styled.div`
  height: 450px;
  @media (max-width: 900px) {
    height: 300px;
  }
  width: 100%;
`;
