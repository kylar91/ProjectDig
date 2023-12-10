//ok
const { ObjectId } = require("mongodb")
const connection = require('./connection')

async function delOnList(animeId, userId, nameList) {
    let db = await connection()
    let col = db.collection("List")

    const query = {
        _id: new ObjectId(userId)
    };

    const updateQuery = {
        $pull: {
            [`${nameList}`]: {
                _id: new ObjectId(animeId)
            }
        }
    };

    const result = await col.updateOne(query, updateQuery);

    return result
}

module.exports = delOnList