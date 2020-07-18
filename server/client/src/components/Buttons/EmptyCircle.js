import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { editTask } from "../../actions";

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
  return (
    <Button
      onClick={(e) => {
        props.editTask(props.task._id, {
          ...props.task,
          status: "complete",
        });
      }}>
      <img src={EmptyCircleIcon} />
    </Button>
  );
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ editTask }, dispatch);
}

export default connect(null, mapDispatchToProps)(EmptyCircle);
