//ok
const getDB = require('./connection')

async function login({ username }) {
    let db = await getDB()
    let col = db.collection("Users")

    const result = await col.findOne({ username })

    return result
}

module.exports = login