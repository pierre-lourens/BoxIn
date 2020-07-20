import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { generateFakeData } from "../../actions";
import styled from "styled-components";

class DemoButton extends React.Component {
  constructor(props) {
    super(props);
  }

  handleGenerateFakeDataClick = () => {
    console.log("click and", this.props.userId);
    this.props.generateFakeData(this.props.userId);
  };

  render() {
    console.log("props on render of DemoButton are", this.props);
    return (
      <StyledDemoButton>
        <a href='#' onClick={this.handleGenerateFakeDataClick}>
          Generate Fake Data
        </a>
      </StyledDemoButton>
    );
  }
}

function mapStateToProps(state) {
  return { userId: state.user._id };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ generateFakeData }, dispatch);
}

const StyledDemoButton = styled.div`
  background-color: ${(props) => props.theme.colors.lightBlue};
  color: white;
  font-size: ${(props) => props.theme.fontSizes.small};
`;

export default connect(mapStateToProps, mapDispatchToProps)(DemoButton);
