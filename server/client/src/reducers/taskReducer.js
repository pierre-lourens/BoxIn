import { EDIT_TASK, ADD_TASK } from "../actions/index";

// by default, state is an array of tasks

export default function (state = {}, action) {
  switch (action.type) {
    case EDIT_TASK:
      console.log("action.payload for EDIT_TASK is", action.payload);
      return { ...state, ...action.payload.data };
    case ADD_TASK:
      return { ...state, ...action.payload.data };
    default:
      return state;
  }
}
