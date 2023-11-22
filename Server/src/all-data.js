//ok
const connection = require('./connection')

async function all() {
    let db = await connection()
    let col = db.collection("Anime");

    // Find and return the document
    let result = await col.find().toArray()

    return result

}

module.exports = all