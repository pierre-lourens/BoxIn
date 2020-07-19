import React from "react";
import styled from "styled-components";
import { addBox } from "../../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const AddBoxFormContainer = styled.div`
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

  .cancel {
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

    this.state = { box: { boxTitle: "", boxTime: "" } };
  }

  render() {
    return (
      <AddBoxFormContainer>
        <form>
          <Wrapper>
            <h1>Add Box</h1>
            <StyledInputDiv>{this.renderBoxTitleInput()}</StyledInputDiv>
          </Wrapper>
        </form>
        <StyledButtonGroup>
          <button
            type='button'
            className='cancel'
            onClick={(event) => {
              this.props.hideModal();
            }}>
            Cancel
          </button>
          <button type='submit' onClick={this.handleFormSubmit}>
            Submit
          </button>
        </StyledButtonGroup>
      </AddBoxFormContainer>
    );
  }

  renderBoxTitleInput = () => {
    return (
      <React.Fragment>
        <label>Box Title:</label>
        <input
          type='text'
          className='wide'
          placeholder='e.g. "morning" or "1-2 pm"'
          maxLength='80'
          onChange={(event) => {
            this.handleInputChange("boxTitle", event);
          }}></input>
      </React.Fragment>
    );
  };

  handleInputChange(attributeOfTask, event) {
    this.setState(
      {
        ...this.state,
        box: { ...this.state.box, [attributeOfTask]: event.target.value },
      },
      () => {
        console.log("in new box form, state is now", this.state);
      }
    );
  }

  checkTitle = () => {
    // look through this.props.boxes to make sure the title isn't taken
    if (Object.keys(this.props.boxes).includes(this.state.box.boxTitle)) {
      return false;
    }
    return true;
  };

  handleFormSubmit = async () => {
    const titleIsUnique = this.checkTitle();

    if (!this.state.box.boxTitle || !titleIsUnique) {
      alert("You have to enter a unique box title");
    }

    await new Promise((resolve) => {
      this.props.addBox(this.props.userId, this.state.box.boxTitle);

      resolve();
    });

    this.props.hideModal();
  };
}

function mapStateToProps(state) {
  return { userId: state.user._id, boxes: state.boxes };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ addBox }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(NewBoxForm);
