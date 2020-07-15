import React from "react";
import styled from "styled-components";
import { getTasks } from "../actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PlayIcon from "../assets/PlayIcon";
import PauseIcon from "../assets/PauseIcon";
import PencilAltIcon from "../assets/PencilAltIcon";
import CheckCircleIcon from "../assets/CheckCircleIcon";
import EmptyCircleIcon from "../assets/emptycircle.png";

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

    this.renderTaskCards = this.renderTaskCards.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.userId !== prevProps.userId) {
      this.props.getTasks(this.props.userId);
    }
  }

  renderTaskCards() {
    if (this.props.userData.tasks) {
      return this.props.userData.tasks.map((task) => {
        return (
          <Task key={task._id}>
            <button>
              <img src={EmptyCircleIcon} />
            </button>
            <div className='text'>{task.text}</div>
            <div className='options'>
              <button>
                <PlayIcon />
              </button>
              <button>
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
  return { userId: state.user._id, userData: state.userData };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getTasks }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);
