import React from "react";
import styled from "styled-components";
import {
  getTasks,
  editTask,
  startTimer,
  stopTimer,
  sendTaskBoxes,
  getTaskBoxes,
  checkForUser,
} from "../actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import _ from "lodash";

import ActiveTimerButton from "./Buttons/ActiveTimerButton";

import InactiveTimerButton from "./Buttons/InactiveTimerButton";
import EmptyCircle from "./Buttons/EmptyCircleButton";
import CheckCircle from "./Buttons/CheckCircle";
import EditTaskButton from "./Buttons/EditTaskButton";
import NewFormButton from "./Buttons/NewFormButton";
import Timer from "react-compound-timer";

// import { Overlay } from "react-portal-overlay";

const Box = styled.div`
  background: #fff;
  grid-row: 2;
  padding: 10px;
  margin-bottom: 15px;
  margin-right: 10px;
  border-radius: 4px;
  background-color: ${(props) => props.theme.colors.offWhite};
  box-shadow: 0 4px 5px 0 rgba(100, 100, 100, 0.15);
  height: ${(props) => {
    if (props.height) {
      let str = props.height.toString();
      str += "px";
      return str;
    }
    return null;
  }};
  overflow: ${(props) => {
    if (props.height) {
      return "auto";
    }
    return null;
  }};
  h3 {
    padding: 0;
    margin: 0 5px 10px 0;
    color: ${(props) => props.theme.colors.darkBlue};
    font-size: ${(props) => props.theme.fontSizes.small};
  }
`;

const NewFormButtonStyle = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
`;

const AllTasksBox = styled.div`
  padding: 10px;
  grid-row: 2;
  margin-bottom: 15px;
  border-radius: 4px;
  
  // background-color: ${(props) => props.theme.colors.offWhite};
  background-color: inherit;
  // box-shadow: 0 4px 6px 0 rgba(100, 100, 100, 0.15);

  h2 {
    padding: 0;
    margin: 0 5px 10px 0;
    text-align: center;
    color: ${(props) => props.theme.colors.mediumGray};
  }
`;

const StyledAgendaContainer = styled.div`
  grid-column: 2 / span 5;
  grid-row: 1;
  padding: 10px;
  @media (max-width: 900px) {
    grid-column: 1 / span 12;
    grid-row: 3;
    border: 0;
  }
  h2 {
    padding: 0;
    margin: 0 5px 10px 0;
    text-align: center;
    color: ${(props) => props.theme.colors.mediumGray};
  }
`;

const StyledTaskContainer = styled.div`
  grid-column: 7 / span 5;
  grid-row: 1;
  min-height: 600px;
  @media (max-width: 900px) {
    grid-column: 1 / span 12;
    grid-row: 2;
    min-height: 50px;
  }
`;

const Task = styled.div`
  display: grid;
  grid-gap: 10px;

  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: 40px auto;
  margin-bottom: 10px;
  border: 0;
  border-radius: 4px;
  background: ${(props) => {
    if (props.status === "complete") {
      return props.theme.colors.offWhiteComplete;
    }
    if (props.unscheduled) {
      return "#FCFEFF";
    } else {
      return "#FCFEFF";
    }
  }};
  // box-shadow: 1px 4px 6px 0 rgba(100, 100, 100, 0.12);
  box-shadow: ${(props) => {
    if (props.status === "complete") {
      return "0 2px 5px 0 rgba(100, 100, 100, 0.15) inset;";
    } else {
      return "0 4px 5px 0 rgba(100, 100, 100, 0.15);";
    }
  }};
  padding: 10px;
  height: ${(props) => {
    if (props.height) {
      let str = props.height.toString();
      str += "px";
      return str;
    }
    return "55px";
  }};

  .text {
    grid-column: 2 / span 6;
    display: grid;
    grid-template-columns: repeat (3, 1fr);
    margin-left: -10px;
    padding: 10px 0;
    align-self: center;
    .task-title {
      grid-row: 1;
      grid-column: 1 / span 2;
      margin: 5px 0;
      color: ${(props) => props.theme.colors.darkGray};
      font-size: ${(props) => props.theme.fontSizes.small};
      overflow: hidden;
      height: 18px;
    }

    .time {
      grid-row: 2;
      grid-columns: span 1;
      padding-top: 10px;
      color: ${(props) => props.theme.colors.darkGray};
      font-size: ${(props) => props.theme.fontSizes.xsmall};
      justify-self: center;

      strong {
        font-weight: 600;
      }

      .red {
        color: red;
      }
    }
  }

  .completed {
    text-decoration: line-through;
  }

  .toggleButtonWrapper {
    grid-column: span 1;
    height: 25px;
    justify-self: center;
    align-self: center;
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
        color: ${(props) => {
          if (props.status === "complete") {
            return props.theme.colors.mediumGray;
          } else {
            return props.theme.colors.mediumGray;
          }
        }};
        &: hover {
          color: ${(props) => props.theme.colors.primaryBlue};
        }
      }
    }
    .running {
      svg {
        color: ${(props) => "red"};
        &: hover {
          color: ${(props) => props.theme.colors.darkBlue};
        }
      }
    }
  }
