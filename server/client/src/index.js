import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
import Theme from "./styling/theme.js";

ReactDOM.render(
  <React.StrictMode>
    <Theme>
      <App />
    </Theme>
  </React.StrictMode>,
  document.getElementById("root")
);
