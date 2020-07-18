import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const NavBar = styled.div`
  grid-column: 8 / span 4;
  grid-row: 1;
  justify-self: end;

  @media (max-width: 840px) {
    grid-column: 4 / span 8;
  }
`;

const StyledButton = styled.button`
  margin-left: 20px;

  line-height: 1.2;
  box-sizing: content-box;

  background-color: inherit;
  border: 0;

  a {
    text-decoration: none;
  }
  span {
    color: ${(props) => {
      if (props.current === true) {
        return "white";
      } else {
        return props.theme.colors.offWhite;
      }
    }}};
    font-size: ${(props) => props.theme.fontSizes.small};
    font-weight: ${(props) => {
      if (props.current === true) {
        return "800";
      } else {
        return "400";
      }
    }}};
    text-decoration: none;
    border-bottom: 3px solid ${(props) => props.theme.colors.darkBlue};
    &: hover {
      border-bottom: ${(props) => {
        if (props.current != true) {
          return `3px solid ${props.theme.colors.offWhite}`;
        }
      }}};
    }
  }
`;

const NavLinks = () => {
  return (
    <NavBar>
      <StyledButton current={true}>
        <Link to={"/me"}>
          <span>Tasks</span>
        </Link>
      </StyledButton>

      <StyledButton>
        <Link to={"/review"}>
          <span>Review</span>
        </Link>
      </StyledButton>

      <StyledButton>
        <Link to={"/login"}>
          <span>Sign Out</span>
        </Link>
      </StyledButton>
    </NavBar>
  );
};

export default NavLinks;
