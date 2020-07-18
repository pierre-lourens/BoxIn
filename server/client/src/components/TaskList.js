import React from "react";
import styled from "styled-components";
import {
  getTasks,
  editTask,
  startTimer,
  stopTimer,
  sendTaskBoxes,
  getTaskBoxes,
  addBox,
} from "../actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import uuid from "react-uuid";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import _ from "lodash";
import { parseISO, differenceInSeconds } from "date-fns";

import ActiveTimerButton from "./Buttons/ActiveTimerButton";
import InactiveTimerButton from "./Buttons/InactiveTimerButton";
import EmptyCircle from "./Buttons/EmptyCircleButton";
import CheckCircle from "./Buttons/CheckCircle";
import EditTaskButton from "./Buttons/EditTaskButton";
import NewFormButton from "./Buttons/NewFormButton";

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

  h2 {
    padding: 0;
    margin: 0 5px 10px 0;
    color: ${(props) => props.theme.colors.darkBlue};
  }
`;

const AllTasksBox = styled.div`
  background: #fff;
  padding: 10px;
  grid-row: 2;
  margin-bottom: 15px;
  margin-left: -5px;
  border-radius: 4px;
  // background-color: ${(props) => props.theme.colors.offWhite};
  background-color: inherit;
  // box-shadow: 0 4px 6px 0 rgba(100, 100, 100, 0.15);

  h2 {
    padding: 0;
    margin: 0 5px 10px 0;
    color: ${(props) => props.theme.colors.mediumGray};
  }
`;

const StyledAgendaContainer = styled.div`
  grid-column: 2 / span 5;
  grid-row: 2;
  border-right: 1px solid rgba(100, 100, 100, 0.1);
  @media (max-width: 800px) {
    grid-column: 2 / span 10;
    grid-row: 3;
    border: 0;
  }
`;

const StyledTaskContainer = styled.div`
  grid-column: 7 / span 5;
  grid-row: 2;
  @media (max-width: 800px) {
    grid-column: 2 / span 10;
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
    console.log("HEIGHT HEIGHT ", props);
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
      // grid-columns: span 2;
      margin: 5px 0;
      color: ${(props) => props.theme.colors.darkGray};
      font-size: ${(props) => props.theme.fontSizes.small};
    }

    .time {
      grid-row: 2;
      grid-columns: span 1;
      color: ${(props) => props.theme.colors.darkGray};
      font-size: ${(props) => props.theme.fontSizes.xsmall};
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

  addBox = (e) => {
    // we need to modify the lists in userData
    e.preventDefault();
    console.log("clicked");
    const randomTitle = uuid();
    this.props.addBox(this.props.userId, randomTitle);
  };

  componentDidUpdate(prevProps) {
    // make our boxes from our data store
    console.log("this.props.task is", this.props.task);
    if (
      this.props.userId !== prevProps.userId ||
      this.props.task !== prevProps.task ||
      this.props.timer !== prevProps.timer
      // this.props.userData.tasks !== prevProps.userData.tasks
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
    ) || {
      active: false,
    };

    let secondsElapsed = "";
    if ("elapsedTime" in timeEntry) {
      secondsElapsed = timeEntry.elapsedTime.toString();
    }

    console.log("TIME ENTRY IS", timeEntry, "FOR TASK", task.text);
    // use created at to figure out time elapsed

    console.log("Time entry created_at is", timeEntry.elapsedTime);
    console.log("secondsElapsed is", secondsElapsed);
    console.log("Time entry active is ", timeEntry.active);

    if (task.status !== "complete" || !task.status) {
      return (
        <React.Fragment>
          <div className='text'>
            <div className='task-title'>{task.text}</div>
            {timeEntry.active ? (
              <React.Fragment>
                <div className='time'>Estimated Time :</div>
                <div className='time'>Time So Far: {secondsElapsed}</div>
              </React.Fragment>
            ) : null}
          </div>
        </React.Fragment>
      );
    } else {
      return <div className='text completed'>{task.text}</div>;
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

    if (timeEntry.active === true) {
      return <ActiveTimerButton timeEntry={timeEntry} />;
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
          (task) => taskIdFromBox === task._id
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
    return (
      <React.Fragment>
        <NewFormButton />
        <DragDropContext onDragEnd={this.onDragEnd}>
          <StyledAgendaContainer>
            {Object.keys(this.state.boxes).length > 1
              ? Object.keys(this.props.boxes)
                  .filter((box) => box !== "allTasks")
                  .map((boxTitle, i) => {
                    return (
                      <Droppable key={boxTitle} droppableId={boxTitle}>
                        {(provided) => (
                          <Box ref={provided.innerRef}>
                            <h2>Box Title Goes Here</h2>
                            {this.props.boxes[boxTitle].taskIds.length &&
                            this.props.userData.hasOwnProperty("tasks")
                              ? this.state.boxes[boxTitle].taskIds.map(
                                  (taskIdFromBox, index) => {
                                    const task = this.props.userData.tasks.find(
                                      (task) => taskIdFromBox === task._id
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
                        )}
                      </Droppable>
                    );
                  })
              : console.log("hi")}
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
      addBox,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);
