import React from "react";
import styled from "styled-components";
import { editTask } from "../../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const EditTaskFormContainer = styled.div``;

class EditTaskForm extends React.Component {
  constructor(props) {
    super(props);

    // get the initial values from props
    const { estimatedTime, text } = this.props.task;

    this.state = {
      task: {
        estimatedTime,
        text,
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
          maxlength='80'
          onChange={(event) => {
            this.handleInputChange("text", event);
          }}></input>
      </React.Fragment>
    );
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
          <button type='submit' onClick={this.handleTaskSubmit}>
            Submit
          </button>
        </form>
      </EditTaskFormContainer>
    );
  }
}

function mapStateToProps(state) {
  return { userId: state.user._id };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ editTask }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(EditTaskForm);
