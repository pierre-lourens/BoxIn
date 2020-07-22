import React from "react";
import styled from "styled-components";
import Chart from "chart.js";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

let myLineChart;

//--Chart Style Options--//
Chart.defaults.global.defaultFontFamily = "'PT Sans', sans-serif";

Chart.defaults.global.elements.line.tension = 0;
//--Chart Style Options--//

// this graph will show the average cumulative average estimated time and
// cumulate average actual work time per day, on each day of the week

class TotalTimeByTag extends React.Component {
  chartRef = React.createRef();

  componentDidMount() {
    this.props.get;

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
    // console.log("Props for bar graph are", this.props);
    // create two objects, one for estimated time and one for completed time
    // taskNumbers will be used to divide to get average
    return this.props.userData.tasks.reduce((chartData, task) => {
      if (task.status === "complete") {
        if (task.actualTime) {
          if (!chartData.hasOwnProperty(task.tag)) {
            chartData[task.tag] = 0;
          }

          chartData[task.tag] += task.actualTime;
        }
      }

      return chartData;
    }, {});
  };

  buildChart = () => {
    const myChartRef = this.chartRef.current.getContext("2d");

    const taskData = this.reduceTaskData();

    const pairedData = Object.entries(taskData);

    const labels = [];
    const data = [];

    pairedData.forEach((pair) => {
      labels.push(pair[0]);
      data.push(pair[1]);
    });

    // console.log("taskData is", taskData);
    // console.log("labels is", labels);
    // console.log("data is", data);

    if (typeof myLineChart !== "undefined") myLineChart.destroy();

    myLineChart = new Chart(myChartRef, {
      type: "horizontalBar",
      data: {
        //Bring in data
        labels: labels,
        datasets: [
          {
            label: "Actual Completion Time",
            data: data,
            fill: true,
            backgroundColor: "#3A5D9C",
          },
        ],
      },
      options: {
        legend: { display: false },
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Time tracked (minutes)",
                fontSize: 16,
              },
            },
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

export default withRouter(connect(mapStateToProps)(TotalTimeByTag));

const GraphContainer = styled.div`
  height: 540px;
  @media (max-width: 900px) {
    height: 300px;
  }
  width: 100%;
`;
