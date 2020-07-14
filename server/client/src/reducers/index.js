import { combineReducers } from "redux";
import AuthenticationReducer from "./AuthenticationReducer";

const rootReducer = combineReducers({
  auth: AuthenticationReducer,
});

export default rootReducer;
