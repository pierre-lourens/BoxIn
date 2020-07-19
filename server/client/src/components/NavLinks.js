import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

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
  
  .current {
    font-weight: 800;
    color: white;
  }

  span {
    color: ${(props) => props.theme.colors.offWhite};
    font-size: ${(props) => props.theme.fontSizes.smallplus};
    font-weight: 400;
    text-decoration: none;
    border-bottom: 3px solid ${(props) => props.theme.colors.darkBlue};
    &: hover {
      border-bottom: ${(props) => {
        if (props.current !== true) {
          return `3px solid ${props.theme.colors.offWhite}`;
        }
      }}};
    }
  }
`;

const NavLinks = (props) => {
  const determineIfCurrentPage = (path) => {
    const pathFromRouter = props.location.pathname;
    if (path === pathFromRouter) {
      return "current";
    }
  };

  return (
    <NavBar>
      <StyledButton>
        <Link to={"/me"}>
          <span className={determineIfCurrentPage("/me")}>Tasks</span>
        </Link>
      </StyledButton>

      <StyledButton>
        <Link to={"/reports"}>
          <span className={determineIfCurrentPage("/reports")}>Reports</span>
        </Link>
      </StyledButton>

      <StyledButton>
        <Link to={"/login"}>
          <span className={determineIfCurrentPage("/login")}>Sign Out</span>
        </Link>
      </StyledButton>
    </NavBar>
  );
};

export default withRouter(NavLinks);
