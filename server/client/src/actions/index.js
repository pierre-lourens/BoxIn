import axios from "axios";

export const CHECK_FOR_USER = "CHECK_FOR_USER";
export const ADD_TASK = "ADD_TASK";
export const EDIT_TASK = "EDIT_TASK";
export const GET_TASKS = "GET_TASKS";
export const SHOW_EDIT_MODAL = "SHOW_EDIT_MODAL";
export const START_TIMER = "START_TIMER";
export const STOP_TIMER = "STOP_TIMER";

const ROOT_URL = "http://localhost:5000";

export function checkForUser() {
  const url = `${ROOT_URL}/api/current_user`;
  const request = axios.get(url, { withCredentials: true });

  return {
    type: CHECK_FOR_USER,
    payload: request,
  };
}

export function addTask(taskToAdd, userId) {
  const url = `${ROOT_URL}/api/me/task`;

  console.log("taskToAdd is", taskToAdd);

  const request = axios({
    method: "post",
    url: url,
    withCredentials: true,
    data: {
      text: taskToAdd.text,
      userId,
    },
  });

  return {
    type: ADD_TASK,
    payload: request,
  };
}

export function editTask(taskId, changesObject) {
  const url = `${ROOT_URL}/api/tasks/${taskId}`;

  const request = axios({
    method: "put",
    url: url,
    withCredentials: true,
    data: {
      text: changesObject.text,
      status: changesObject.status,
    },
  });

  return {
    type: EDIT_TASK,
    payload: request,
  };
}

export function startTimer(taskId, userId) {
  const url = `${ROOT_URL}/api/me/timeEntry`;

  const request = axios({
    method: "post",
    url: url,
    withCredentials: true,
    data: {
      taskId,
      userId,
    },
  });

  return {
    type: START_TIMER,
    payload: request,
  };
}

export function stopTimer(timeEntryId, userId) {
  const url = `${ROOT_URL}/api/me/timeEntry`;

  const request = axios({
    method: "put",
    url: url,
    withCredentials: true,
    data: { timeEntryId, userId },
  });

  return {
    type: STOP_TIMER,
    payload: request,
  };
}

export function getTasks(userId) {
  const url = `${ROOT_URL}/api/${userId}/tasks`;

  console.log("userid being sent is", userId);

  const request = axios({
    method: "get",
    url: url,
    withCredentials: true,
  });

  return {
    type: GET_TASKS,
    payload: request,
  };
}
