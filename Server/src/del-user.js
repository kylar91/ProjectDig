const { ObjectId } = require("mongodb")
const getDB = require('./connection')
const logout = require('./logout-user')

async function delUser(userId, token) {

    let db = await getDB()
    let col = db.collection("Users")

    let result = await col.deleteOne({ _id: new ObjectId(userId) })

    if (result.deletedCount > 0) {
        col = db.collection("List")

        result = await col.deleteOne({ _id: new ObjectId(userId) })

        let commentsCol = db.collection("Comments")
        const commentsUpdateQuery = {
            $set: { "comments.$[elem].username": 'Utente Rimosso' }
        };
        const arrayFilters = [{ "elem.user_id": new ObjectId(userId) }];

        const updateComments = await commentsCol.updateMany(
            {},
            commentsUpdateQuery,
            { arrayFilters: arrayFilters }
        );

        result = await logout({ token })

        return result

    } else {
        throw new Error('Qualcosa è andato storto!')
    }
}

module.exports = delUser