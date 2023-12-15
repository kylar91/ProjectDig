const { ObjectId } = require("mongodb")
const getDB = require('./connection')

async function delComment(animeId, commentId) {

    let db = await getDB()
    let col = db.collection("Comments")

    const query = {
        _id: new ObjectId(animeId)
    }

    const updateQuery = {
        $pull: {
            comments: {
                _id: new ObjectId(commentId)
            }
        }
    }

    const result = await col.updateOne(query, updateQuery)
    return result

}

module.exports = delComment