const mongoose = require("mongoose");

const Task = require("./models/taskSchema");
const passport = require("passport");
const User = require("./models/userSchema");
const TimeEntry = require("./models/timeEntrySchema");

const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

module.exports = function (router) {
  // AUTHENTICATION

  // will be used as middleware so that I can use multiple strategies
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next(null);
    }
    // res.redirect("http://localhost3000/error");
  }

  router.get("/api/current_user", ensureAuthenticated, (req, res) => {
    res.send(req.user);
  });

  router.get("/api/logout", (req, res) => {
    req.logout();
    res.send(req.user);
  });

  // get all tasks for a user
  router.get("/api/:userId/tasks", ensureAuthenticated, (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      // if event id is not in the correct format, return an error
      res.writeHead(400, "Must send valid user Id in body");
      return res.end();
    }

    User.findById(req.params.userId)
      .populate({ path: "tasks", match: { visibility: { $ne: "disabled" } } })
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
    if (!req.body.task.text) {
      res.writeHead(400, "Invalid format; task must contain a text property");
      return res.send();
    }

    // there needs to be an associated user
    if (!req.body.userId) {
      res.writeHead(400, "No user specified");
      return res.send();
    }

    const task = new Task();
    task.text = req.body.task.text;
    task.user = req.body.userId;
    task.save();

    // need to save it to the right user
    User.findById(req.body.userId)
      .populate("tasks")
      .exec((err, user) => {
        if (err) return res.send(err);
        user.tasks.push(task);

        // by default, new tasks can be added to the 'allTasks' box
        // find the 'alltasks' one

        console.log("user is", user);

        allTasksboxCheck = user.boxes.find((box) => (box.title = "allTasks"));
        console.log("boxes check is is", allTasksboxCheck);

        // if there isn't one yet, make one
        if (!allTasksboxCheck) {
          // new default box to add
          const allTasksBox = { title: "allTasks", taskIds: [] };
          user.boxes.push(allTasksBox);
          console.log("now user is", user);
        }

        console.log("since it's true, user boxes is", user.boxes);

        const allTasksIndex = user.boxes.findIndex(
          (box) => box.title === "allTasks"
        );
        user.boxes[allTasksIndex].taskIds.push(task._id);
        user.save();

        return res.send(task);
      });
  });

  // make changes to a task attribute
  router.put("/api/tasks/:taskId", ensureAuthenticated, (req, res, next) => {
    // there needs to be an associated user
    if (!mongoose.Types.ObjectId.isValid(req.params.taskId)) {
      // if event id is not in the correct format, return an error
      res.writeHead(400, "Must send valid task Id in body");
      return res.end();
    }

    // need to save it to the right user
    Task.findById(req.params.taskId).exec((err, task) => {
      if (err) return res.send(err);
      const {
        status,
        estimatedTime,
        text,
        visibility,
        weight,
        tags,
        dueDate,
      } = req.body.task;

      task.status = status;
      task.estimatedTime = estimatedTime;
      task.text = text;
      task.visibility = visibility;
      task.weight = weight;
      task.tags = tags;
      task.dueDate = dueDate;

      task.save();
      return res.send(task);
    });
  });

  // post a new time entry if one doesn't already exist
  router.post("/api/me/timeEntry", ensureAuthenticated, (req, res, next) => {
    // check that the body contains at least a task text
    if (!mongoose.Types.ObjectId.isValid(req.body.taskId)) {
      // if event id is not in the correct format, return an error
      res.writeHead(400, "Must send valid task Id in body");
      return res.end();
    }

    const timeEntry = new TimeEntry();
    timeEntry.active = true;
    timeEntry.task = req.body.taskId;
    timeEntry.save();

    // need to save it to the right task
    Task.findById(req.body.taskId).exec((err, task) => {
      if (err) return res.send(err);

      console.log("task is found and is", task);
      task.timeEntries.push(timeEntry._id);

      task.save();
    });

    // need to save it to the right user
    User.findById(req.body.userId).exec((err, user) => {
      if (err) return res.send(err);

      console.log("user is found and is", user);
      user.timeEntries.push(timeEntry._id);

      user.save();
    });

    // send back the added task
    return res.send(timeEntry);
  });

  // post a new time entry if one doesn't already exist
  router.post(
    "/api/me/timeEntrySession",
    ensureAuthenticated,
    (req, res, next) => {
      // check that the body contains at least a task text
      if (!mongoose.Types.ObjectId.isValid(req.body.taskId)) {
        // if event id is not in the correct format, return an error
        res.writeHead(400, "Must send valid task Id in body");
        return res.end();
      }

      console.log("req.body is", req.body);

      const { startDate, endDate, taskId } = req.body;

      const timeEntry = new TimeEntry();
      timeEntry.active = false;
      timeEntry.startDate = startDate;
      timeEntry.endDate = endDate;
      timeEntry.task = taskId;
      const elapsedTime = timeEntry.endDate - timeEntry.startDate;
      timeEntry.elapsedTime = elapsedTime;
      console.log("timeEntry is", timeEntry);

      timeEntry.save();

      // need to save it to the right task
      Task.findById(req.body.taskId).exec((err, task) => {
        if (err) return res.send(err);

        console.log("task is found and is", task);
        task.timeEntries.push(timeEntry._id);

        task.save();
      });

      // need to save it to the right user
      User.findById(req.body.userId).exec((err, user) => {
        if (err) return res.send(err);

        console.log("user is found and is", user);
        user.timeEntries.push(timeEntry._id);

        user.save();
      });

      // send back the added task
      return res.send(timeEntry);
    }
  );

  // ending an already running time entry
  router.put("/api/me/timeEntry", ensureAuthenticated, (req, res, next) => {
    TimeEntry.findById(req.body.timeEntryId).exec((err, timeEntry) => {
      if (err) return res.send(error);
      // calculate the elapsed time since the last time it was true
      const elapsedTime = new Date() - timeEntry.createdAt;

      timeEntry.elapsedTime = elapsedTime;
      timeEntry.active = false;

      User.findById(req.body.userId).exec((err, user) => {
        if (err) return res.send(err);

        console.log("user is found and is", user);
        // find the time entry within that user so that we can replace it with our new one
        const timeEntryIndex = user.timeEntries.findIndex((entry) => {
          console.log(entry);
          return entry == req.body.timeEntryId;
        });
        // delete the old and insert the new
        console.log("timeEntryIndex is", timeEntryIndex);
        user.timeEntries.splice(timeEntryIndex, 1, timeEntry._id);
        user.save();
        timeEntry.save();
      });

      return res.send(timeEntry);
    });
  });

  // when the boxes change shape in state, the whole set is sent here
  router.put("/api/me/boxes", ensureAuthenticated, (req, res, next) => {
    User.findById(req.body.userId).exec((err, user) => {
      if (err) return res.send(err);

      user.boxes = req.body.boxes;
      user.save();

      return res.send(user.boxes);
    });
  });

  router.get("/api/:userId/boxes", ensureAuthenticated, (req, res, next) => {
    User.findById(req.params.userId).exec((err, user) => {
      if (err) return res.send(err);

      return res.send(user.boxes);
    });
  });

  // when the boxes change shape in state, the whole set is sent here
  router.post("/api/:userId/boxes", ensureAuthenticated, (req, res, next) => {
    User.findById(req.params.userId).exec((err, user) => {
      if (err) return res.send(err);

      const newBox = { title: req.body.boxTitle, taskIds: [] };

      console.log("POST IS HAPPENING. NEW BOX IS", newBox);
      user.boxes.push(newBox);
      user.save();
      console.log("POST IS HAPPENING. USER'S BOXES ARE", user.boxes);

      return res.send(user.boxes);
    });
  });

  router.delete("/api/:userId/boxes", ensureAuthenticated, (req, res, next) => {
    User.findById(req.params.userId).exec((err, user) => {
      if (err) return res.send(err);

      // find the box in the array in order to delete the right task Id
      const boxIndex = user.boxes.findIndex(
        (box) => box.title == req.body.title
      );

      const taskId = user.boxes[boxIndex].taskIds.find(
        (taskId) => taskId == req.body.taskId
      );

      const taskIdIndex = user.boxes[boxIndex].taskIds.findIndex(
        (taskId) => taskId == req.body.taskId
      );

      user.boxes[boxIndex].taskIds.splice(taskIdIndex, 1);
      console.log(user.boxes);
      user.save();
      return res.send(user.boxes);
    });
  });
  /* 
  // posting a new task to the user's box
  // to do: see if this route is even necessary given put above
  // and the fact that new tasks are always going to be in allTasks
  router.post("/api/:userId/boxes", ensureAuthenticated, (req, res, next) => {
    User.update({ id: req.params.userId }, { $push: { boxes: req.body.boxes } }).exec(
      (err, user) => {
        if (err) return res.send(err);

        return res.send(user.boxes);
      }
    );
  });
 */
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
