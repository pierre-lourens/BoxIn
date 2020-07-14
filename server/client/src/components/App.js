import React from "react";
import { Switch, Route } from "react-router-dom";

// component imports
import Header from "./Header";
import LoginPage from "./LoginPage";
import UserMain from "./UserMain";

function App() {
  return (
    <React.Fragment>
      <Switch>
        <Route exact path={"/login"} component={LoginPage} />
        <Route exact path={"/me"} component={UserMain} />
      </Switch>
    </React.Fragment>
  );
}

export default App;
