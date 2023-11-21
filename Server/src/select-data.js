//ok
const { ObjectId } = require("mongodb");
const connection = require('./connection')

async function select(id) {
  // Reference the "people" collection in the specified database
  let db = await connection()
  let col = db.collection("Anime");

  // Find and return the document
  return document = id ? await col.findOne({ "_id": new ObjectId(id) }) :
    await col.find({}).toArray()

}

module.exports = select