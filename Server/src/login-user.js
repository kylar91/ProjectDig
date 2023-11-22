const connection = require('./connection')

async function login({ username }) {
    let db = await connection()
    let col = db.collection("Users");

    const result = await col.findOne({ username });

    return result
}

module.exports = login