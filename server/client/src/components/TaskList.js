import React from "react";
import styled from "styled-components";
import { getTasks, editTask, startTimer, stopTimer } from "../actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PlayIcon from "../assets/PlayIcon";
import PauseIcon from "../assets/PauseIcon";
import PencilAltIcon from "../assets/PencilAltIcon";
import CheckCircleIcon from "../assets/CheckCircleIcon";
import EmptyCircleIcon from "../assets/emptycircle.png";

// import { Overlay } from "react-portal-overlay";

const StyledTaskContainer = styled.div`
  grid-column: 5 / span 4;
  @media (max-width: 800px) {
    grid-column: 2 / span 10;
  }
`;

const Task = styled.div`
  display: grid;
  grid-gap: 10px;
  cursor: grab;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: 45px auto;
  background-color: white;
  margin-bottom: 5px;
  border: 0;
  border-radius: 4px;
  min-height: 45px; // 20 pixels per 10 minutes, including padding
  background-color: white;
  box-shadow: 0 4px 6px 0 rgba(100, 100, 100, 0.15);
  padding: 10px;

  .text {
    grid-column: 2 / span 6;
    margin-left: -10px;
    padding: 10px 0;
    color: gray;
    align-self: center;
  }

  .completed {
    text-decoration: line-through;
  }

  button {
    grid-column: span 1;
    padding: 0;
    margin: 0;
    background-color: inherit;
    border: 0;
    outline: none;
    cursor: pointer;
    height: 25px;
    align-self: center;

    img {
      height: 100%;
      opacity: 0.1;

      &: hover {
        opacity: 0.5;
      }
    }
    svg {
      height: 25px;
      width: 100%;
      color: lightgray;
      &: hover {
        color: ${(props) => props.theme.colors.primaryBlue};
      }
    }
  }

  .options {
    grid-column: 8 / span 1;
    display: grid;
    grid-template-columns: 1;
    grid-template-rows: 30px;

    justify-items: end;

    button {
      grid-column: span 1;
      padding: 0;
      margin: 0;
      background-color: inherit;
      border: 0;
      outline: none;
      cursor: pointer;
      height: 25px;

      svg {
        height: 25px;
        width: 100%;
        color: lightgray;
        &: hover {
          color: ${(props) => props.theme.colors.primaryBlue};
        }
      }
    }
  }
`;

class TaskList extends React.Component {
  constructor(props) {
    super(props);

    this.state = { editingOpen: false };
    this.renderTaskCards = this.renderTaskCards.bind(this);
    this.handleTaskToggle = this.handleTaskToggle.bind(this);
    this.renderToggleCircle = this.renderToggleCircle.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.userId !== prevProps.userId ||
      this.props.task !== prevProps.task ||
      this.props.timer !== prevProps.timer
    ) {
      console.log("ComponentDidUpdate firing");
      this.props.getTasks(this.props.userId);
    }
  }

  handleTaskToggle(taskId, status) {
    // use the taskId to send a post request via redux store
    this.props.editTask(taskId, { status });
  }

  renderToggleCircle(task) {
    if (task.status != "complete" || !task.status) {
      return (
        <button
          onClick={(e) => {
            this.handleTaskToggle(task._id, "complete");
          }}>
          <img src={EmptyCircleIcon} />
        </button>
      );
    } else {
      return (
        <button
          onClick={(e) => {
            this.handleTaskToggle(task._id, "incomplete");
          }}>
          <CheckCircleIcon />
        </button>
      );
    }
  }

  renderTaskText(task) {
    if (task.status != "complete" || !task.status) {
      return <div className='text'>{task.text}</div>;
    } else {
      return <div className='text completed'>{task.text}</div>;
    }
  }

  renderTimerButton(task) {
    if (task.timeEntries.length === 0) {
      return (
        <button
          onClick={(e) => {
            this.props.startTimer(task._id, this.props.userId);
          }}>
          <PlayIcon />
        </button>
      );
    }

    // grab the latest task time entry to do our check
    const mostRecent = task.timeEntries[task.timeEntries.length - 1];
    // find the time entry that most recent entry
    // don't use task, as there may be multiple entries per task
    const timeEntry = this.props.userData.timeEntries.find((entry) => entry._id === mostRecent);
    console.log("time entry is", timeEntry);
    if (timeEntry.active) {
      // if it's running
      return (
        <button
          onClick={(e) => {
            this.props.stopTimer(timeEntry._id, this.props.userId);
          }}>
          <PauseIcon />
        </button>
      );
    } else {
      // if it is inactive (not running)
      return (
        <button
          onClick={(e) => {
            this.props.startTimer(task._id, this.props.userId);
          }}>
          <PlayIcon />
        </button>
      );
    }
  }

  renderTaskCards() {
    if (this.props.userData.tasks) {
      return this.props.userData.tasks.map((task) => {
        return (
          <Task key={task._id}>
            {this.renderToggleCircle(task)}
            {this.renderTaskText(task)}
            <div className='options'>
              {this.renderTimerButton(task)}
              <button onClick={this.handleEditClick}>
                <PencilAltIcon />
              </button>
            </div>
          </Task>
        );
      });
    }
  }

  render() {
    return <StyledTaskContainer>{this.renderTaskCards()}</StyledTaskContainer>;
  }
}

function mapStateToProps(state) {
  console.log("state being mapped to props in tasklist is is", state);
  return { userId: state.user._id, userData: state.userData, task: state.task, timer: state.timer };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getTasks, editTask, startTimer, stopTimer }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);
