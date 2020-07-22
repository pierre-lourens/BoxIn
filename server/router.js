const mongoose = require("mongoose");

const Task = require("./models/taskSchema");
const passport = require("passport");
const User = require("./models/userSchema");
const boxSchema = require("./models/boxSchema");
const faker = require("faker");
const TimeEntry = require("./models/timeEntrySchema");
const differenceInSeconds = require("date-fns/differenceInSeconds");
var parse = require("date-fns/parse");
var subDays = require("date-fns/subDays");
var addMinutes = require("date-fns/addMinutes");
var addSeconds = require("date-fns/addSeconds");
var addDays = require("date-fns/addDays");

const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

module.exports = function (router) {
  // AUTHENTICATION
  router.get("/logout", function (req, res) {
    console.log("logged out!");
    req.logout();
    res.redirect("/");
  });

  // will be used as middleware so that I can use multiple strategies
  function ensureAuthenticated(req, res, next) {
    console.log("req in ensureauthenticated is", req);

    if (req.isAuthenticated()) {
      return next(null);
    }
    // res.redirect("http://localhost3000/error");
  }

  router.get("/api/current_user", ensureAuthenticated, (req, res) => {
    console.log(req);
    return res.send(req.user);
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
    task.tag = req.body.task.tag;
    task.visibility = "visible";
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
          (box) => box.title == "allTasks"
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
        tag,
        dueDate,
      } = req.body.task;

      task.status = status;
      task.estimatedTime = estimatedTime;
      task.text = text;
      task.visibility = visibility;
      task.weight = weight;
      task.tag = tag;
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
    timeEntry.startDate = new Date();

    // need to save it to the right task
    Task.findByIdAndUpdate(
      { _id: req.body.taskId },
      { $push: { timeEntries: timeEntry._id } }
    ).exec((err, task) => {
      if (err) return res.send(err);

      task.save();
    });

    // need to save it to the right user
    User.findByIdAndUpdate(
      { _id: req.body.userId },
      { $push: { timeEntries: timeEntry._id } }
    ).exec((err, user) => {
      if (err) return res.send(err);

      user.save();
    });

    console.log("HIIII");
    timeEntry.save();

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

      console.log("timeEntry is", timeEntry);

      timeEntry.save();

      const elapsedTime = differenceInSeconds(
        timeEntry.endDate,
        timeEntry.startDate
      );
      // need to save it to the right task
      Task.findByIdAndUpdate(
        { _id: req.body.taskId },
        { $inc: { actualTime: elapsedTime } }
      ).exec((err, task) => {
        if (err) return res.send(err);

        task.timeEntries.push(timeEntry._id);
      });

      Task.findByIdAndUpdate(
        { _id: req.body.taskId },
        { $push: { timeEntries: timeEntry._id } }
      ).exec((err, task) => {
        if (err) return res.send(err);
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
      console.log("the time entry is", timeEntry);
      timeEntry.active = false;
      timeEntry.endDate = new Date();
      console.log("the time entry is", timeEntry);

      User.findById(req.body.userId).exec((err, user) => {
        if (err) return res.send(err);
        // find the time entry within that user so that we can replace it with our new one
        const timeEntryIndex = user.timeEntries.findIndex((entry) => {
          return entry == req.body.timeEntryId;
        });

        // delete the old and insert the new
        user.timeEntries.splice(timeEntryIndex, 1, timeEntry._id);

        user.save();
      });

      const elapsedTime = differenceInSeconds(
        timeEntry.endDate,
        timeEntry.startDate
      );

      Task.findByIdAndUpdate(
        { _id: req.body.taskId },
        { $inc: { actualTime: elapsedTime } }
      ).exec((err, task) => {
        if (err) return res.send(err);
        console.log("TASK IS", task);
        task.save();
      });

      timeEntry.save();
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

      console.log("AHH and user.boxes is", user.boxes);

      return res.send(user.boxes);
    });
  });

  router.post("/api/:userId/boxes", ensureAuthenticated, (req, res, next) => {
    User.findById(req.params.userId).exec((err, user) => {
      if (err) return res.send(err);

      console.log("REQ.BODY is", req.body);
      const newBox = {
        title: req.body.boxTitle,
        taskIds: [],
        time: req.body.time,
      };

      user.boxes.push(newBox);
      user.boxOrder.push(newBox.title);
      user.save();

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

  router.get(
    "/api/:userId/generate-fake-data",
    ensureAuthenticated,
    (req, res, next) => {
      User.findById(req.params.userId).exec((err, user) => {
        if (err) return res.send(err.message);

        console.log("user is", user);
        // check if the user already has "allBoxes"

        console.log("user is", user);

        for (let i = 0; i < 45; i++) {
          let task = new Task();

          task.text = faker.lorem.words();

          let randomNumberForDate = getRandomIntInclusive(1, 28);
          let day = subDays(new Date(), randomNumberForDate);
          task.createdAt = day;

          let randomNumForAddedDays = getRandomIntInclusive(0, 4);
          let randomNumForAddedMins = getRandomIntInclusive(0, 25);
          let randomNumForAddedSeconds = getRandomIntInclusive(0, 60);
          let dayAdded = addDays(day, randomNumForAddedDays);
          dayAdded = addMinutes(day, randomNumForAddedMins);
          dayAdded = addSeconds(day, randomNumForAddedSeconds);
          task.updatedAt = dayAdded;

          let randomNumberForStatus = getRandomIntInclusive(0, 1);
          const statusOptions = ["incomplete", "complete"];
          task.status = statusOptions[randomNumberForStatus];

          let randomNumberForTags = getRandomIntInclusive(0, 6);
          const tagOptions = [
            "email",
            "code-review",
            "coding",
            "housework",
            "professional development",
            "investing",
            "misc",
          ];
          task.tag = tagOptions[randomNumberForTags];

          function getRandomIntInclusive(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
          }

          let randomNumberForTimeEstimate = getRandomIntInclusive(0, 4);
          const intervals = [30, 45, 60, 90, 120];
          task.estimatedTime = intervals[randomNumberForTimeEstimate];

          // time entries
          for (let i = 0; i < 3; i++) {
            let timeEntry = new TimeEntry();
            timeEntry.active = false;

            let day = task.updatedAt;
            let dayStartAdd = addMinutes(day, getRandomIntInclusive(0, 15));
            dayStartAdd = addSeconds(day, getRandomIntInclusive(0, 60));
            timeEntry.startDate = dayStartAdd;

            let dayEndAdded = addMinutes(
              dayStartAdd,
              getRandomIntInclusive(0, 25)
            );
            dayEndAdded = addSeconds(dayStartAdd, getRandomIntInclusive(0, 60));
            timeEntry.endDate = dayEndAdded;

            timeEntry.task = task._id;
            user.timeEntries.push(timeEntry);

            const elapsedTime = differenceInSeconds(
              timeEntry.endDate,
              timeEntry.startDate
            );
            task.actualTime += elapsedTime;

            task.timeEntries.push(timeEntry._id);
            user.timeEntries.push(timeEntry);
            timeEntry.task = task._id;
            timeEntry.save();
          }

          let randomNumberForVisibility = getRandomIntInclusive(0, 10);
          if (randomNumberForVisibility > 9) {
            task.visibility = "visible";
          } else {
            task.visibility = "archived";
          }

          user.tasks.push(task);

          const alreadyThere = user.boxes.findIndex(
            (box) => box.title == "allTasks"
          );

          console.log("already there is", alreadyThere);
          if (alreadyThere === -1) {
            const allTasksBox = { title: "allTasks", taskIds: [] };
            user.boxes.push(allTasksBox);
          }

          const allTasksIndex = user.boxes.findIndex(
            (box) => box.title == "allTasks"
          );
          // only if not archived
          if (task.visibility === "visible") {
            user.boxes[allTasksIndex].taskIds.push(task._id);
          }

          task.save();
        }
        user.save();
        console.log("now user is", user);
        return res.send(user);
      });
    }
  );
};
