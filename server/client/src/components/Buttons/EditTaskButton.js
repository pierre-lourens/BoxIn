import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { editTask } from "../../actions";

import PencilAltIcon from "../../assets/PencilAltIcon";
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

const EditTaskButton = (props) => {
  return (
    <Button>
      <PencilAltIcon />
    </Button>
  );
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ editTask }, dispatch);
}

export default connect(null, mapDispatchToProps)(EditTaskButton);
