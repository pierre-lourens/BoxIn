import React from "react";
import styled from "styled-components";

const StyledInputContainer = styled.div`
  grid-row: 1;
  grid-column: span 4;
  background-color: ${(props) => props.theme.colors.darkBlue};
  width: 100%;

  input {
    height: 30px;
    padding: 5px 10px;
    width: 100%;
  }
`;

const MainTaskAdder = () => {
  return (
    <StyledInputContainer>
      <input placeholder='Add a task...'></input>
    </StyledInputContainer>
  );
};

export default MainTaskAdder;
