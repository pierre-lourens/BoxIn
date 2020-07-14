import React from "react";
import { Switch, Route } from "react-router-dom";

// component imports
import Header from "./Header";
import LoginPage from "./LoginPage";

function App() {
  return (
    <React.Fragment>
      <Header />
      <Switch>
        <Route exact path={"/login"} component={LoginPage} />
      </Switch>
    </React.Fragment>
  );
}

export default App;
