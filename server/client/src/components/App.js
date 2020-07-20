import React from "react";
import { Switch, Route } from "react-router-dom";

// component imports
import LoginPage from "./LoginPage";
import UserMain from "./UserMain";
import Reports from "./Reports";

function App() {
  return (
    <React.Fragment>
      <Switch>
        <Route exact path={"/login"} component={LoginPage} />
        <Route exact path={"/me"} component={UserMain} />
        <Route exact path={"/"} component={UserMain} />
        <Route exact path={"/reports"} component={Reports} />
      </Switch>
    </React.Fragment>
  );
}

export default App;
