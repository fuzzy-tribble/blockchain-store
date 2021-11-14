// TODO - error checking fuckup proofing
import "../src/lib/env";
import mongoose from "mongoose";
// import readline from "readline";

// const collection = process.argv[2];

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// rl.question(
//   `Are you sure you want to permanently drop this collection: ${collection}? `,
//   function (answer) {
//     if (answer.toLowerCase() == "y") {
//       dropCollection(collection);
//     }
//     rl.close();
//   }
// );

// const dropCollection = (collection: string) => {
//   console.log(`Dropping collection: collection...`);
//   try {
//     mongoose.connect(process.env.MONGODB_URL);
//     mongoose.connection.db.dropCollection(collection);
//     console.log(`Dropped ${collection}.`);
//   } catch (err) {
//     console.log(`Encountered a wee problem: ${err}.`);
//   } finally {
//     mongoose.connection.close();
//   }
// };

const dropDatabase = async () => {
  console.log(`Dropping collections...`);
  try {
    await mongoose.connect(process.env.MONGODB_URL as string);
    let dbName = mongoose.connection.db.databaseName;
    if (dbName == "test") {
      mongoose.connection.db.dropDatabase();
    } else {
      throw Error(`Can't drop ${dbName}. Its not a test databases`);
    }
  } catch (err) {
    console.log(`Encountered a wee problem: ${err}.`);
  } finally {
    mongoose.connection.close();
  }
};

dropDatabase();
