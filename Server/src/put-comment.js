//no
const { ObjectId } = require("mongodb")
const connection = require('./connection')

async function putComment(animeId, commentId, newText) {

    let db = await connection()
    let col = db.collection("Comments")

    const query = {
        _id: new ObjectId(animeId),
        "comments._id": new ObjectId(commentId)
    };

    const updateQuery = {
        $set: {
            "comments.$.comment": newText
        }
    };

    const result = await col.updateOne(query, updateQuery);

    return result

}

module.exports = putComment