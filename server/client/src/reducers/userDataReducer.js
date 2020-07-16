import { ADD_TASK, SEND_TASK_BOXES, GET_TASKS } from "../actions/index";

// by default, state is an array of tasks

export default function (state = {}, action) {
  switch (action.type) {
    case ADD_TASK:
      console.log("action.payload for ADD_TASK is", action.payload);
      return action.payload.data;
    case SEND_TASK_BOXES:
      console.log("action.payload for SEND_TASK_BOXES is", action.payload);
      return action.payload.data;
    case GET_TASKS:
      return action.payload.data;
    default:
      return state;
  }
}
