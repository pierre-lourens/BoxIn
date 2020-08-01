import React from "react";
import styled from "styled-components";
import { getTasks, sendTaskBoxes, getTaskBoxes } from "../actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import _ from "lodash";
import BoxTitle from "./BoxTitle";
import NewFormButton from "./Buttons/NewFormButton";
import TaskCard from "./TaskCard";

class TaskList extends React.Component {
  constructor(props) {
    super(props);

    // we store the boxes in state so that react-beautiful-dnd is faster
    this.state = {
      boxes: { allTasks: { taskIds: [] } },
    };

    this.renderTaskCard = this.renderTaskCard.bind(this);
  }

  componentDidMount() {
    this.setState({ boxes: this.props.boxes });
    this.props.getTasks(this.props.userId);
    this.props.getTaskBoxes(this.props.userId);
  }
  componentDidUpdate(prevProps, prevState) {
    // make our boxes from our data store
    // console.log("this.props.task is", this.props.task);
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

  renderTaskCard(task, index) {
    return <TaskCard task={task} index={index} />;
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

    await new Promise((resolve) => {
      setTimeout(() => resolve(), 500);
    });

    this.props.sendTaskBoxes(this.props.userId, this.state.boxes);

    // we need to call an endpoint to update the server that a reorder has occurred
  };

  render() {
    // console.log("Props upon render of taskList is", this.props);
    // console.log("State upon render of taskList is", this.state);
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
                          let pixels = this.determineBoxHeight(boxTitle);

                          return (
                            <Box height={pixels} ref={provided.innerRef}>
                              <BoxTitle boxTitle={boxTitle} />
                              {this.props.boxes[boxTitle].taskIds.length &&
                              this.props.userData.hasOwnProperty("tasks")
                                ? this.state.boxes[boxTitle].taskIds.map(
                                    // find the task based on the taskId in the Box
                                    // ordered this way because the Box keeps the order of the tasks
                                    (taskIdFromBox, index) => {
                                      const task = this.props.userData.tasks.find(
                                        (task) =>
                                          taskIdFromBox === task._id &&
                                          task.visibility !== "archived"
                                      );

                                      return this.renderTaskCard(task, index);
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
              : null}
            <NewFormButtonStyle>
              <NewFormButton />
            </NewFormButtonStyle>
          </StyledAgendaContainer>
          <Droppable droppableId={"allTasks"}>
            {(provided) => (
              <StyledTaskContainer ref={provided.innerRef}>
                <AllTasksBox>
                  <h2>Tasks to Box</h2>
                  {this.state.boxes.hasOwnProperty("allTasks") &&
                  this.props.userData.hasOwnProperty("tasks")
                    ? this.props.boxes.allTasks.taskIds.map(
                        (taskIdFromBox, index) => {
                          // find the right task with all its data
                          const task = this.props.userData.tasks.find(
                            (task) =>
                              taskIdFromBox === task._id &&
                              task.visibility !== "archived"
                          );
                          if (!task) {
                            return null;
                          }
                          return this.renderTaskCard(task, index);
                        }
                      )
                    : null}

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

  determineBoxHeight(boxTitle) {
    let pixels = null;
    if (this.props.boxes[boxTitle].time) {
      pixels = Math.ceil(this.props.boxes[boxTitle].time * 3.95);
    }
    return pixels;
  }
}

function mapStateToProps(state) {
  // console.log("state being mapped to props in tasklist is is", state);
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
      sendTaskBoxes,
      getTaskBoxes,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);

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
