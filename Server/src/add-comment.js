//ok
const { ObjectId } = require("mongodb")
const getDB = require('./connection')
const select = require('./select-data')

async function addComment(animeId, user, userId, newComment) {
    const allComments = await select('Comments', animeId)
    const time = new Date()
    const formattedDate = time.toLocaleString()

    let db = await getDB()
    let col = db.collection('Comments')

    const comment = {
        _id: new ObjectId(),
        user_id: new ObjectId(userId),
        username: user,
        data: formattedDate,
        comment: newComment
    }

    if (allComments) {
        const updateResult = await col.updateOne(
            { _id: new ObjectId(animeId) },
            {
                $push: {
                    comments: {
                        $each: [comment],
                        $position: 0,
                    }
                }
            }
        )
        return

    } else {
        const newComments = {
            _id: new ObjectId(animeId),
            comments: []
        }

        newComments.comments.push(comment)

        const result = await col.insertOne(newComments)
        return
    }
}

module.exports = addComment