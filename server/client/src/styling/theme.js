import React from "react";
import { ThemeProvider } from "styled-components";

const theme = {
  colors: {
    primaryBlue: "#3A5D9C",
    lightBlue: "#6D9AE8",
    darkBlue: "#152B4F",
    darkBrown: "#4F3A0D",
    lightBrown: "#9C7C3A",
    lightGray: "#DADEE6",
  },
  fonts: ["sans-serif", "Roboto"],
  headingFonts: ["Helvetica", "sans-serif", "Roboto"],
  fontSizes: {
    small: "1em",
    smallplus: "1.25em",
    medium: "2em",
    large: "3em",
  },
};

const Theme = ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>;

export default Theme;
