import { GOOGLE_LOGIN } from "../actions/index";

export default function (state = false, action) {
  switch (action.type) {
    case GOOGLE_LOGIN:
      console.log("action.payload is", action.payload);
      return state;
    default:
      return state;
  }
}
