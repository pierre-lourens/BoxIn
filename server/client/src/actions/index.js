import axios from "axios";

export const GOOGLE_LOGIN = "GOOGLE_LOGIN";

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
  } else {
    request.then(`Login attempted for type ${method}`);
  }

  return {
    type: type,

    payload: request,
  };
}
