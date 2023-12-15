const { MongoClient } = require("mongodb")

const url = process.env.CONNECTION_STRING
const dbName = "AnimeList"
const client = new MongoClient(url)

let db

async function connectDB() {
  if (db) {
    return db
  }

  try {
    await client.connect()
    db = client.db(dbName)
    console.log("Connected successfully to MongoDB")
  } catch (err) {
    console.error("Could not connect to MongoDB", err)
  }

  return db
}

async function getDB() {
  if (!db) {
    await connectDB()
  }
  return db
}

module.exports = getDB