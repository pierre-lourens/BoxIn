import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { checkForUser } from "../actions";
import styled from "styled-components";

import Header from "./Header";
import QuickTaskForm from "./QuickTaskForm";
import TaskList from "./TaskList";

class Task extends React.Component {
  constructor(props) {
    super(props);
    
  }

  render() {
    // render only if logged in
    if (this.props.user) {
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
    } else {
      this.props.history.push("/");
    }
  }
}

function mapStateToProps(state) {
  return { user: state.user };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ checkForUser }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserMain);
