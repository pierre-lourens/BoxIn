import { EDIT_TASK, ADD_TASK, GENERATE_FAKE_DATA } from "../actions/index";

// by default, state is an array of tasks

export default function (state = {}, action) {
  switch (action.type) {
    case EDIT_TASK:
      // console.log("action.payload for EDIT_TASK is", action.payload);
      return action.payload.data;
    case ADD_TASK:
      return action.payload.data;
    case GENERATE_FAKE_DATA:
      // console.log(
      //   "action payload for generate fake data in task reducer is",
      //   action.payload
      // );
      return action.payload.data.tasks[0];
    default:
      return state;
  }
}
