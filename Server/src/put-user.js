const { ObjectId } = require("mongodb")
const getDB = require('./connection')
const select = require('./select-data')

async function putUser(userId, dataField, newData) {
    let error = ""
    const user = await select('Users', userId)

    let db = await getDB()
    let col = db.collection("Users")
    let commentsCol = db.collection("Comments")

    if (user[dataField] !== newData) {
        const checkNewData = await col.findOne({ [dataField]: newData })
        if (!checkNewData) {
            const query = {
                _id: new ObjectId(userId)
            }

            const updateQuery = {
                $set: {
                    [dataField]: newData
                }
            }

            const result = await col.updateOne(query, updateQuery)

            if (dataField === 'username' && result.modifiedCount > 0) {
                const commentsUpdateQuery = {
                    $set: { "comments.$[elem].username": newData }
                }
                const arrayFilters = [{ "elem.user_id": new ObjectId(userId) }]

                const updateComments = await commentsCol.updateMany(
                    {},
                    commentsUpdateQuery,
                    { arrayFilters: arrayFilters }
                )
            }

            return result
        } else {
            error = "già in uso"
            throw error
        }
    } else {
        error = "non valido"
        throw error
    }


}

module.exports = putUser