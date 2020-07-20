import React, { Component } from "react";
import styled from "styled-components";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getTasks, checkForUser, getTaskBoxes } from "../actions";

import LineGraph from "./Charts/LineGraph";
import {
  managerData,
  fourteenDayLabels,
  nationalAverageData,
} from "./MockData";
import Header from "./Header";
import ReportsNav from "./ReportsNav";
import ReportDescription from "./ReportDescription";

class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labels: fourteenDayLabels,
      currentGraph: "",
    };
    this.props.checkForUser();
  }

  componentDidUpdate(prevProps) {
    if (this.props.userId !== prevProps.userId) {
      this.props.getTasks(this.props.userId);
      this.props.getTaskBoxes(this.props.userId); // in case we start on this page and navigate to the others
    }
  }

  showChosenGraph = (chosenGraph) => {
    switch (chosenGraph) {
      case "LineGraph":
        return (
          <React.Fragment>
            <header>
              {/* <img src={chartIcon} alt='bar chart icon' /> */}
              <h1>Tasks Over Time</h1>
            </header>
            <LineGraph data={this.props.userData} labels={this.state.labels} />
          </React.Fragment>
        );
      default:
        return (
          <React.Fragment>
            <header>
              {/* <img src={chartIcon} alt='bar chart icon' /> */}
              <h1>Tasks Over Time</h1>
            </header>
          </React.Fragment>
        );
    }
  };

  setCurrentGraph = (input) => {
    this.setState({ currentGraph: input });
  };

  render() {
    console.log("props on render of reports is", this.props);
    const { data, labels } = this.state;
    return (
      <React.Fragment>
        <Header />
        <StyledBodyContainer>
          <StyledGraphContainer>
            {this.showChosenGraph(this.state.currentGraph)}
          </StyledGraphContainer>
          <StyledReportSwitcherContainer>
            <StyledBackgroundWrapper>
              <ReportsNav setCurrentGraph={this.setCurrentGraph} />
              <ReportDescription currentGraph={this.state.currentGraph} />
            </StyledBackgroundWrapper>
          </StyledReportSwitcherContainer>
        </StyledBodyContainer>
      </React.Fragment>
    );
  }
}

const StyledBodyContainer = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: auto;
`;

const StyledGraphContainer = styled.div`
  background-color: ${(props) => props.theme.colors.evenWhiterThanOffWhite};
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 0 4px 5px 0 rgba(100, 100, 100, 0.15);
  grid-column: 2 / span 8;
  @media (max-width: 900px) {
    grid-column: 1 / span 12;
    grid-row: 1;
  }
  h1 {
    font-size: ${(props) => props.theme.fontSizes.medium};
    margin: 10px;
    padding: 0;
    color: ${(props) => props.theme.colors.darkGray};
  }
`;

const StyledReportSwitcherContainer = styled.div`
  grid-column: 10 / span 2;
  display: grid;
  align-items: start;
  grid-template-columns: 1;
  positiion: relative;

  grid-auto-rows: min-content;
  @media (max-width: 900px) {
    grid-column: 2 / span 10;
  }

  h3 {
    font-size: ${(props) => props.theme.fontSizes.smallplus};
    margin: 20px;
    padding: 0;
    color: ${(props) => props.theme.colors.darkGray};

    span {
      color: ${(props) => props.theme.colors.primaryBlue};
      font-weight: 800;
    }
  }

  p {
    margin: 20px;
    font-size: ${(props) => props.theme.fontSizes.small};
    color: ${(props) => props.theme.colors.darkGray};
  }

  ul {
    list-style: none;
    padding: 0;
    border-top: 1px solid ${(props) => props.theme.colors.lightGray};
  }

  li {
    width: 100%;
    margin: auto;
    box-sizing: border-box;
    padding: 15px;
    background-color: ${(props) => props.theme.colors.offWhite};
    color: ${(props) => props.theme.colors.darkGray};
    font-weight: 500;
    cursor: pointer;
    border-bottom: 1px solid ${(props) => props.theme.colors.lightGray};
    &:hover {
      background-color: ${(props) => props.theme.colors.lightGray};
      color: ${(props) => props.theme.colors.primaryBlue};
      font-weight: 600;
    }
  }
`;

const StyledBackgroundWrapper = styled.div`
  background-color: ${(props) => props.theme.colors.evenWhiterThanOffWhite};
  box-shadow: 0 4px 5px 0 rgba(100, 100, 100, 0.15);
  border-radius: 4px;
  // padding-bottom: 15px;

  position: relative;
  &: inner {
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 22;
  }
`;

function mapStateToProps(state) {
  return { userId: state.user._id, userData: state.userData };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getTasks, checkForUser, getTaskBoxes }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Reports);
