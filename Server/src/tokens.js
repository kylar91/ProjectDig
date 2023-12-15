const getDB = require('./connection')

async function tokens({ token }) {
    let db = await getDB()
    let col = db.collection("Tokens")

    const result = await col.insertOne({ token })

    return result
}

module.exports = tokens