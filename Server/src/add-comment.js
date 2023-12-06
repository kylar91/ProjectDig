//ok
const { ObjectId } = require("mongodb")
const connection = require('./connection')
const select = require('./select-data')

async function addComment(animeId, userId, newComment) {
    const allComments = await select('Comments', animeId)
    const user = await select('Users', userId)
    const time = new Date()
    const formattedDate = time.toLocaleString()

    let db = await connection()
    let col = db.collection('Comments')

    const comment = {
        _id: new ObjectId(userId),
        username: user.username,
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