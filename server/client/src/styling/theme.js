import React from "react";
import { ThemeProvider } from "styled-components";

const theme = {
  colors: {
    primaryBlue: "#3A5D9C",
    lightBlue: "#6D9AE8",
    darkBlue: "#183159",
    darkBrown: "#4F3A0D",
    lightBrown: "#9C7C3A",
    lightGray: "#DADEE6",
    darkestGray: "#3A404D",
    darkGray: "#545C6E",
    mediumGray: "#919499",
    yellow: "#E8DF97",
    offWhiteComplete: "#E6EAF2",
    offWhite: "#E9EDF5",
    evenWhiterThanOffWhite: "#F6FBFF",
  },
  fonts: ["sans-serif", "Roboto"],
  headingFonts: ["Helvetica", "sans-serif", "Roboto"],
  fontSizes: {
    xsmall: ".8em",
    small: "1em",
    smallplus: "1.25em",
    medium: "2em",
    large: "3em",
  },
};

const Theme = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

export default Theme;
