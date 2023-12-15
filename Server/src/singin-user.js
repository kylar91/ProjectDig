const getDB = require('./connection')

async function singin({ email, username, password }) {
    let db = await getDB()
    let col = db.collection("Users")

    const checkEmail = await col.findOne({ email })
    const checkUsername = await col.findOne({ username })

    if (checkEmail || checkUsername) {
        let error = ''
        if (checkEmail) {
            error = "email già in uso."
        }
        if (checkUsername) {
            if (!error) {
                error = "username già in uso."
            } else {
                mess = "username e "
                error = mess + error
            }
        }
        throw error
    }

    let user = {
        email,
        username,
        password
    }

    const result = await col.insertOne(user)

    return result
}

module.exports = singin