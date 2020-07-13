import React from "react";
import styled from "styled-components";

const StyledInputContainer = styled.div`
  grid-row: 1;
  grid-column: span 6;
  height: 100%;
  background-color: ${(props) => props.theme.colors.darkBlue};
`;

const Logo = styled.h1`
  font-family: ${(props) => props.theme.headingFonts.toString()};
  padding: 0;
  margin: 0;
  color: ${(props) => props.theme.colors.lightBlue};
`;

const MainTaskAdder = () => {
  return <StyledInputContainer>Hi</StyledInputContainer>;
};

export default MainTaskAdder;
