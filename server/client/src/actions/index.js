import axios from "axios";

export const GOOGLE_LOGIN = "GOOGLE_LOGIN";
export const ADD_TASK = "ADD_TASK";

const ROOT_URL = "http://localhost:5000";

export function login(method, formProps, callback) {
  let request;
  let type;

  // accommodate different kinds of authorization
  switch (method) {
    case "GOOGLE":
      request = axios.get(`${ROOT_URL}/api/auth/google`);
      type = GOOGLE_LOGIN;
      break;
    default:
      break;
  }

  if (callback) {
    request.then(callback());
  }

  return {
    type: type,
    payload: request,
  };
}

export function addTask(taskToAdd) {
  const url = `${ROOT_URL}/api/me/task`;

  const request = axios({
    method: "post",
    url: url,
    data: {
      text: taskToAdd.text,
      userId: taskToAdd.userId,
    },
  });

  return {
    type: ADD_TASK,
    payload: request,
  };
}
