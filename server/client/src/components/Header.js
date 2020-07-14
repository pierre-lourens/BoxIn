import React from "react";
import styled from "styled-components";
import MainTaskAdder from "./QuickTaskForm";

const AppBar = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 70px;
  background-color: ${(props) => props.theme.colors.darkBlue};
  box-shadow: 0 4px 6px 0 rgba(100, 100, 100, 0.2);
  justify-items: center;
  align-items: center;
  margin-bottom: 30px;
  @media (max-width: 600px) {
    grid-template-rows: 50px;
  }
`;

const StyledHeader = styled.header`
  grid-column: span 12;
  grid-row: 1;
`;

const Logo = styled.h1`
  font-family: ${(props) => props.theme.headingFonts.toString()};
  padding: 0;
  margin: 0px;
  color: white;
  span {
    border: 2px solid white;
    padding: 3px 6px;
    margin: 0 4px 0 0;
  }
  @media (max-width: 600px) {
    font-size: ${(props) => props.theme.fontSizes.small};
  }
`;

const Header = () => {
  return (
    <React.Fragment>
      <AppBar>
        <StyledHeader>
          <Logo>
            <span>Box</span>Out
          </Logo>
        </StyledHeader>
      </AppBar>
    </React.Fragment>
  );
};

export default Header;
