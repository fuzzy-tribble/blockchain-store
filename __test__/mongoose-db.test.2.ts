import mongoose from "mongoose";
import Persons from "./models/person";

mongoose
  .connect("mongodb://127.0.0.1:27017/test")
  .then((res) => {
    console.log("CONNECTED");
    // console.log(res);
  })
  .catch((err) => {
    console.log("ERROR CONNECTING");
    console.log(err);
  });

// const p = new Persons({
//   name: "sarah",
//   surname1: "sanders",
//   age: 33,
// });

// p.save()
//   .then((res) => {
//     console.log("SAVE RESULT");
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log("ERROR SAVING");
//     console.log(err);
//   });

Persons.findPeopleOlderThan(25)
  .then((persons) => {
    // console.log(persons);
    persons.forEach((person) => {
      console.log(person.getCompleteName());
    });
  })
  .catch((err) => {
    console.log(err);
  });
