import { ADD_TASK } from "../actions/index";

// by default, state is an array of tasks

export default function (state = [], action) {
  switch (action.type) {
    case ADD_TASK:
      console.log("action.payload for ADD_TASK is", action.payload);
      return [action.payload.data.task, ...state];
    default:
      return state;
  }
}
