import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { stopTimer } from "../../actions";
import PauseIcon from "../../assets/PauseIcon";
import styled from "styled-components";

class ActiveTimerButton extends React.Component {
  render() {
    return (
      <StyledDiv>
        <button
          className={"running"}
          onClick={(e) => {
            e.preventDefault();
            this.props.stopTimer(
              this.props.timeEntry._id,
              this.props.userId,
              this.props.task._id
            );
          }}>
          <PauseIcon />
        </button>
      </StyledDiv>
    );
  }
}

function mapStateToProps(state) {
  return { userId: state.user._id };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ stopTimer }, dispatch);
}

const StyledDiv = styled.div`
  margin: 0;
  padding: 0;
  running {
    svg {
      height: 25px;
      width: 100%;
      color: red;
      &: hover {
        color: ${(props) => props.theme.colors.primaryBlue};
      }
    }
  }
`;

export default connect(mapStateToProps, mapDispatchToProps)(ActiveTimerButton);
