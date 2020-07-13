import React from "react";
import styled from "styled-components";

const StyledInputContainer = styled.div`
  grid-row: 1;
  grid-column: span 2;
  background-color: ${(props) => props.theme.colors.darkBlue};
  width: 100%;

  input {
    height: 30px;
    padding: 5px 10px;
    width: 90%;
  }
`;

const Navigation = () => {
  return <div></div>;
};

export default Navigation;
