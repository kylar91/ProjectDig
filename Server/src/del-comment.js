//ok
const { ObjectId } = require("mongodb")
const connection = require('./connection')

async function delComment(animeId, commentId) {

    let db = await connection()
    let col = db.collection("Comments")

    const query = {
        _id: new ObjectId(animeId)
    };

    const updateQuery = {
        $pull: {
            comments: {
                _id: new ObjectId(commentId)
            }
        }
    }

    const result = await col.updateOne(query, updateQuery);
    return result

}

module.exports = delComment