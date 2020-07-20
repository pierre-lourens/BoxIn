import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { generateFakeData, getTasks, getTaskBoxes } from "../../actions";
import styled from "styled-components";

class DemoButton extends React.Component {
  constructor(props) {
    super(props);
  }

  handleGenerateFakeDataClick = async () => {
    console.log("click and", this.props.userId);

    console.log("start waiting");
    await new Promise((resolve) => {
      setTimeout(() => {
        this.props.generateFakeData(this.props.userId);
        resolve();
      }, 1000);
    });
    console.log("done waiting");
  };

  render() {
    console.log("props on render of DemoButton are", this.props);

    return (
      <StyledDemoButton>
        <h3>Welcome!</h3>
        <p>Feel free to demo!</p>
        <a href='#' onClick={this.handleGenerateFakeDataClick}>
          Generate fake data
        </a>
        <br />
        <a href='#' onClick={this.props.changeDemoBox}>
          Hide this box
        </a>
      </StyledDemoButton>
    );
  }
}

function mapStateToProps(state) {
  return { userId: state.user._id, userData: state.userData };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { generateFakeData, getTasks, getTaskBoxes },
    dispatch
  );
}

const StyledDemoButton = styled.div`
  background-color: ${(props) => props.theme.colors.offWhite};
  border-radius: 4px;
  color: ${(props) => props.theme.colors.darkGray};
  font-size: ${(props) => props.theme.fontSizes.small};
  position: absolute;
  border: 0;
  box-shadow: 0 4px 6px 0 rgba(100, 100, 100, 0.2);
  // bottom: 50px;
  padding: 10px;
  right: 0;
`;

export default connect(mapStateToProps, mapDispatchToProps)(DemoButton);
