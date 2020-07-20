import React from "react";
import styled from "styled-components";
import { editTask, removeTaskFromBox, sendSession } from "../../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import DateTimePicker from "react-datetime-picker";

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

const ManualSessionDiv = styled.div`
  label {
    display: block;
  }
  h2 {
    font-size: ${(props) => props.theme.fontSizes.smallplus};
    font-weight: 500;
  }
`;

class EditTaskForm extends React.Component {
  constructor(props) {
    super(props);

    // get the initial values from props
    const { estimatedTime, text, visibility, tag } = this.props.task;

    this.state = {
      task: {
        estimatedTime,
        text,
        visibility,
        tag,
      },
      session: {
        startDate: null,
        endDate: null,
      },
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  // tags for the task
  // scheduled completion date
  // due date
  // add a session
  // within a session, actual start time
  // within a session, actual end time
  // weight
  handleInputChange(attributeOfTask, event) {
    this.setState(
      {
        ...this.state,
        task: { ...this.state.task, [attributeOfTask]: event.target.value },
      },
      () => {
        console.log("in task form, state is now", this.state);
      }
    );
  }

  renderEstimatedTimeInput = () => {
    return (
      <React.Fragment>
        <label>Estimated time (in minutes) to complete task?</label>
        <input
          type='number'
          placeholder={this.props.task.estimatedTime || "30"}
          min='30'
          max='1440'
          onChange={(event) => {
            this.handleInputChange("estimatedTime", event);
          }}></input>
      </React.Fragment>
    );
  };

  renderTaskTitleInput = () => {
    return (
      <React.Fragment>
        <label>Change task name:</label>
        <input
          type='text'
          className='wide'
          placeholder={`${this.props.task.text}`}
          maxLength='80'
          onChange={(event) => {
            this.handleInputChange("text", event);
          }}></input>
      </React.Fragment>
    );
  };

  renderTaskTagInput = () => {
    return (
      <React.Fragment>
        <label>Add a tag:</label>
        <input
          type='text'
          className='wide'
          placeholder={`${this.props.task.tag}`}
          maxLength='80'
          onChange={(event) => {
            this.handleInputChange("tag", event);
          }}></input>
      </React.Fragment>
    );
  };

  renderManualSessionInput = () => {
    return (
      <React.Fragment>
        <h2>Manually add a past work session</h2>
        <label>Start Date and Time</label>
        <DateTimePicker
          onChange={(newDate) => {
            this.setState({
              ...this.state,
              session: { ...this.state.session, startDate: newDate },
            });
          }}
          value={this.state.session.startDate}
          maxDate={new Date()}
          disableClock={true}
        />
        <label>End Date and Time</label>
        <DateTimePicker
          onChange={(newDate) =>
            this.setState({
              ...this.state,
              session: { ...this.state.session, endDate: newDate },
            })
          }
          value={this.state.session.endDate}
          minDate={this.state.session.startDate}
          maxDate={new Date()}
          disableClock={true}
        />
      </React.Fragment>
    );
  };

  handleDeleteTask = async () => {
    // construct an event object so that we don't have to do another handler
    const event = { target: { value: "disabled" } };

    await new Promise((resolve) => {
      this.handleInputChange("visibility", event);

      // we also need to update our boxes so that it doesn't try to render it
      // find which box the task is in
      let boxTitle = "";
      for (const box in this.props.boxes) {
        let found = this.props.boxes[box].taskIds.find(
          (taskId) => taskId === this.props.task._id
        );
        if (found) {
          boxTitle = this.props.boxes[box].title;
        }
      }

      this.props.removeTaskFromBox(
        this.props.userId,
        boxTitle,
        this.props.task._id
      );
      resolve();
    });

    this.handleTaskSubmit();
  };

  handleTaskSubmit = async () => {
    await new Promise((resolve) => {
      this.props.editTask(this.props.task._id, this.state.task);

      if (this.state.session.startDate && this.state.session.endDate) {
        console.log("SENDING SESSION", this.state.session);
        console.log(
          "type of startDate is",
          typeof this.state.session.startDate
        );
        this.props.sendSession(
          this.props.task._id,
          this.props.userId,
          this.state.session.startDate.toISOString(),
          this.state.session.endDate.toISOString()
        );
      }
      resolve();
    });

    this.props.hideModal();
  };

  render() {
    return (
      <EditTaskFormContainer>
        <form className='form'>
          <Wrapper>
            <h1>
              Edit <span>"{this.props.task.text}"</span>
            </h1>
            <StyledInputDiv>{this.renderTaskTitleInput()}</StyledInputDiv>
            <StyledInputDiv>{this.renderTaskTagInput()}</StyledInputDiv>
            <StyledInputDiv>{this.renderEstimatedTimeInput()}</StyledInputDiv>
            <ManualSessionDiv>
              {this.renderManualSessionInput()}
            </ManualSessionDiv>
          </Wrapper>

          <StyledButtonGroup>
            <button
              type='button'
              className='delete'
              onClick={(event) => {
                this.handleDeleteTask(event);
              }}>
              Delete task
            </button>
            <button type='submit' onClick={this.handleTaskSubmit}>
              Submit
            </button>
          </StyledButtonGroup>
        </form>
      </EditTaskFormContainer>
    );
  }
}

function mapStateToProps(state) {
  return { userId: state.user._id, boxes: state.boxes };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { editTask, removeTaskFromBox, sendSession },
    dispatch
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(EditTaskForm);
