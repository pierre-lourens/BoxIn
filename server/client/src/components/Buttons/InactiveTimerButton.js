import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { startTimer } from "../../actions";
import PlayIcon from "../../assets/PlayIcon";
import styled from "styled-components";

const Button = styled.button`
  svg {
    height: 25px;
    width: 100%;
    color: ${(props) => props.theme.colors.mediumGray}
    &: hover {
      color: ${(props) => props.theme.colors.primaryBlue};
    }
  }
`;

class InactiveTimerButton extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Button
        onClick={(e) => {
          e.preventDefault();
          this.props.startTimer(this.props.task._id, this.props.userId);
        }}>
        <PlayIcon />
      </Button>
    );
  }
}

function mapStateToProps(state) {
  return { userId: state.user._id };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ startTimer }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InactiveTimerButton);
