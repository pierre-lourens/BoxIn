import React from "react";
import styled from "styled-components";

const StyledInputContainer = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(5, 1fr);
`;

const TaskFormContainer = styled.div`
  grid-column: 2 / span 3;
  border: 0;
  border-radius: 3px;
  background-color: white;
  box-shadow: 0 4px 6px 0 rgba(100, 100, 100, 0.2);
  padding: 10px;

  form {
    width: 100%;
    height: 100%;
  }
  input {
    height: 30px;
    width: 100%;
    padding: 5px 10px;
    border: 0;
    margin-top: 10px;
    font-size: ${(props) => props.theme.fontSizes.small};
  }
  .formVisible {
    display: block;
  }
  .formHidden {
    display: none;
  }
`;

class MainTaskAdder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formExpanded: false,
    };

    this.handleFormClick = this.handleFormClick.bind(this);
    this.checkIfFormExpanded = this.checkIfFormExpanded.bind(this);
  }

  handleFormClick() {
    console.log("In MainTaskAdder, the state before clicking is", this.state.formExpanded);
    let currentStatus = this.state.formExpanded;
    this.setState({ formExpanded: !currentStatus }, () => {
      console.log("The state after clicking is", this.state.formExpanded);
    });
  }

  checkIfFormExpanded() {
    if (this.state.formExpanded) {
      return "formVisible";
    } else {
      return "formHidden";
    }
  }

  render() {
    return (
      <StyledInputContainer>
        <TaskFormContainer>
          <form>
            <input
              type='text'
              placeholder='Add a task...'
              onClick={this.handleFormClick}
              id='task-entry'></input>
            <div className={this.checkIfFormExpanded()}>
              <input type='text' placeholder='Add a task...'></input>
            </div>
          </form>
        </TaskFormContainer>
      </StyledInputContainer>
    );
  }
}

export default MainTaskAdder;
