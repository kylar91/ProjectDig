//ok
const { MongoClient } = require("mongodb");
const url = process.env.CONNECTION_STRING
const client = new MongoClient(url);
const dbName = "AnimeList";
let isConnected = false

async function connection() {

  try {
    // Connect to the Atlas cluster
    if (!isConnected) {
      await client.connect();
    }

    return client.db(dbName);

  } catch (err) {
    console.log(err.stack);
  }

}

module.exports = connection