//ok
const connection = require('./connection')

async function logout({ token }) {
    let db = await connection()
    let col = db.collection("Tokens")

    const result = await col.deleteOne({ token })

    return result
}

module.exports = logout