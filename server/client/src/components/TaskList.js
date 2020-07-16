import React from "react";
import styled from "styled-components";
import { getTasks, editTask, startTimer, stopTimer, sendTaskBoxes, getTaskBoxes } from "../actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PlayIcon from "../assets/PlayIcon";
import PauseIcon from "../assets/PauseIcon";
import PencilAltIcon from "../assets/PencilAltIcon";
import CheckCircleIcon from "../assets/CheckCircleIcon";
import EmptyCircleIcon from "../assets/emptycircle.png";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import _ from "lodash";

// import { Overlay } from "react-portal-overlay";

const StyledAgendaContainer = styled.div`
  grid-column: 3 / span 4;
  @media (max-width: 800px) {
    grid-column: 2 / span 10;
  }
`;

const StyledTaskContainer = styled.div`
  grid-column: 7 / span 4;
  @media (max-width: 800px) {
    grid-column: 2 / span 10;
  }
`;

const Task = styled.div`
  display: grid;
  grid-gap: 10px;
  cursor: grab;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: 40px auto;
  background-color: white;
  margin-bottom: 5px;
  border: 0;
  border-radius: 4px;
  min-height: 40px; // 20 pixels per 10 minutes, including padding
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
    .running {
      svg {
        color: ${(props) => props.theme.colors.primaryBlue};
        &: hover {
          color: lightgray;
        }
      }
    }
  }
`;

class TaskList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editingOpen: false,
      userData: null,
    };

    this.renderTaskCards = this.renderTaskCards.bind(this);
    this.handleTaskToggle = this.handleTaskToggle.bind(this);
    this.renderToggleCircle = this.renderToggleCircle.bind(this);
  }
  /*
  // called right before render
  // we use this for getting the tasks into state for drag and drop
  static getDerivedStateFromProps(props, state) {
    if (props.userData.tasks) {
      if (props.boxes !== state.boxes) {
        // do some normalizing of our user data to figure out boxes
        const boxes = props.userData.tasks.reduce((boxes, task) => {
          if (!boxes.hasOwnProperty(task.box)) {
            boxes[task.box] = { id: task.box, taskIds: [] };
          }

          boxes[task.box].taskIds.push(task._id);
          console.log(boxes);

          return boxes;
        }, {});

        return {
          boxes,
        };

        this.setState({ boxes });
      }
    }
    // if state hasn't changed
    return null;
  }
  */

  componentDidUpdate(prevProps) {
    // make our boxes from our data store
    if (
      this.props.userId !== prevProps.userId ||
      this.props.task !== prevProps.task ||
      this.props.timer !== prevProps.timer ||
      this.props.boxes !== prevProps.boxes
    ) {
      console.log("ComponentDidUpdate firing");

      this.props.getTasks(this.props.userId);
      this.props.getTaskBoxes(this.props.userId);
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
    // edge cases
    if (task.status === "complete") {
      return <div> </div>; // need an empty div for css grid
    }
    if (task.timeEntries.length === 0) {
      return (
        <button
          onClick={(e) => {
            e.preventDefault();
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
    // error handling, in case people are clicking too fast

    if (timeEntry.active) {
      // if it's running
      return (
        <button
          className='running'
          onClick={(e) => {
            e.preventDefault();
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
            e.preventDefault();
            this.props.startTimer(task._id, this.props.userId);
          }}>
          <PlayIcon />
        </button>
      );
    }
  }

  renderTaskCards() {
    if (this.props.userData.boxes) {
      return this.props.userData.boxes.allTasks.taskIds.map((taskIdFromBox, index) => {
        const task = this.props.userData.tasks.find((task) => taskIdFromBox === task._id);

        return (
          <Draggable draggableId={task._id} index={index}>
            {(provided) => (
              <Task
                key={task._id}
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}>
                {this.renderToggleCircle(task)}
                {this.renderTaskText(task)}
                <div className='options'>
                  {this.renderTimerButton(task)}
                  <button onClick={this.handleEditClick}>
                    <PencilAltIcon />
                  </button>
                </div>
              </Task>
            )}
          </Draggable>
        );
      });
    }
  }

  onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // edge cases
    if (!destination) {
      return;
    }

    // in case the user dropped it back into its position
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    console.log("source is ", source);
    console.log("destination is ", destination);
    console.log("draggableId is ", draggableId);
    console.log("this.state.boxes is", this.state.boxes);
    console.log("box is", this.state.boxes[source.droppableId]);

    const box = _.cloneDeep(this.state.boxes[source.droppableId]);
    const newTasks = Array.from(box.taskIds);
    newTasks.splice(source.index, 1);
    newTasks.splice(destination.index, 0, draggableId);
    const newBox = { ...box, taskIds: newTasks };

    const newState = {
      ...this.state,
      boxes: { ...this.state.boxes, [newBox.id]: newBox },
    };

    this.setState(newState);

    // we need to call an endpoint to update the server that a reorder has occurred
    this.props.sendTaskBoxes(this.props.userId, this.state.boxes);
  };

  render() {
    console.log("Props upon render is", this.props);
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId={"allTasks"}>
          {(provided) => (
            <StyledAgendaContainer ref={provided.innerRef}>
              {this.renderTaskCards()}
              {provided.placeholder}
            </StyledAgendaContainer>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

function mapStateToProps(state) {
  console.log("state being mapped to props in tasklist is is", state);
  return {
    userId: state.user._id,
    userData: state.userData,
    task: state.task,
    timer: state.timer,
    boxes: state.boxes,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { getTasks, editTask, startTimer, stopTimer, sendTaskBoxes, getTaskBoxes },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);
