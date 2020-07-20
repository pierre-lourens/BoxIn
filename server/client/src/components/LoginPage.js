import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import googleButton from "../assets/googleButton.png";
import Header from "./Header";

class LoginPage extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Header />
        <Wrapper>
          <div>
            {/* react will replace hardcoded value here */}
            <a href='http://localhost:5000/api/auth/google/'>
              <AuthButton>
                <img
                  src={googleButton}
                  alt='login button for Google authentication'
                />
              </AuthButton>
            </a>
          </div>
        </Wrapper>
      </React.Fragment>
    );
  }
}
function mapStateToProps(state) {
  return { currentEvent: state.event };
}

export default connect(mapStateToProps)(LoginPage);

const Wrapper = styled.div`
  display: grid;
  grid-column-template: 3;
  grid-column-rows: 300px;
  align-items: center;
  justify-items: center;
`;
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
