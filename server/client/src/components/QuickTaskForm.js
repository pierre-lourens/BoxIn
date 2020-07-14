import React from "react";
import styled from "styled-components";
import { addTask } from "../actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import PlusCircleIcon from "../assets/PlusCircle";

const StyledInputContainer = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(8, 1fr);
`;

const TaskFormContainer = styled.div`
  grid-column: 3 / span 4;
  border: 0;
  border-radius: 3px;
  background-color: white;
  box-shadow: 0 4px 6px 0 rgba(100, 100, 100, 0.15);
  padding: 10px;

  @media (max-width: 600px) {
    grid-column: 2 / span 6;
  }

  .form-inline {
    height: 100%;
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    button {
      align-self: center;
      cursor: pointer;
      height: 100%;

      outline: none;
      grid-column: span 1;
      background-color: inherit;
      border: 0;
      height: 30px;
      svg {
        height: 100%;
        width: 100%;
        color: ${(props) => props.theme.colors.lightBlue};

        &: hover {
          color: ${(props) => props.theme.colors.primaryBlue};
        }
      }
    }
  }

  input {
    height: 30px;
    grid-column: span 7;
    padding: 5px 10px;
    border: 0;
    display: inline;
    font-size: ${(props) => props.theme.fontSizes.smallplus};

    &:focus {
      outline: none;
    }
  }
  .formVisible {
    display: block;
  }
  .formHidden {
    display: none;
  }
`;

class QuickTaskForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { task: { text: "" } };

    this.handleTaskSubmit = this.handleTaskSubmit.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
  }

  handleTaskSubmit() {
    this.props.addTask(this.state.task);
  }

  handleFormChange(event) {
    this.setState({ task: { text: event.target.value } }, () =>
      console.log("Task in state is", this.state.task.text)
    );
  }

  render() {
    console.log("Inside render of quick task form, props are", this.props);
    return (
      <StyledInputContainer>
        <TaskFormContainer>
          <form className='form-inline'>
            <input
              type='text'
              placeholder='Quick add a task...'
              onSubmit={this.handleTaskSubmit}
              onChange={this.handleFormChange}
              id='task-entry'></input>
            <button type='submit' className='submitButton'>
              <PlusCircleIcon />
            </button>
          </form>
        </TaskFormContainer>
      </StyledInputContainer>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ addTask }, dispatch);
}

export default connect(null, mapDispatchToProps)(QuickTaskForm);
