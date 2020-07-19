import React from "react";
import styled from "styled-components";
import Chart from "chart.js";
let myLineChart;

//--Chart Style Options--//
Chart.defaults.global.defaultFontFamily = "'PT Sans', sans-serif";
Chart.defaults.global.legend.display = false;
Chart.defaults.global.elements.line.tension = 0;
//--Chart Style Options--//

export default class LineGraph extends React.Component {
  chartRef = React.createRef();

  componentDidMount() {
    this.buildChart();
  }

  componentDidUpdate() {
    this.buildChart();
  }

  buildChart = () => {
    const myChartRef = this.chartRef.current.getContext("2d");
    const { data, average, labels } = this.props;

    if (typeof myLineChart !== "undefined") myLineChart.destroy();

    myLineChart = new Chart(myChartRef, {
      type: "line",
      data: {
        //Bring in data
        labels: labels,
        datasets: [
          {
            label: "Sales",
            data: data,
            fill: false,
            borderColor: "#6610f2",
          },
          {
            label: "National Average",
            data: average,
            fill: false,
            borderColor: "#E0E0E0",
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

const GraphContainer = styled.div`
  height: 450px;
  @media (max-width: 900px) {
    height: 300px;
  }
  width: 100%;
`;
