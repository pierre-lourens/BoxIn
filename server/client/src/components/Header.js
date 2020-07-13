import React from "react";
import styled from "styled-components";
import MainTaskAdder from "./MainTaskAdder";

const Wrapper = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 100px;
  background-color: ${(props) => props.theme.colors.darkBlue};
  box-shadow: 0 4px 6px 0 rgba(100, 100, 100, 0.2);
  justify-items: center;
  align-items: center;
`;

const StyledHeader = styled.header`
  grid-column: span 3;
  grid-row: 1;
`;

const Logo = styled.h1`
  font-family: ${(props) => props.theme.headingFonts.toString()};
  padding: 0;
  margin: 0;
  color: white};
  span {
    border: 2px solid white;
    padding: 3px 6px;
    margin: 3px;
  }
  @media (max-width: 600px) {
    font-size: ${(props) => props.theme.fontSizes.xmedium};
`;

const Header = () => {
  return (
    <React.Fragment>
      <Wrapper>
        <StyledHeader>
          <Logo>
            <span>Box</span>Out
          </Logo>
        </StyledHeader>
        <MainTaskAdder />
      </Wrapper>
    </React.Fragment>
  );
};

export default Header;
