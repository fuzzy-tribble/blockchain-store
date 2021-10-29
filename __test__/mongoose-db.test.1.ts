import mongoose from "mongoose";
import { Todo } from "./models/todo";

mongoose
  .connect("mongodb://127.0.0.1:27017/test")
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });

const todo = Todo.build({
  title: "sometitle",
  description: "some description",
});

todo
  .save()
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });

// const todo = await Todo.find({});