`;

class TaskList extends React.Component {
  constructor(props) {
    super(props);

    // we store the boxes in state so that react-beautiful-dnd is faster
    this.state = {
      boxes: { allTasks: { taskIds: [] } },
    };

    this.renderTaskCards = this.renderTaskCards.bind(this);
    this.renderToggleCircle = this.renderToggleCircle.bind(this);
  }

  componentDidMount() {
    this.setState({ boxes: this.props.boxes });
  }
  componentDidUpdate(prevProps, prevState) {
    // make our boxes from our data store
    console.log("this.props.task is", this.props.task);
    if (
      this.props.userId !== prevProps.userId ||
      this.props.timer !== prevProps.timer ||
      this.props.task !== prevProps.task
    ) {
      this.props.getTasks(this.props.userId);
      this.props.getTaskBoxes(this.props.userId);
    }

    if (prevProps.boxes !== this.props.boxes) {
      this.setState({ boxes: this.props.boxes });
    }
  }

  renderToggleCircle(task) {
    if (task.status !== "complete" || !task.status) {
      return <EmptyCircle task={task} />;
    } else {
      return <CheckCircle task={task} />;
    }
  }

  renderTaskText = (task) => {
    const mostRecent = determineMostRecentTimeEntry(task);

    const timeEntry = this.props.userData.timeEntries.find(
      (entry) => entry._id === mostRecent
    );

    // initial values
    let milliSecondsElapsed = 0;
    let actualHours = 0;
    let actualMinutes = 0;
    let actualSeconds = 0;

    if (mostRecent && timeEntry && task.actualTime > 0) {
      milliSecondsElapsed = task.actualTime * 1000;
      actualHours = Math.floor(task.actualTime / 3600);
      actualMinutes = Math.floor(task.actualTime / 60 - actualHours * 60);
      actualSeconds = task.actualTime - actualMinutes * 60 - actualHours * 3600;
    }

    if (actualHours.toString().length < 2) {
      actualHours = "0" + actualHours;
    }
    if (actualMinutes.toString().length < 2) {
      actualMinutes = "0" + actualMinutes;
    }
    if (actualSeconds.toString().length < 2) {
      actualSeconds = "0" + actualSeconds;
    }

    if (task.status !== "complete") {
      return (
        <React.Fragment>
          <div className='text'>
            <div className='task-title'>{task.text}</div>
            <div className='time'>
              Estimated: <strong>{task.estimatedTime} minutes</strong>
            </div>
            <div className='time'>
              Measured:{" "}
              <strong>
                {this.renderActualTime(
                  timeEntry,
                  actualHours,
                  actualMinutes,
                  actualSeconds,
                  milliSecondsElapsed
                )}
              </strong>
            </div>
          </div>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <div className='text'>
            <div className='task-title'>
              <div className='completed'>{task.text}</div>
            </div>
            <div className='time'>
              Estimated: <strong>{task.estimatedTime} minutes</strong>
            </div>
            <div className='time'>
              Measured:{" "}
              <strong>
                {this.renderActualTime(
                  timeEntry,
                  actualHours,
                  actualMinutes,
                  actualSeconds,
                  milliSecondsElapsed
                )}
              </strong>
            </div>
          </div>
        </React.Fragment>
      );
    }
  };

  renderActualTime = (
    timeEntry,
    actualHours,
    actualMinutes,
    actualSeconds,
    milliSecondsElapsed
  ) => {
    console.log("milliSecondsElapsed is", milliSecondsElapsed);
    if (timeEntry && timeEntry.active && milliSecondsElapsed === 0) {
      return (
        <strong>
          <span className='red'>
            <Timer
              formatValue={(value) => `${value < 10 ? `0${value}` : value}`}>
              {({ timerState }) => (
                <React.Fragment>
                  <Timer.Hours />:
                  <Timer.Minutes />:
                  <Timer.Seconds />
                </React.Fragment>
              )}
            </Timer>
          </span>
        </strong>
      );
    } else if (timeEntry && timeEntry.active) {
      return (
        <strong>
          <span className='red'>
            <Timer
              initialTime={milliSecondsElapsed}
              formatValue={(value) => `${value < 10 ? `0${value}` : value}`}>
              {({ start, resume, pause, stop, reset, timerState }) => (
                <React.Fragment>
                  <Timer.Hours />:
                  <Timer.Minutes />:
                  <Timer.Seconds />
                </React.Fragment>
              )}
            </Timer>
          </span>
        </strong>
      );
    } else {
      return `${actualHours}:${actualMinutes}:${actualSeconds}`;
    }
  };

  renderTimerButton(task) {
    // edge cases
    if (task.status === "complete") {
      return <div> </div>; // need an empty div for css grid
    }
    if (task.timeEntries.length === 0) {
      return <InactiveTimerButton task={task} />;
    }

    // grab the latest task time entry from the task and find its corresponding
    // entry in timeEntries
    const mostRecent = task.timeEntries[task.timeEntries.length - 1];
    const timeEntry = this.props.userData.timeEntries.find(
      (entry) => entry._id === mostRecent
    );

    if (timeEntry && timeEntry.active === true) {
      return <ActiveTimerButton timeEntry={timeEntry} task={task} />;
    } else {
      return <InactiveTimerButton task={task} timeEntry={timeEntry} />;
    }
  }

  renderTaskCards() {
    if (
      this.state.boxes.hasOwnProperty("allTasks") &&
      this.props.userData.hasOwnProperty("tasks")
    ) {
      return this.state.boxes.allTasks.taskIds.map((taskIdFromBox, index) => {
        const task = this.props.userData.tasks.find(
          (task) => taskIdFromBox === task._id && task.visibility !== "archived"
        );

        if (!task) {
          return null;
        }

        let pixels = 60;

        if (task.estimatedTime) {
          // the design calls for 2 pixels per minute
          console.log(
            "I FOUND A TASK WITH ESTIMATED TIME AND ITS NAME IS",
            task
          );
          pixels = Math.ceil(task.estimatedTime * 2);
        }

        return (
          <Draggable draggableId={task._id} key={task._id} index={index}>
            {(provided) => (
              <Task
                key={task._id}
                ref={provided.innerRef}
                unscheduled
                status={task.status}
                height={pixels}
                {...provided.draggableProps}
                {...provided.dragHandleProps}>
                <div className='toggleButtonWrapper'>
                  {this.renderToggleCircle(task)}
                </div>
                {this.renderTaskText(task)}
                <div className='options'>
                  {this.renderTimerButton(task)}
                  <EditTaskButton task={task} />
                </div>
              </Task>
            )}
          </Draggable>
        );
      });
    }
  }

  onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // edge cases
    if (!destination) {
      return;
    }

    // in case the user dropped it back into its position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (source.droppableId !== destination.droppableId) {
      const sourceBox = _.cloneDeep(this.state.boxes[source.droppableId]);
      const destinationBox = _.cloneDeep(
        this.state.boxes[destination.droppableId]
      );

      const newSourceTasks = Array.from(sourceBox.taskIds);
      newSourceTasks.splice(source.index, 1);

      const newDestinationTasks = Array.from(destinationBox.taskIds);
      newDestinationTasks.splice(destination.index, 0, draggableId);

      const newSourceBox = { ...sourceBox, taskIds: newSourceTasks };
      const newDestination = {
        ...destinationBox,
        taskIds: newDestinationTasks,
      };

      const newState = {
        ...this.state,
        boxes: {
          ...this.state.boxes,
          [newSourceBox.title]: newSourceBox,
          [newDestination.title]: newDestination,
        },
      };

      this.setState(newState);
    } else {
      const box = _.cloneDeep(this.state.boxes[source.droppableId]);
      const newTasks = Array.from(box.taskIds);
      newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, draggableId);
      const newBox = { ...box, taskIds: newTasks };

      const newState = {
        ...this.state,
        boxes: { ...this.state.boxes, [newBox.title]: newBox },
      };
      this.setState(newState);
    }

    console.log(
      "starting 2s wait, the local state should render the drag and drop correctly"
    );
    await new Promise((resolve) => {
      setTimeout(() => resolve(), 500);
    });
    console.log("done waiting");
    this.props.sendTaskBoxes(this.props.userId, this.state.boxes);

    // we need to call an endpoint to update the server that a reorder has occurred
  };

  render() {
    console.log("Props upon render of taskList is", this.props);
    console.log("State upon render of taskList is", this.state);
    return (
      <React.Fragment>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <StyledAgendaContainer>
            <h2>Your Boxes</h2>

            {Object.keys(this.state.boxes).length > 1
              ? Object.keys(this.props.boxes)
                  .filter((box) => box !== "allTasks")
                  .map((boxTitle, i) => {
                    return (
                      <Droppable key={boxTitle} droppableId={boxTitle}>
                        {(provided) => {
                          // check for estimated time in box to calculate height

                          let pixels = null;
                          if (this.props.boxes[boxTitle].time) {
                            // the design calls for 2 pixels per minute
                            pixels = Math.ceil(
                              this.props.boxes[boxTitle].time * 3.25
                            );
                          }
                          return (
                            <Box height={pixels} ref={provided.innerRef}>
                              <h3>{boxTitle}</h3>
                              {this.props.boxes[boxTitle].taskIds.length &&
                              this.props.userData.hasOwnProperty("tasks")
                                ? this.state.boxes[boxTitle].taskIds.map(
                                    (taskIdFromBox, index) => {
                                      const task = this.props.userData.tasks.find(
                                        (task) =>
                                          taskIdFromBox === task._id &&
                                          task.visibility !== "archived"
                                      );
                                      let pixels = 55;
                                      if (task.estimatedTime) {
                                        // the design calls for 2.5 pixels per minute
                                        console.log(
                                          "I FOUND A TASK WITH ESTIMATED TIME AND ITS NAME IS",
                                          task
                                        );
                                        pixels = Math.ceil(
                                          task.estimatedTime * 2
                                        );
                                      }
                                      return (
                                        <Draggable
                                          key={task._id}
                                          draggableId={task._id}
                                          index={index}>
                                          {(provided) => (
                                            <Task
                                              key={task._id}
                                              ref={provided.innerRef}
                                              height={pixels}
                                              status={task.status}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}>
                                              <div className='toggleButtonWrapper'>
                                                {this.renderToggleCircle(task)}
                                              </div>
                                              {this.renderTaskText(task)}
                                              <div className='options'>
                                                {this.renderTimerButton(task)}
                                                <EditTaskButton task={task} />
                                              </div>
                                            </Task>
                                          )}
                                        </Draggable>
                                      );
                                    }
                                  )
                                : !provided.placeholder}
                              {provided.placeholder}
                            </Box>
                          );
                        }}
                      </Droppable>
                    );
                  })
              : console.log("hi")}
            <NewFormButtonStyle>
              <NewFormButton />
            </NewFormButtonStyle>
          </StyledAgendaContainer>
          <Droppable droppableId={"allTasks"}>
            {(provided) => (
              <StyledTaskContainer ref={provided.innerRef}>
                <AllTasksBox>
                  <h2>Tasks to Box</h2>

                  {this.renderTaskCards()}
                  {/* {provided.placeholder} */}
                </AllTasksBox>
              </StyledTaskContainer>
            )}
          </Droppable>

          {/* filter the object to everything but allTasks before mapping*/}
        </DragDropContext>
      </React.Fragment>
    );
  }
}

function determineMostRecentTimeEntry(task) {
  return task.timeEntries[task.timeEntries.length - 1];
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
    {
      getTasks,
      editTask,
      startTimer,
      stopTimer,
      sendTaskBoxes,
      getTaskBoxes,
      checkForUser,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);
