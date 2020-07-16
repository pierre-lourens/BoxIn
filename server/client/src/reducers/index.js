import { combineReducers } from "redux";
import userReducer from "./userReducer";
import userDataReducer from "./userDataReducer";
import taskReducer from "./taskReducer";
import timerReducer from "./timerReducer";
import boxesReducer from "./boxesReducer";

const rootReducer = combineReducers({
  user: userReducer,
  userData: userDataReducer,
  task: taskReducer,
  timer: timerReducer,
  boxes: boxesReducer,
});

export default rootReducer;
