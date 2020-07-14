import React from "react";
import styled from "styled-components";

const StyledInputContainer = styled.div`
  grid-row: 2;
  grid-column: span 6;
  background-color: ${(props) => props.theme.colors.darkBlue};
  width: 100%;

  input {
    height: 30px;
    padding: 5px 10px;
    margin: 0;
    width: 100%;
    display: flex;

    font-size: ${(props) => props.theme.fontSizes.small};
  }

  #task-entry {
    border: 0;
  }

  .formVisible {
    display: block;
    background-color: white;
  }

  .formHidden {
    display: block;
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
      </StyledInputContainer>
    );
  }
}

export default MainTaskAdder;
