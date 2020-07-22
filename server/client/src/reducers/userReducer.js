import { CHECK_FOR_USER } from "../actions/index";

export default function (state = {}, action) {
  switch (action.type) {
    case CHECK_FOR_USER:
      console.log("Action payload for CHECK_FOR_USER is ", action.payload);
      // if (action.payload.request.status === 200) {
      //   return ;
      // } else {
      //   return state;
      // }
      return action.payload.data;
    default:
      return state;
  }
}
