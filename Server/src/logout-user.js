//ok
const getDB = require('./connection')

async function logout({ token }) {
    let db = await getDB()
    let col = db.collection("Tokens")

    const result = await col.deleteOne({ token })

    return result
}

module.exports = logout