import React from "react";
import styled from "styled-components";
import Chart from "chart.js";

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

class TimeBreakdownByTag extends React.Component {
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
    return this.props.userData.tasks.reduce((chartData, task) => {
      if (task.status === "complete") {
        if (task.actualTime) {
          if (!chartData.hasOwnProperty(task.tag)) {
            chartData[task.tag] = { actualTime: 0, estimatedTime: 0, count: 0 };
          }

          chartData[task.tag].actualTime += task.actualTime;
          chartData[task.tag].estimatedTime += task.estimatedTime;
          chartData[task.tag].count += 1;
        }
      }

      return chartData;
    }, {});
  };

  buildChart = () => {
    const myChartRef = this.chartRef.current.getContext("2d");

    const taskData = this.reduceTaskData();

    const labels = [];
    const estimatedTimeAverage = [];
    const actualTimeAverage = [];

    for (const key in taskData) {
      labels.push(key);
      estimatedTimeAverage.push(
        Math.round(taskData[key].estimatedTime / taskData[key].count)
      );

      actualTimeAverage.push(
        Math.round(taskData[key].actualTime / taskData[key].count)
      );
    }

    console.log("taskData is", taskData);
    console.log("labels is", labels);
    console.log("estimatedTimeAverage is", estimatedTimeAverage);
    console.log("actualTimeAverage is", actualTimeAverage);

    if (typeof myLineChart !== "undefined") myLineChart.destroy();

    myLineChart = new Chart(myChartRef, {
      type: "horizontalBar",
      data: {
        //Bring in data
        labels: labels,
        datasets: [
          {
            label: "Average completion time",
            data: actualTimeAverage,
            fill: true,
            backgroundColor: "#3A5D9C",
          },
          {
            label: "Average time estimation",
            data: estimatedTimeAverage,
            fill: true,
            backgroundColor: "rgba(83, 156, 42, 0.4)",
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

export default withRouter(connect(mapStateToProps)(TimeBreakdownByTag));

const GraphContainer = styled.div`
  height: 450px;
  @media (max-width: 900px) {
    height: 300px;
  }
  width: 100%;
`;
