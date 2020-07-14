const mongoose = require("mongoose");

const Task = require("./models/taskSchema");
const passport = require("passport");
const User = require("./models/userSchema");
const TimeEntry = require("./models/timeEntrySchema");

const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

module.exports = function (router) {
  // AUTHENTICATION

  // will be used as middleware so that I can use multiple strategies
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      console.log(req);
      return next(null);
    }
    res.redirect("/error");
  }

  router.get("/api/current_user", ensureAuthenticated, (req, res) => {
    // console.log(req.user);
    console.log("hi'");
    res.send(req.user);
  });

  router.get("/api/logout", (req, res) => {
    req.logout();
    res.send(req.user);
  });

  // get all tasks for a user
  router.get("/api/me/tasks", ensureAuthenticated, (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.body.userId)) {
      // if event id is not in the correct format, return an error
      res.writeHead(400, "Must send valid user Id in body");
      return res.end();
    }

    User.findById(req.body.userId)
      .populate("tasks")
      .populate("timeEntries")
      .exec((err, user) => {
        if (err) return res.send(error.message);

        return res.send(user);
      });
  });

  // creates a new user
  router.post("/api/new-user", (req, res, next) => {
    // edge cases
    if (!req.body.username) {
      res.writeHead(400, "Invalid format for adding new user");
      return res.send();
    }

    // check that the username is not already in the database
    // if username not taken, construct & save the user to the db
    let user = new User();
    user.username = req.body.username;

    user.save((err) => {
      if (err) return next(err);
    });

    return res.send({ Status: "Successfully added", user });
  });

  // post a new task
  router.post("/api/me/task", ensureAuthenticated, (req, res, next) => {
    // check that the body contains at least a task text
    if (!req.body.text) {
      res.writeHead(400, "Invalid format; task must contain a text property");
      return res.send();
    }

    // there needs to be an associated user
    if (!req.body.userId) {
      res.writeHead(400, "No user specified");
      return res.send();
    }

    const task = new Task();
    task.text = req.body.text;
    task.user = req.body.userId;

    // need to save it to the right user
    User.findById(req.body.userId).exec((err, user) => {
      if (err) return res.send(err);
      user.tasks.push(task);

      user.save();
    });

    task.save();
    // send back the added task
    return res.send({ Status: "Successfully added", task });
  });

  // post a new time entry if one doesn't already exist
  router.post("/api/me/timeEntry", ensureAuthenticated, (req, res, next) => {
    // check that the body contains at least a task text
    if (!req.body.taskId) {
      res.writeHead(400, "Invalid format; task must contain a valid task id");
      return res.send();
    }

    const timeEntry = new TimeEntry();
    timeEntry.active = true;
    timeEntry.task = req.body.taskId;

    // need to save it to the right task
    Task.findById(req.body.taskId).exec((err, task) => {
      if (err) return res.send(err);

      console.log("task is found and is", task);
      task.timeEntries.push(timeEntry);

      task.save();
    });

    // need to save it to the right user
    User.findById(req.body.userId).exec((err, user) => {
      if (err) return res.send(err);

      console.log("user is found and is", user);
      user.timeEntries.push(timeEntry);

      user.save();
    });

    timeEntry.save();
    // send back the added task
    return res.send({
      Status: "Successfully started time entry",
      timeEntry,
    });
  });

  // ending an already running time entry
  router.put("/api/me/timeEntry", ensureAuthenticated, (req, res, next) => {
    TimeEntry.findById(req.body.timeEntryId).exec((err, timeEntry) => {
      if (err) return res.send(error);
      // calculate the elapsed time since the last time it was true
      const elapsedTime = new Date() - timeEntry.createdAt;

      timeEntry.elapsedTime = elapsedTime;
      timeEntry.active = false;
      timeEntry.save();
    });

    return res.send("Stopped time entry");
  });

  // route for populating a user within a task
  router.get("/api/me/tasks/:taskId", ensureAuthenticated, (req, res, next) => {
    Task.findById(req.params.taskId)
      .populate("user")
      .exec((err, task) => {
        if (err) return res.send(error.message);

        return res.send(task);
      });
  });
};
