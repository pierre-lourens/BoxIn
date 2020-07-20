import { GET_TASKS, GENERATE_FAKE_DATA } from "../actions/index";

// by default, state is an array of tasks

export default function (state = {}, action) {
  switch (action.type) {
    case GET_TASKS:
      return action.payload.data;
    case GENERATE_FAKE_DATA:
      return action.payload.data || state;
    default:
      return state;
  }
}
