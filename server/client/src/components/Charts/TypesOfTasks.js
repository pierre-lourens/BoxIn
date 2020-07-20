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

class TypesOfTasks extends React.Component {
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
    console.log("Props for pie graph are", this.props);
    // create two objects, one for estimated time and one for completed time
    // taskNumbers will be used to divide to get average
    return this.props.userData.tasks.reduce((chartData, task) => {
      if (!chartData.hasOwnProperty(task.tag)) {
        chartData[task.tag] = 0;
      }
      chartData[task.tag] += 1;

      return chartData;
    }, {});
  };

  buildChart = () => {
    const myChartRef = this.chartRef.current.getContext("2d");

    const reducedTaskData = this.reduceTaskData();

    console.log("taskData is", reducedTaskData);

    const pairedData = Object.entries(reducedTaskData);
    const tags = [];
    const counts = [];

    pairedData.forEach((pair) => {
      tags.push(pair[0]);
      counts.push(pair[1]);
    });

    console.log("tags are", tags);
    console.log("tags are", counts);

    if (typeof myLineChart !== "undefined") myLineChart.destroy();

    myLineChart = new Chart(myChartRef, {
      type: "pie",
      data: {
        //Bring in data
        labels: tags,
        datasets: [
          {
            label: "Proportion of tasks by tag",
            data: counts,
            fill: true,
            backgroundColor: [
              "#3A5D9C",
              "#5689E8",
              "#9C5549",
              "#152A4F",
              "#799C2A",
              "#3F4F19",
              "#4F3A0D",
              "#E8D53F",
            ],
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

export default withRouter(connect(mapStateToProps)(TypesOfTasks));

const GraphContainer = styled.div`
  height: 450px;
  @media (max-width: 900px) {
    height: 300px;
  }
  width: 100%;
`;
