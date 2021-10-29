import mongoose from "mongoose";

// Make typescript aware of our schema def
interface ITodo {
  title: string;
  description: string;
}

interface TodoModelInterface extends mongoose.Model<TodoDoc> {
  build(attr: ITodo): any;
}

interface TodoDoc extends mongoose.Document {
  title: string;
  description: string;
}

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

// SO we can call build directly on our Todo model
todoSchema.statics.build = (attr: ITodo) => {
  return new Todo(attr);
};

const Todo = mongoose.model<TodoDoc, TodoModelInterface>("Todo", todoSchema);

export { Todo };
