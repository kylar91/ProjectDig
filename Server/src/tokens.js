//ok
const connection = require('./connection')

async function tokens({ token }) {
    let db = await connection()
    let col = db.collection("Tokens")

    const result = await col.insertOne({ token })

    return result
}

module.exports = tokens