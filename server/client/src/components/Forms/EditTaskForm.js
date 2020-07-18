import React from "react";
import styled from "styled-components";
import { editTask, removeTaskFromBox } from "../../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const EditTaskFormContainer = styled.div``;

class EditTaskForm extends React.Component {
  constructor(props) {
    super(props);

    // get the initial values from props
    const { estimatedTime, text, visibility } = this.props.task;

    this.state = {
      task: {
        estimatedTime,
        text,
        visibility,
      },
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  // estimated time for task overall
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
        <label>
          Estimated time (in minutes) to complete task? 30 minute minimum.
        </label>
        <input
          type='number'
          placeholder={this.props.task.estimatedTime}
          min='30'
          onChange={(event) => {
            this.handleInputChange("estimatedTime", event);
          }}></input>
      </React.Fragment>
    );
  };

  renderTaskTitleInput = () => {
    return (
      <React.Fragment>
        <label>Task title:</label>
        <input
          type='text'
          placeholder={`${this.props.task.text}`}
          maxLength='80'
          onChange={(event) => {
            this.handleInputChange("text", event);
          }}></input>
      </React.Fragment>
    );
  };

  handleDeleteTask = async () => {
    // construct an event object so that we don't have to do another handler
    const event = { target: { value: "disabled" } };

    await new Promise((resolve) => {
      // this.handleInputChange("visibility", event);

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
  handleTaskSubmit = () => {
    this.props.editTask(this.props.task._id, this.state.task);
    this.props.hideModal();
  };

  render() {
    return (
      <EditTaskFormContainer>
        <form className='form-inline'>
          {this.renderTaskTitleInput()}
          {this.renderEstimatedTimeInput()}
          <button
            type='button'
            onClick={(event) => {
              this.handleDeleteTask(event);
            }}>
            Delete task
          </button>
          <button type='submit' onClick={this.handleTaskSubmit}>
            Submit
          </button>
        </form>
      </EditTaskFormContainer>
    );
  }
}

function mapStateToProps(state) {
  return { userId: state.user._id, boxes: state.boxes };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ editTask, removeTaskFromBox }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(EditTaskForm);
