import { combineReducers } from "redux";
import userReducer from "./userReducer";
import userDataReducer from "./userDataReducer";

const rootReducer = combineReducers({
  user: userReducer,
  userData: userDataReducer,
});

export default rootReducer;
