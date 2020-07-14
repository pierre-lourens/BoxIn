import React from "react";
// import { Link } from "react-router-dom";
// redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { login } from "../actions/index";
// style
import styled from "styled-components";
import googleButton from "../assets/googleButton.png";

const AuthButton = styled.button`
  background: inherit;
  width: 200px;
  border: 0;
  padding: 0;
  margin: 0;

  img {
    width: 100%;
  }
  :active {
    width: 201px;
    border: 0;
    background: inherit;
  }
`;

class LoginPage extends React.Component {
  render() {
    return (
      <div>
        <a href='http://localhost:5000/api/auth/google/'>
          <AuthButton onClick={this.handleGoogleClick}>
            <img src={googleButton} alt='login button for Google authentication' />
          </AuthButton>
        </a>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return { currentEvent: state.event };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ login }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
