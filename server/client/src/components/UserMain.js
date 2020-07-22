import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { checkForUser } from "../actions";
import styled from "styled-components";

import Header from "./Header";
import QuickTaskForm from "./QuickTaskForm";
import TaskList from "./TaskList";
import DemoButton from "./Buttons/DemoButton";

class UserMain extends React.Component {
  constructor(props) {
    super(props);

    this.state = { showDemoBox: true };
  }

  componentDidMount(prevProps) {
    this.props.checkForUser();
    // if (!prevProps.user.hasOwnProperty("_id")) {
    //   this.props.checkForUser();
    // }
  }

  changeDemoBox = () => {
    this.setState({ showDemoBox: false });
  };

  renderIfLoggedIn = () => {
    if (this.props.user.hasOwnProperty("_id")) {
      return (
        <React.Fragment>
          <QuickTaskForm />
          <Wrapper>
            <TaskList />
          </Wrapper>
        </React.Fragment>
      );
    }
  };

  render() {
    return (
      <RelativeWrapper>
        <Header />
        {this.renderIfLoggedIn()}
        {/* {this.state.showDemoBox ? (
          <DemoButton changeDemoBox={this.changeDemoBox} />
        ) : null} */}
      </RelativeWrapper>
    );
  }
}

function mapStateToProps(state) {
  return { user: state.user };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ checkForUser }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserMain);

const Wrapper = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(12, 1fr);
  max-width: 2000px;
  margin: 0 auto;
  // grid-template-rows: 30px;
`;

const RelativeWrapper = styled.div`
  position: relative;
`;
