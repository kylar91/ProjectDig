//ok
const { compareSync } = require('bcryptjs');
const connection = require('./connection')

async function register({ email, username, password }) {
    let db = await connection()
    let col = db.collection("Users");

    const checkEmail = await col.findOne({ email })
    const checkUsername = await col.findOne({ username })

    if (checkEmail || checkUsername) {
        let error = ''
        if (checkEmail) {
            error = "email già in uso."
        }
        if (checkUsername) {
            error = "username già in uso."
        }
        throw error
    }

    let user = {
        email,
        username,
        password
    }

    const result = await col.insertOne(user);

    return result
}

module.exports = register