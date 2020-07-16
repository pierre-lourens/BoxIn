import { SEND_TASK_BOXES, ADD_TASK_TO_BOX, GET_TASK_BOXES } from "../actions/index";

// with all of these, expect an object of boxes namespaced by their titles to come back

export default function (state = {}, action) {
  let boxes;
  switch (action.type) {
    case ADD_TASK_TO_BOX:
      console.log("action.payload for ADD_TASK is", action.payload);
      //it comes back as an array, so we need to name space it
      boxes = action.payload.data.reduce((boxesObject, box) => {
        boxesObject[box.title] = { title: box.title, taskIds: box.taskIds };
        return boxesObject;
      }, {});
      console.log("boxes are", boxes);
      return boxes;
    case SEND_TASK_BOXES:
      console.log("action.payload for SEND_TASK_BOXES is", action.payload);
      boxes = action.payload.data.reduce((boxesObject, box) => {
        boxesObject[box.title] = { title: box.title, taskIds: box.taskIds };
        return boxesObject;
      }, {});
      console.log("boxes are", boxes);
      return boxes;
    case GET_TASK_BOXES:
      console.log("action.payload for GET_TASK_BOXES is", action.payload.data);
      boxes = action.payload.data.reduce((boxesObject, box) => {
        boxesObject[box.title] = { title: box.title, taskIds: box.taskIds };
        return boxesObject;
      }, {});
      console.log("boxes are", boxes);
      return boxes;
    default:
      return state;
  }
}
