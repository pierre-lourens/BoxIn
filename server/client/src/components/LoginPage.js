import React from "react";
// import { Link } from "react-router-dom";
// redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
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
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        {/* react will replace hardcoded value here */}
        <a href='http://localhost:5000/api/auth/google/'>
          <AuthButton>
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

export default connect(mapStateToProps)(LoginPage);
