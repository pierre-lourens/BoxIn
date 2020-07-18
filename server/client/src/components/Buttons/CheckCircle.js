import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { editTask } from "../../actions";

import CheckCircleIcon from "../../assets/CheckCircleIcon";
import styled from "styled-components";

const Button = styled.button`
  outline: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  height: 100%;
  background-color: inherit;
  border: 0;

  svg {
    height: 25px;
    color: ${(props) => {
      if (props.status === "complete") {
        return props.theme.colors.mediumGray;
      } else {
        return props.theme.colors.mediumGray;
      }
    }};
    &: hover {
      color: ${(props) => props.theme.colors.primaryBlue};
    }
  }
`;

const CheckCircle = (props) => {
  return (
    <Button
      onClick={(e) => {
        props.editTask(props.task._id, {
          ...props.task,
          status: "incomplete",
        });
      }}>
      <CheckCircleIcon />
    </Button>
  );
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ editTask }, dispatch);
}

export default connect(null, mapDispatchToProps)(CheckCircle);
