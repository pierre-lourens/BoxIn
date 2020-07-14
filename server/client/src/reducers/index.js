import { combineReducers } from "redux";
import AuthenticationReducer from "./AuthenticationReducer";
import taskReducer from "./taskReducer";

const rootReducer = combineReducers({
  auth: AuthenticationReducer,
  tasks: taskReducer,
});

export default rootReducer;
