import React from "react";
import styled from "styled-components";
import { editTask, removeTaskFromBox, sendSession } from "../../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import DateTimePicker from "react-datetime-picker";
import { parseISO } from "date-fns";

const EditTaskFormContainer = styled.div`
  display: block;
  h2,
  h1 {
    color: ${(props) => props.theme.colors.darkestGray};
  }
  h1 {
    margin: 0 10px 10px 0;
    font-size: ${(props) => props.theme.fontSizes.medium};
    font-weight: 300;
    span {
      font-weight: 800;
    }
  }
`;

const Wrapper = styled.div`
  padding: 20px;
`;

const StyledInputDiv = styled.div`
  display: block;
  margin-bottom: 20px;
  input,
  label {
    display: block;
  }

  label {
    font-size: ${(props) => props.theme.fontSizes.small};
    margin: 10px 5px;
    color: ${(props) => props.theme.colors.darkGray};
  }

  .wide {
    width: 250px;
  }
  input {
    padding: 5px;
    margin: 0 5px;
    border: 1px solid ${(props) => props.theme.colors.lightGray};
    box-shadow: 0 2px 5px 0 rgba(100, 100, 100, 0.15) inset;
    border-radius: 4px;
    font-size: ${(props) => props.theme.fontSizes.smallplus};
    background-color: white;
    height: 30px;
    &: focus {
      color: black;
    }
  }
`;

const StyledButtonGroup = styled.div`
  display: block;
  background-color: ${(props) => props.theme.colors.offWhite};
  margin: 0 auto;
  border-radius: 4px;

  .delete {
    border: 0;
    box-shadow: 0 0 0 0;
    background: inherit;
    color: red;
    &: hover {
      background-color: ${(props) => props.theme.colors.lightGray};
    }
  }

  button {
    margin: 20px;
    padding: 15px;
    background-color: ${(props) => props.theme.colors.primaryBlue};
    color: white;
    font-weight: 500;
    font-size: ${(props) => props.theme.fontSizes.small};
    width: 120px;
    border: 0;
    box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    cursor: pointer;
    &: hover {
      background-color: ${(props) => props.theme.colors.darkGray};
    }
  }
`;

class NewBoxForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <EditTaskFormContainer>
        <StyledButtonGroup>
          <button
            type='button'
            class='delete'
            onClick={(event) => {
              this.props.hideModal();
            }}>
            Cancel
          </button>
          <button type='submit' onClick={this.handleTaskSubmit}>
            Submit
          </button>
        </StyledButtonGroup>
      </EditTaskFormContainer>
    );
  }
}

function mapStateToProps(state) {
  return { userId: state.user._id, boxes: state.boxes };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(NewBoxForm);
