import React from "react";
import styled from "styled-components";
import { getTasks } from "../actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

const StyledInputContainer = styled.div``;

const TaskFormContainer = styled.div``;

class TaskList extends React.Component {
  constructor(props) {
    super(props);

    this.renderTaskCards = this.renderTaskCards.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.userId !== prevProps.userId) {
      this.props.getTasks(this.props.userId);
    }
  }

  renderTaskCards() {
    console.log("From inside renderTaskCards", this.props.userData);
    console.log("this.props.userData.tasks is", this.props.userData.tasks);

    if (this.props.userData.tasks) {
      return this.props.userData.tasks.map((task) => {
        return <li>{task.text}</li>;
      });
    } else {
      return <div>HIII</div>;
    }
  }

  render() {
    console.log("Inside render, this.props is", this.props);

    return <ol>{this.renderTaskCards()}</ol>;
  }
}

function mapStateToProps(state) {
  console.log("state being mapped to props in tasklist is is", state);
  return { userId: state.user._id, userData: state.userData };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getTasks }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);
