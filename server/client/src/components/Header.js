import React from "react";
import styled from "styled-components";
import NavLinks from "./NavLinks.js";

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
    position: absolute;
    top: 0;
    width: 100%;
  }
`;

const StyledHeader = styled.header`
  grid-column: 2 / span 6;
  grid-row: 1;
  justify-self: start;
  @media (max-width: 840px) {
    grid-column: 2 / span 3;
  }
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
            <span>Box</span>In
          </Logo>
        </StyledHeader>
        <NavLinks />
      </AppBar>
    </React.Fragment>
  );
};

export default Header;
