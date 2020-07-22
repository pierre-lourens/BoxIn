import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { editTask, stopTimer } from "../../actions";

import EmptyCircleIcon from "../../assets/emptycircle.png";
import styled from "styled-components";

const Button = styled.button`
  outline: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  background-color: inherit;
  border: 0;
  height: 100%;

  img {
    height: 100%;
    opacity: 0.1;
    align-self: center;

    &: hover {
      opacity: 0.5;
    }
  }
`;

const EmptyCircle = (props) => {
  const handleCompleteTask = (event) => {
    // console.log("props when completing a task are", props);
    // check if there is a time entry running
    if (props.task.timeEntries) {
      // grab the last one
      const last = props.task.timeEntries[props.task.timeEntries.length - 1];

      // check if last is actively running
      const foundTimer = props.userData.timeEntries.find(
        (timeEntry) => timeEntry._id === last
      );

      if (foundTimer && foundTimer.active) {
        // stop the timer
        props.stopTimer(foundTimer._id, props.userId, props.task._id);
      }
    }

    props.editTask(props.task._id, {
      ...props.task,
      status: "complete",
    });
  };
  return (
    <Button onClick={handleCompleteTask}>
      <img src={EmptyCircleIcon} alt='empty circle icon' />
    </Button>
  );
};

function mapStateToProps(state) {
  return { userId: state.user._id, userData: state.userData };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ editTask, stopTimer }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EmptyCircle);
