import React, { Component } from "react";
import styled from "styled-components";

import LineGraph from "./Charts/LineGraph";
import { managerData, yearLabels } from "./MockData";
import Header from "./Header";

export default class Reports extends Component {
  state = {
    data: managerData,
    labels: yearLabels,
  };

  render() {
    const { data, labels } = this.state;
    return (
      <React.Fragment>
        <Header />
        <BodyContainer>
          <GraphContainer>
            <header>
              {/* <img src={chartIcon} alt='bar chart icon' /> */}
              <h1>Tasks Over Time</h1>
            </header>
            <LineGraph data={data} labels={labels} />
          </GraphContainer>
        </BodyContainer>
      </React.Fragment>
    );
  }
}

const BodyContainer = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(12, 1fr);
`;

const GraphContainer = styled.div`
  background-color: ${(props) => props.theme.colors.evenWhiterThanOffWhite};
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 0 4px 5px 0 rgba(100, 100, 100, 0.15);
  grid-column: 2 / span 8;
  @media (max-width: 900px) {
    grid-column: 1 / span 12;
  }
`;
