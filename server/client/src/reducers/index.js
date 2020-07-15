import { combineReducers } from "redux";
import userReducer from "./userReducer";
import userDataReducer from "./userDataReducer";
import taskReducer from "./taskReducer";
import timerReducer from "./timerReducer";

const rootReducer = combineReducers({
  user: userReducer,
  userData: userDataReducer,
  task: taskReducer,
  timer: timerReducer,
});

export default rootReducer;
