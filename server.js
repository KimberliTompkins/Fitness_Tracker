const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true })

// add new exercise
app.put("/api/workouts/:id", (req, res) => {
    var workout = new db.Workout(req.body);

    workout.incrementTotalDuration(req.body.duration);
    console.log(req.body)
    db.Workout.findOneAndUpdate(
        { _id: req.params.id },
        {  $push: { exercises: req.body }},
        { new: true }).then(dbWorkout => {
            res.json(dbWorkout);
        }).catch(err => {
            res.json(err);
        });

});

//create new workout
app.post("/api/workouts", ({ body }, res) => {

    db.Workout.create(body).then((dbWorkout => {
        res.json(dbWorkout);
    })).catch(err => {
        res.json(err);
    });
});

//get the workouts
app.get("/api/workouts", (req, res) => {

    db.Workout.find({}).then(dbWorkout => {
        dbWorkout.forEach(workout => {
            var addDuration = 0;
            workout.exercises.forEach(exercise => {
                addDuration += exercise.duration;
            });
            workout.totalDuration = addDuration;

        });

        res.json(dbWorkout);
    }).catch(err => {
        res.json(err);
    });
});

// get workouts in range
app.get("/api/workouts/range", (req, res) => {

    db.Workout.find({}).then(dbWorkout => {
        res.json(dbWorkout);
    }).catch(err => {
        res.json(err);
    });

});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/exercise.html"));
});

app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/stats.html"));
});


// Start the server
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});







