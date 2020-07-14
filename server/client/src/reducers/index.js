import { combineReducers } from "redux";
import userReducer from "./userreducer";
import taskReducer from "./taskReducer";

const rootReducer = combineReducers({
  user: userReducer,
  tasks: taskReducer,
});

export default rootReducer;
