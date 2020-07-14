import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { checkForUser } from "../actions";
// import styled from "styled-components";

import Header from "./Header";
import QuickTaskForm from "./QuickTaskForm";
import TaskList from "./TaskList";

class UserMain extends React.Component {
  constructor(props) {
    super(props);
    this.props.checkForUser();
  }

  render() {
    // render only if logged in
    if (this.props.user) {
      return (
        <React.Fragment>
          <Header />
          <QuickTaskForm />
          <TaskList />
        </React.Fragment>
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
