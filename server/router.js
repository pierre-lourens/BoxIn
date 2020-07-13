const mongoose = require("mongoose");

const Task = require("./models/taskSchema");
const User = require("./models/userSchema");
const { text } = require("body-parser");

module.exports = function (router) {
  // get all tasks for a user
  router.get("/api/me/tasks", (request, response, next) => {
    if (!mongoose.Types.ObjectId.isValid(request.params.userID)) {
      // if event id is not in the correct format, return an error
      response.writeHead(400, "Invalid user ID");
      return response.end();
    }

    User.findById(request.body.userId)
      .populate("tasks")
      .exec((err, user) => {
        if (err) return response.send(error.message);

        return response.send(user);
      });
  });

  // creates a new user
  router.post("/api/new-user", (request, response, next) => {
    // edge cases
    if (!request.body.username) {
      response.writeHead(400, "Invalid format for adding new user");
      return response.send();
    }

    // check that the username is not already in the database
    // if username not taken, construct & save the user to the db
    let user = new User();
    user.username = request.body.username;

    user.save((err) => {
      if (err) return next(err);
    });

    return response.send({ Status: "Successfully added", user });
  });

  // post a new task
  router.post("/api/me/task", (request, response, next) => {
    // check that the body contains at least a task text
    if (!request.body.text) {
      response.writeHead(
        400,
        "Invalid format; task must contain a text property"
      );
      return response.send();
    }

    // there needs to be an associated user
    if (!request.body.userId) {
      response.writeHead(400, "No user specified");
      return response.send();
    }

    const task = new Task();
    task.text = request.body.text;
    task.user = request.body.userId;

    // need to save it to the right user
    User.findById(request.body.userId).exec((err, user) => {
      if (err) return response.send(err);
      user.tasks.push(task);

      user.save();
    });

    task.save();
    // send back the added task
    return response.send({ Status: "Successfully added", task });
  });
};


