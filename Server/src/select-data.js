const { ObjectId } = require("mongodb")
const getDB = require('./connection')

async function select(nameColl, id) {
  let db = await getDB()
  let col = db.collection(nameColl)


  return document = id ? await col.findOne({ "_id": new ObjectId(id) }) :
    await col.find({}).toArray()

}

module.exports = select