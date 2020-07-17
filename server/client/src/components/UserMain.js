import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { checkForUser } from "../actions";
import styled from "styled-components";

import Header from "./Header";
import QuickTaskForm from "./QuickTaskForm";
import TaskList from "./TaskList";

const Wrapper = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 30px;
  margin-bottom: 30px;
`;

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
          <Wrapper>
            <TaskList />
          </Wrapper>
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
