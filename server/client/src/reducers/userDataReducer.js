import { SEND_TASK_BOXES, GET_TASKS } from "../actions/index";

// by default, state is an array of tasks

export default function (state = {}, action) {
  switch (action.type) {
    case GET_TASKS:
      return action.payload.data;
    default:
      return state;
  }
}
