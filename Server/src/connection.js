//ok
const { MongoClient } = require("mongodb");

const url = process.env.CONNECTION_STRING;
const dbName = "AnimeList";
const client = new MongoClient(url);

let db;

async function connectDB() {
  if (db) {
    return db;
  }

  try {
    await client.connect();
    db = client.db(dbName);
    console.log("Connected successfully to MongoDB");
  } catch (err) {
    console.error("Could not connect to MongoDB", err);
  }

  return db;
}

async function getDB() {
  if (!db) {
    await connectDB();
  }
  return db;
}

module.exports = getDB














// const { MongoClient } = require("mongodb");
// const url = process.env.CONNECTION_STRING
// const client = new MongoClient(url);
// const dbName = "AnimeList";
// let isConnected = false

// async function connection() {

//   try {
//     // Connect to the Atlas cluster
//     if (!isConnected) {
//       await client.connect();
//     }

//     return client.db(dbName);

//   } catch (err) {
//     console.log(err.stack);
//   }

// }

// module.exports = connection