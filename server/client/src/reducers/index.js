import { combineReducers } from "redux";
import userReducer from "./userReducer";
import userDataReducer from "./userDataReducer";
import taskReducer from "./taskReducer";

const rootReducer = combineReducers({
  user: userReducer,
  userData: userDataReducer,
  task: taskReducer,
});

export default rootReducer;
